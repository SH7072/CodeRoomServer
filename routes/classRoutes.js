const express = require("express");
const router = express.Router();
const { isAuth } = require('../middleware/isAuth');
const { createClass, getClassInfo, joinClass, getAllClassRooms } = require("../controllers/classController");

router.post('/create', isAuth, createClass);
router.get('/getClassInfo/:id', isAuth, getClassInfo);
router.post('/join', isAuth, joinClass);
router.get('/getAllClassRooms', isAuth, getAllClassRooms);

module.exports = router;