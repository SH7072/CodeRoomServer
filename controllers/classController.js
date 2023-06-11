const Class = require('../models/Class');
const User = require("../models/User");
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');


exports.joinClass = async (req, res) => {
    try {
        const classCode = req.body.classCode;
        const userId = req.userId;
        console.log(classCode, userId);

        const class_ = await Class.findOne({ classCode: classCode });

        if (!class_) {
            const error = new Error("Class not found");
            error.statusCode = 404;
            throw error;
        }

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


exports.createClass = async (req, res) => {
    try {

        const { className, section, subject } = req.body;
        const userId = req.userId;
        console.log(className, section, subject, userId);
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

        console.log(class_);
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

exports.getClassInfo = async (req, res) => {
    try {
        const classId = req.params.id;
        const class_ = await Class.findById(classId)
            .populate('classTeachers.teacherId')
            .populate('classStudents.studentId')
            .populate('classOwner');

        console.log(class_, "getClassInfo");

        res.status(200).json({
            message: "Class Info",
            class: class_
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

exports.getAllClassRooms = async (req, res) => {
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
