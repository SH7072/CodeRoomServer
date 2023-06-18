const express = require("express");
const router = express.Router();
const multer = require('multer');
const { createClassWork, getClassWork, updateClasswork, deleteClasswork, getSubmissionsByUser, } = require('../controllers/classworkController');
// const { check, body } = require('express-validator');

const { isAuth, isTeacherOrOwner } = require('../middleware/isAuth');
const { uploadToS3 } = require("../utils/s3");

// Creating new Classwork {only teacher and owner can create a course }

router.post('/createClassWork/', isAuth, uploadToS3, createClassWork);

// Deleting Classwork {only teacher's and owner can delete a course }
router.delete('/deleteclasswork', isAuth, isTeacherOrOwner, deleteClasswork);

// Updating Classwork {only teacher and owner can update a course }
router.put('/updateclasswork', isAuth, isTeacherOrOwner, updateClasswork);

router.get('/getclassWork/:classId', isAuth, getClassWork);

module.exports = router;
