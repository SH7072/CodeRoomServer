const jwt = require('jsonwebtoken');
const Class = require('../models/Class');

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();

}

exports.isTeacherOrOwner = async (req, res, next) => {
    const userId = req.userId;
    const { classId } = req.body;
    const user = await Class.findOne({ _id: classId, $or: [{ 'classTeachers.teacherId': userId }, { 'classOwner': userId }] })
    // console.log(user);
    if (!user) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
    }
    next();
};