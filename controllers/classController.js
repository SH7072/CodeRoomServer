const Class = require('../models/Class');
const User = require("../models/User");
const { nanoid } = require('nanoid');



exports.joinClass = async (req, res,next) => {
    try {
        const classCode = req.body.classCode;
        const userId = req.userId;
        console.log(classCode, userId);

        //check if class exists
        const class_ = await Class.findOne({ classCode: classCode });

        if (!class_) {
            const error = new Error("Class not found");
            error.statusCode = 404;
            throw error;
        }

        //check if user is not a teacher of the class

        class_.classTeachers.forEach(teacher => {
            if (teacher.teacherId.toString() === userId.toString()) {
                const error = new Error("You are already a teacher of this class");
                error.statusCode = 403;
                throw error;
            }
        });

        //check if user is not a student of the class
        class_.classStudents.forEach(student => {
            if (student.studentId.toString() === userId.toString()) {
                const error = new Error("You are already a student of this class");
                error.statusCode = 403;
                throw error;
            }
        });


        const response = await Class.findOneAndUpdate({ classCode: classCode }, {
            $push: {
                classStudents: { studentId: userId }
            },
        }, {
            new: true
        });

        const user = await User.findOneAndUpdate({ _id: userId }, {
            $push: {
                classesAsStudent: { classId: class_.id }
            },
        }, {
            new: true
        });

        // console.log(response);
        res.status(200).json({
            message: "Class joined",
            class: response,
            user: user
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


exports.createClass = async (req, res,next) => {
    try {

        const { className, section, subject } = req.body;
        const userId = req.userId;
        // console.log(className, section, subject, userId);
        const class_ = await Class.create({
            className: className,
            section: section,
            subject: subject,
            classCode: nanoid(6),
            classTeachers: [{ teacherId: userId }],
            classOwner: userId
        });


        const user = await User.findByIdAndUpdate(userId, {
            $push: {
                classesAsTeacher: { classId: class_.id }
            },
        }, {
            new: true
        });

        // const result = await Class.save();

        // console.log(class_);
        res.status(200).json({
            message: "Class created",
            class: class_,
            user: user
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

const getRole = (class_, userId) => {

    // console.log(class_, userId);
    let flag = 0;
    class_.classTeachers.forEach(teacher => {
        if (teacher.teacherId._id.toString() === userId.toString()) {
            flag = 1;
        }
    });

    if (flag == 1) {
        return "teacher";
    }
    return "student";
}

exports.getClassInfo = async (req, res,next) => {
    try {
        const classId = req.params.id;
        const class_ = await Class.findById(classId)
            .populate('classTeachers.teacherId')
            .populate('classStudents.studentId')
            .populate('classOwner');


        if (!class_) {
            const error = new Error("Class not found");
            error.statusCode = 404;
            throw error;
        }

        const userId = req.userId;

        let role = getRole(class_, userId);
        // console.log("role:", role);

        res.status(200).json({
            message: "Class Info",
            class: class_,
            role: role
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

exports.getAllClassRooms = async (req, res,next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('classesAsTeacher.classId').populate('classesAsStudent.classId');
        // console.log(user);

        // console.log("getAllClassRooms");
        // console.log(user);

        res.status(200).json({
            message: "All Class Rooms",
            classRooms: {
                classesAsTeacher: user.classesAsTeacher,
                classesAsStudent: user.classesAsStudent
            }
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

exports.editClass = async (req, res,next) => {
    try {
        const classId = req.params.id;
        const { className, section, subject } = req.body;
        const userId = req.userId;

        //check if user is teacher of class
        const class_ = await Class.findById(classId);
        if (!class_) {
            const error = new Error("Class not found");
            error.statusCode = 404;
            throw error;
        }

        if (class_.classTeachers.filter(teacher => teacher.teacherId.toString() === userId.toString()).length === 0) {
            const error = new Error("User not authorized");
            error.statusCode = 401;
            throw error;
        }

        //update class

        const updatedClass = await Class.findByIdAndUpdate(classId, {
            className: className,
            section: section,
            subject: subject
        }, {
            new: true
        });

        res.status(200).json({
            message: "Class updated",
            class: updatedClass
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

exports.unenrollFromClass = async (req, res,next) => {
    try {
        const classId = req.params.id;
        const userId = req.userId;

        //check if user is student of class
        const class_ = await Class.findById(classId);
        if (!class_) {
            const error = new Error("Class not found");
            error.statusCode = 404;
            throw error;
        }

        if (class_.classStudents.filter(student => student.studentId.toString() === userId.toString()).length === 0) {
            const error = new Error("User not authorized");
            error.statusCode = 401;
            throw error;
        }

        //update class

        const updatedClass = await Class.findByIdAndUpdate(classId, {
            $pull: {
                classStudents: { studentId: userId }
            },
        }, {
            new: true
        });

        // update user

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: {
                classesAsStudent: { classId: classId }
            },
        }, {
            new: true
        });

        res.status(200).json({
            message: "Unenrolled from class",
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