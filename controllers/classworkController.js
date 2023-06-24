const Class = require("../models/Class");
const ClassWork = require("../models/ClassWork");
const Comment = require("../models/Comments");
const { deleteFile } = require("../utils/s3");

exports.createClassWork = async (req, res, next) => {
    try {
        const { title, type, instructions, dueDate, points, topic, files, classId, assignedTo } = req.body;
        // console.log(req.body);

        // console.log(req.body);
        // console.log(req.body.files);
        // console.log(req.files);

        const classWorkFile = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                classWorkFile.push({
                    url: req.files[i].location,
                    public_id: req.files[i].key,
                    type: req.files[i].mimetype,
                });
            }
        }


        let classWork;
        if (dueDate === 'null') {
            classWork = new ClassWork({
                classId,
                type,
                title,
                instructions,
                topic,
                classWorkMarks: points,
                classWorkFile: classWorkFile,
            });
        }
        else {
            classWork = new ClassWork({
                classId,
                type,
                title,
                instructions,
                topic,
                dueDate,
                classWorkMarks: points,
                classWorkFile: classWorkFile,
            });
        }

        const result = await classWork.save();

        console.log(result);

        res.status(201).json({
            message: "Classwork created",
            classWork: result,
        });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteClassWork = async (req, res, next) => {
    try {
        const { classWorkId } = req.params;

        const classWork = await ClassWork.findById(classWorkId);

        //check if user is teacher in the Class or not
        const classId = classWork.classId;
        const userId = req.userId;

        const user = await Class.findOne({ _id: classId, $or: [{ 'classTeachers.teacherId': userId }, { 'classOwner': userId }] })
        // console.log(user);
        if (!user) {
            const error = new Error("Not Authorized");
            error.statusCode = 401;
            throw error;
        }

        //delete classWork

        const result = await ClassWork.findByIdAndRemove(classWorkId);

        //remove files from s3 bucket

        classWork.classWorkFile.forEach(async file => {
            const res = await deleteFile(file.public_id);
        });

        //TO BE DONE - handle Comments


        res.status(200).json({
            message: "Classwork deleted",
            classWork
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateClassWork = async (req, res, next) => {
    try {
        const classWorkId = req.params.classWorkId;
        const { title, type, instructions, dueDate, points, topic, oldFiles, files, classId, assignedTo } = req.body;

        // console.log(req.body, "req.body");
        // console.log(req.files, "req.files");
        // console.log(oldFiles, "oldFiles");
        //parse the oldFiles
        // console.log(JSON.parse(oldFiles[0]));

        // console.log(files, "files");

        const classWorkFile = [];
        if (oldFiles && typeof (oldFiles) === 'string') {
            let parsedFile = JSON.parse(oldFiles);
            classWorkFile.push({
                url: parsedFile.url,
                public_id: parsedFile.public_id,
                type: parsedFile.type,
                _id: parsedFile._id
            });
        }
        else if (oldFiles && typeof (oldFiles) === 'object') {
            for (let i = 0; i < oldFiles.length; i++) {
                let parsedFile = JSON.parse(oldFiles[i]);
                classWorkFile.push({
                    url: parsedFile.url,
                    public_id: parsedFile.public_id,
                    type: parsedFile.type,
                    _id: parsedFile._id
                });
            }
        }

        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                classWorkFile.push({
                    url: req.files[i].location,
                    public_id: req.files[i].key,
                    type: req.files[i].mimetype,
                });
            }
        }

        console.log(classWorkFile);

        //update classwork
        let classWork;
        if (dueDate === 'null') {
            classWork = await ClassWork.findByIdAndUpdate(classWorkId, {
                classId,
                title,
                type,
                instructions,
                classWorkFile,
                classWorkMarks: points,
                topic,
            }, { new: true });
        }
        else {
            classWork = await ClassWork.findByIdAndUpdate(classWorkId, {
                classId,
                title,
                type,
                instructions,
                dueDate,
                classWorkFile,
                classWorkMarks: points,
                topic,
            }, { new: true });
        }

        console.log(classWork);
        res.status(200).json({
            message: "Classwork updated",
            classWork: classWork,
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getClassWork = async (req, res, next) => {
    try {

        const { classId } = req.params;
        const classWork = await ClassWork.find({ classId: classId });

        res.status(200).json({
            message: "Classwork fetched",
            classWork: classWork
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getClassWorkInfo = async (req, res, next) => {
    try {
        const classWorkId = req.params;
        const classWork = await ClassWork.findById(classWorkId);

        res.status(200).json({
            message: "Classwork Details fetched",
            classWork: classWork
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

exports.classworkPostComment = async (req, res, next) => {
    try {
        const classWorkId = req.params;
        const { userId, description } = req.body;
        const classwork = await ClassWork.findById(classWorkId);

        const comments = new Comments({
            comment: description,
            commentBy: userId,

        });
        const result = await comments.save();
        classwork.comments.push(result._id);

        const result1 = await classwork.save();

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

exports.submitClasswork = async (req, res, next) => {
    try {
        const { classworkId, userId, submission } = req.body;
        const classwork = await ClassWork.findById(classworkId);
        classwork.submissions.push({
            userId,
            submission
        });
        const result = await classwork.save();
        res.status(200).json({
            message: "Classwork submitted",
            classworkId: result._id,
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
exports.getSubmissions = async (req, res, next) => {
    try {
        const classworkId = req.body.classworkId;
        const classwork = await ClassWork.findById(classworkId);
        res.status(200).json({
            message: "Submissions fetched",
            submissions: classwork.submissions
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
exports.getSubmissionsByUser = async (req, res, next) => {
    try {
        const { classworkId, userId } = req.body;
        const classwork = await ClassWork.findById(classworkId);
        const submissions = classwork.submissions.filter((submission) => {
            return submission.userId == userId;
        });
        res.status(200).json({
            message: "Submissions fetched",
            submissions
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

