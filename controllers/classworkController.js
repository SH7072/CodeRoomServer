const ClassWork = require("../models/ClassWork");

exports.createClassWork = async (req, res, next) => {
    try {
        const { title, type, instructions, dueDate, points, topic, file, classId, assignedTo } = req.body;
        // console.log(req.body);

        console.log(req.body);
        console.log(req.body.file);
        console.log(req.file);

        const classWork = new ClassWork({
            classId,
            type,
            title,
            instructions,
            topic,
            dueDate,
            classWorkMarks: points,

        });


        // const result = await classWork.save();

        // res.status(201).json({
        //     message: "Classwork created",
        //     classWorkId: result._id,
        // });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteClasswork = async (req, res, next) => {
    try {
        const classworkId = req.body.classworkId;
        const classwork = await Classwork.findByIdAndRemove(classworkId);
        res.status(200).json({
            message: "Classwork deleted",
            classwork
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

exports.updateClasswork = async (req, res, next) => {
    try {
        const { classworkId, title, description, deadline } = req.body;
        const classwork = await Classwork.findById(classworkId);
        classwork.title = title;
        classwork.description = description;
        classwork.deadline = deadline;
        const result = await classwork.save();
        res.status(200).json({
            message: "Classwork updated",
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
};

exports.getClasswork = async (req, res, next) => {
    try {
        const classworkId = req.body.classworkId;
        const classwork = await Classwork.findById(classworkId);
        res.status(200).json({
            message: "Classwork fetched",
            classwork
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


//????????????
// exports.getAllClasswork=async(req,res,next)=>{
//     try{
//         const classId=req.body.classId;
//         const classwork=await Classwork.find({classId});
//         res.status(200).json({
//             message:"Classwork fetched",
//             classwork
//         });
//     }
//     catch(err){
//         console.log(err);
//         if(!err.statusCode){
//             err.statusCode=500;
//         }
//         next(err);
//     }
// };

exports.submitClasswork = async (req, res, next) => {
    try {
        const { classworkId, userId, submission } = req.body;
        const classwork = await Classwork.findById(classworkId);
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
        const classwork = await Classwork.findById(classworkId);
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
        const classwork = await Classwork.findById(classworkId);
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
