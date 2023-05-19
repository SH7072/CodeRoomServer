const Class = require('../models/Class');
const User = require("../models/User");
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');


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
        const class_ = await Class.findById(classId);
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
