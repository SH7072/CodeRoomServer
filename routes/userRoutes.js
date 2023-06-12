const express = require("express");

const { signup, login, getUserInfo, archiveClass } = require('../controllers/userController');
const { check, body } = require('express-validator');

const router = express.Router();

const { isAuth } = require('../middleware/isAuth');


router.post('/signup', [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a non-empty name"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid phone number"),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage(
            "Password must contain at least 6 characters "
        ),

], signup);

router.post('/login', [
    body("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a email "),
    body("password").trim().not().isEmpty().withMessage("Enter a password"),
], login);

router.get('/getUserInfo', isAuth, getUserInfo);
router.post('/archiveClass/:id', isAuth, archiveClass);

module.exports = router;