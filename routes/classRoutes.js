const express = require("express");
const router = express.Router();
const { isAuth } = require('../middleware/isAuth');
const { createClass, getClassInfo, joinClass, getAllClassRooms, editClass, unenrollFromClass } = require("../controllers/classController");

router.post('/create', isAuth, createClass);
router.get('/getClassInfo/:id', isAuth, getClassInfo);
router.post('/join', isAuth, joinClass);
router.get('/getAllClassRooms', isAuth, getAllClassRooms);
router.post('/editClass/:id', isAuth, editClass);
router.post('/unenrollFromClass/:id', isAuth, unenrollFromClass);


module.exports = router;