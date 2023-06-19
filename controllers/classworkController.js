const ClassWork = require("../models/ClassWork");
const Comment = require("../models/Comments");

exports.createClassWork = async (req, res, next) => {
    try {
        const { title, type, instructions, dueDate, points, topic, file, classId, assignedTo } = req.body;
        // console.log(req.body);

        // console.log(req.body);
        // console.log(req.body.file);
        // console.log(req.file);

        const classWorkFile = [];
        if (req.file) {
            classWorkFile.push({
                url: req.file.location,
                public_id: req.file.key,
                type: req.file.mimetype,
            });
        }

        const classWork = new ClassWork({
            classId,
            type,
            title,
            instructions,
            topic,
            dueDate,
            classWorkMarks: points,
            classWorkFile: classWorkFile,
        });

        const result = await classWork.save();

        // console.log(result);

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
        const { classworkId } = req.params;

        const classWork = await ClassWork.findByIdAndRemove(classworkId);
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
        const classworkId = req.params.id;
        const { title, description, deadline } = req.body;
        const attachments = [];

        const classwork = await ClassWork.findById(classworkId);

        if (req.file) {
            attachments.push({
                url: req.file.location,
                public_id: req.file.key,
                type: req.file.mimetype
            });
        }
        if (!classwork) {
            const error = new Error("No classwork found");
            error.statusCode = 404;
            throw error;
        }

        classwork.title = title;
        classwork.description = description;
        classwork.deadline = deadline;
        classwork.classWorkFile = attachments;

        const result = await classwork.save();
        res.status(200).json({
            message: "Classwork updated",
            classworkId: result,
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

