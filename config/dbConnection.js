const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        //    const user=new User({
        //     name:'shub',
        //     email:'shub@gmail.com',
        //     password:'1234435',
        //     dob:'1999-12-12',
        //    });
        //    user.save(); 
        console.log("Connected to MongoDB ");
    })
    .catch(err => {
        console.log(err);
    });