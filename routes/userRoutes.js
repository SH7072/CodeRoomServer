const express = require("express");
const User = require("../models/User");
const { signup, login } = require('../controllers/userController');
const { check, body } = require('express-validator');


const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

module.exports = router;