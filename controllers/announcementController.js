const Announcement = require("../models/Announcement");
const Class = require("../models/Class");
const ClassWork = require("../models/ClassWork");
const Comment = require("../models/Comments");

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

        const result = await announcement.save();

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
        const { description } = req.body;
        const userId = req.userId;
        const attachments = [];
        const class_ = await Class.findById(classId);

        if (req.file) {
            attachments.push({
                url: req.file.location,
                public_id: req.file.key,
                type: req.file.mimetype
            });
        }
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
        announcement.announcement = description;
        announcement.attachments = attachments;
        const result = await announcement.save();
        res.status(200).json({
            message: "Announcement updated",
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
        await Announcement.findByIdAndRemove(announcementId);
        res.status(200).json({
            message: "Announcement Deleted Successfully!!"
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
