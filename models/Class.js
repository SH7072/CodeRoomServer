const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({

    className:
    {
        type: String,
        required: [true, "Please provide a class name"],
        // maxLength: [30, "Class Name can't exceeds 30 characters "]
    },
    section: {
        type: String,
    },
    subject: {
        type: String,
    },
    description:
    {
        type: String,
        // required: [true, "Please provide a description"],
        // minLength: [30, "Description must be at least 30 characters "],
        // maxLength: [200, "Description can't exceeds 200 characters "],
    },
    classCode:
    {
        type: String,
        required: [true, "Please provide a class code"],
        unique: true,
    },
    classImage:
    {
        public_id:
        {
            type: String,
            // required: true,
        },
        url:
        {
            type: String,
            // required: true,
        },
    },

    classStudents:
        [
            {
                studentId:
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                date:
                {
                    type: Date,
                    default: Date.now,
                },
            }
        ],

    classTeachers:
        [
            {
                teacherId:
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                date:
                {
                    type: Date,
                    default: Date.now,
                },
            }
        ],

    classOwner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }

}, { timestamp: true });


module.exports = mongoose.model("Class", classSchema);
