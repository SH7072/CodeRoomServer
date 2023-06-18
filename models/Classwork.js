const mongoose = require("mongoose");

const classWorkSchema = mongoose.Schema({

    classId: {
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Assignment", "Quiz", "Material"],
    },
    title: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: false,
    },
    topic: {
        type: String,
        required: false,
        default: "No Topic",
    },
    dueDate: {
        type: Date,
        required: false,
    },
    classWorkFile: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,

            },
        }
    ],
    classWorkMarks: {
        type: Number,
        default: 0,
    },
    classWorkComments: [
        {
            comment: {
                type: String,
                required: true,
            },
            commentBy: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            commentDate: {
                type: Date,
                default: Date.now,
            },
        }
    ],

})

module.exports = mongoose.model("ClassWork", classWorkSchema);