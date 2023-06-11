const express = require("express");
const router = express.Router();
const { createClasswork, getClasswork, updateClasswork, deleteClasswork, getSubmissionsByUser, } = require('../controllers/classworkController');
// const { check, body } = require('express-validator');


const { isAuth, isTeacherOrOwner } = require('../middleware/isAuth');


// Creating new Classwork {only teacher and owner can create a course }

router.post('/createclasswork', isAuth, isTeacherOrOwner, createClasswork);

// Deleting Classwork {only teacher's and owner can delete a course }
router.delete('/deleteclasswork', isAuth, isTeacherOrOwner, deleteClasswork);

// Updating Classwork {only teacher and owner can update a course }
router.put('/updateclasswork', isAuth, isTeacherOrOwner, updateClasswork);


router.get('/getclasswork', isAuth, getClasswork);

module.exports = router;
