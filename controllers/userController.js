const User = require('../models/User');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken')

exports.signup = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;

        }

        const { name, email, password, dob } = req.body;
        await User.findOne({ email: email })
            .then(user => {
                if (user) {
                    const error = new Error("Email already Used. Please use a different email");
                    error.statusCode = 409;
                    throw error; 
                }
            })
            .catch(err => {
                // console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }

            });


        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            dob,
        });
        const result = await user.save();
        res.status(201).json({
            message: "User created",
            userId: result._id,
        });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login =async (req,res,next)=>{

    try{
        const {email,password}=req.body;

        const user= await User.find({email})
        
            if(!user)
            {
                const error= new Error("Cannot find a user with this email");
                if(!error.statusCode)
                {
                    error.statusCode=404;
                }

                throw error;

            }
            const isEqual= bcrypt.compare(password,user.password);
            if(!isEqual)
            {
                const error= new Error("Wrong Password");
                if(!error.statusCode)
                {
                    error.statusCode=401;
                }

                throw error;
            }            
            
            const token=jwt.sign(
                {
                    email:user.email,
                    userId:user._id.toString()
            
                },process.env.JWT_SECRET,
                {expiresIn : '2h'}
            );
            res.status(200).json({token:token,userId:user._id.toString()});

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};