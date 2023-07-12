const User = require('../models/User');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Class = require('../models/Class');

exports.signup = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { name, email, password } = req.body;

        console.log(name, email, password);

        await User.findOne({ email: email })
            .then(user => {
                if (user) {
                    const error = new Error("Email already Used. Please use a different email");
                    error.statusCode = 409;
                    throw error;
                }
            })
            .catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }

            });


        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const result = await user.save();
        res.status(200).json({
            message: "User created",
            // userId: result,
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

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        const user = await User.find({ email });

        console.log(user);

        if (!user[0]) {
            const error = new Error("Cannot find a user with this email");
            if (!error.statusCode) {
                error.statusCode = 404;
            }
            throw error;
        }
        const isEqual = bcrypt.compare(password, user[0].password);
        if (!isEqual) {
            const error = new Error("Wrong Password");
            if (!error.statusCode) {
                error.statusCode = 401;
            }
            throw error;
        }

        const token = jwt.sign(
            {
                email: user[0].email,
                userId: user[0]._id.toString()

            }, process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'user is loggedIn',
            token: token,
            userId: user[0]
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


exports.getUserInfo = async (req, res, next) => {
    try {
        const userId = req.userId;
        // console.log(userId);
        const user = await User.findById(userId)
        // .populate('classesAsTeacher.classId')
        // .populate({
        //     path: 'classesAsTeacher.classId',
        //     populate: {
        //         path: 'classOwner'
        //     }
        // })
        // .populate('classesAsStudent.classId')
        // .populate({
        //     path: 'classesAsStudent.classId',
        //     populate: {
        //         path: 'classOwner'
        //     }
        // });
        if (!user) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        }

        // console.log('Sending UserInfo', user);

        res.status(200).json({
            message: "User found",
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

exports.archiveClass = async (req, res, next) => {
    try {
        const userId = req.userId;
        const classId = req.params.id;
        console.log(userId, classId);
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        }

        const classIndex = user.classesAsTeacher.findIndex(c => c.classId.toString() === classId.toString());
        if (classIndex < 0) {
            const error = new Error("No class found");
            error.statusCode = 404;
            throw error;
        }

        user.classesAsTeacher[classIndex].isArchived = true;

        await user.save();

        res.status(200).json({
            message: "Class Archived",
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


exports.unarchiveClass = async (req, res, next) => {
    try {
        const userId = req.userId;
        const classId = req.params.id;
        console.log(userId, classId);
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        }

        const classIndex = user.classesAsTeacher.findIndex(c => c.classId.toString() === classId.toString());
        if (classIndex < 0) {
            const error = new Error("No class found");
            error.statusCode = 404;
            throw error;
        }

        user.classesAsTeacher[classIndex].isArchived = false;

        await user.save();

        res.status(200).json({
            message: "Class UnArchived",
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


exports.getPeople = async (req, res, next) => {
    try {
        const userId = req.userId;
        const classId = req.params.classId;
        console.log(userId, classId);

        //get all teachers and students of the class

        const class_ = await Class.findById(classId).populate('classStudents.studentId').populate('classTeachers.teacherId').populate('classOwner');

        if (!class_) {
            const error = new Error("No class found");
            error.statusCode = 404;
            throw error;
        }

        const teachers = class_.classTeachers.map(t => t.teacherId);
        const students = class_.classStudents.map(s => s.studentId);

        console.log(teachers, students);

        res.status(200).json({
            message: "People Fetched",
            teachers: teachers,
            students: students
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


