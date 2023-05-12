const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },

    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        // minlength: 6,
        // select: false,
    },

    dob: {
        type: Date,
        default: Date.now,
        required: [true, "Please provide a date of birth"],
    },

    avatar: {
        public_id: {
            type: String,
            // required: true,
        },
        url: {
            type: String,
            // required: true,
        },
    },

    classes:
        [
            {
                classId: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Class",
                    // required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],

    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamp: true });

module.exports = mongoose.model("User", userSchema);