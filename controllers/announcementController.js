const Announcement = require("../models/Announcement");
const Class = require("../models/Class");
const ClassWork = require("../models/ClassWork");
const Comment = require("../models/Comments");
const { deleteFile } = require("../utils/s3");

exports.createAnnouncement = async (req, res, next) => {
    try {
        const { description, classId } = req.body;
        const userId = req.userId;

        const attachments = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                attachments.push({
                    url: req.files[i].location,
                    public_id: req.files[i].key,
                    type: req.files[i].mimetype,
                });
            }
        }

        const announcement = new Announcement({
            classId,
            announcement: description,
            announcementBy: userId,
            attachments: attachments,
        });

        const result = await (await announcement.save()).populate('announcementBy', "name");


        console.log(result);

        res.status(201).json({
            message: "Announcement created",
            announcement: result,
        });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getAnnouncements = async (req, res, next) => {

    try {
        const classId = req.params.classId;
        // const userId=req.params.userId;

        const announcement = await Announcement.find({ classId }).sort({ createdAt: -1 }).populate("announcementBy", "name").sort({ announcementDate: -1 });
        res.status(200).json({
            message: "Announcement fetched",
            announcement: announcement
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
exports.editAnnouncement = async (req, res, next) => {
    try {
        const { classId, announcementId } = req.params;
        const { description, assignedTo, oldFiles, files } = req.body;
        const userId = req.userId;

        const class_ = await Class.findById(classId);
        const announcement = await Announcement.findById(announcementId);

        const attachments = [];

        console.log(typeof (oldFiles));


        if (oldFiles && typeof (oldFiles) === 'string') {
            let parsedFile = JSON.parse(oldFiles);
            attachments.push({
                url: parsedFile.url,
                public_id: parsedFile.public_id,
                type: parsedFile.type,
                _id: parsedFile._id
            });
        }
        else if (oldFiles && typeof (oldFiles) === 'object') {
            for (let i = 0; i < oldFiles.length; i++) {
                let parsedFile = JSON.parse(oldFiles[i]);
                attachments.push({
                    url: parsedFile.url,
                    public_id: parsedFile.public_id,
                    type: parsedFile.type,
                    _id: parsedFile._id
                });
            }
        }

        console.log(attachments);

        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                attachments.push({
                    url: req.files[i].location,
                    public_id: req.files[i].key,
                    type: req.files[i].mimetype,
                });
            }
        }

        if (!announcement) {
            const error = new Error("Announcement not found");
            error.statusCode = 404;
            throw error;
        }

        // announcement can be deleted by the person who posted it or teachers 
        if ((announcement.announcementBy.toString() !== userId.toString()) || (class_.classTeachers.filter(teacher => teacher.teacherId.toString() === userId.toString()).length === 0)) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(announcementId, {
            announcement: description,
            attachments: attachments,
        }, { new: true }).populate("announcementBy", "name");

        console.log(updatedAnnouncement, "updatedAnnouncement");

        res.status(200).json({
            message: "Announcement updated",
            announcement: updatedAnnouncement
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const { classId, announcementId } = req.params;
        const userId = req.userId;

        const class_ = await Class.findById(classId);
        const announcement = await Announcement.findById(announcementId);

        if (!announcement) {
            const error = new Error("Announcement not found");
            error.statusCode = 404;
            throw error;
        }
        if ((announcement.announcementBy.toString() !== userId.toString()) && (class_.classTeachers.filter(teacher => teacher.teacherId.toString() === userId.toString()).length === 0)) {
            const error = new Error("Not authorized");
            error.statusCode = 403;
            throw error;
        }

        const result = await Announcement.findByIdAndRemove(announcementId);

        result.attachments.forEach(async (attachment) => {
            const res = await deleteFile(attachment.public_id);
        });

        res.status(200).json({
            message: "Announcement Deleted Successfully!!",
            announcement: result
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAnnouncementComments = async (req, res, next) => {
    try {
        const announcementId = req.params.announcementId;
        const announcement = await Announcement.findById(announcementId);
        res.status(200).json({
            message: "Comments fetched",
            comments: announcement.comments
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.announcementPostComments = async (req, res, next) => {
    try {
        const announcementId = req.params.announcementId;
        const { userId, description } = req.body;
        const announcement = await Announcement.findById(announcementId);

        const comments = new Comments({
            comment: description,
            commentBy: userId,

        });
        const result = await comments.save();

        announcement.comments.push(result._id);
        const result1 = await announcement.save();

        res.status(201).json({
            message: "Comment posted",
            classworkId: result1._id,
        });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
