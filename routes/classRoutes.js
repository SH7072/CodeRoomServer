const express = require("express");
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { createClass, getClassInfo } = require("../controllers/classController");

router.post('/create', isAuth, createClass);
router.get('/getClassInfo/:id', isAuth, getClassInfo)

module.exports = router;