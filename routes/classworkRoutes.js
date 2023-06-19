const express = require("express");
const router = express.Router();
const multer = require('multer');
const { createClassWork, getClassWork, updateClassWork, deleteClassWork, classworkPostComment, getClassWorkInfo,submitClasswork,getSubmissionsByUser,getSubmissions} = require('../controllers/classworkController');
// const { check, body } = require('express-validator');

const { isAuth, isTeacherOrOwner } = require('../middleware/isAuth');
const { uploadToS3 } = require("../utils/s3");

// Creating new Classwork {only teacher and owner can create a course }
router.post('/createClassWork/', isAuth,isTeacherOrOwner, uploadToS3, createClassWork);

// Deleting Classwork {only teacher's and owner can delete a course }
router.delete('/deleteClassWork/:classWorkId', isAuth, isTeacherOrOwner, deleteClassWork);

// Updating Classwork {only teacher and owner can update a course }
router.put('/updateClassWork/:classWorkId', isAuth, isTeacherOrOwner,uploadToS3 , updateClassWork);

// get all classwork for a class
router.get('/getclassWork/:classId', isAuth, getClassWork);

//get classwork details {Assignment Details}
router.get('/getClassWorkInfo/:classWorkId', isAuth, getClassWorkInfo);

//post comments to a classwork
router.post('/postCommnet/:classWorkId', isAuth, classworkPostComment);

// submit assignment


module.exports = router;
