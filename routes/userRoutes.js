const express = require("express");
const User =require("../models/User");
const { signup, login } = require('../controllers/userController');
const { check, body } = require('express-validator');


const router = express.Router();

router.post('/signup', [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a non-empty name"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid phone number")
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value });

                if (user) {
                    return Promise.reject("User already exists");
                }

                return Promise.resolve();
            } catch (err) {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }

                next(err);
            }
        }),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage(
            "Password must contain at least 6 characters "
        ),
    body("dob")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a non-empty DOB"),

], signup);

router.post('/login', [
    body("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a email "),
    body("password").trim().not().isEmpty().withMessage("Enter a password"),
], login);

module.exports = router;