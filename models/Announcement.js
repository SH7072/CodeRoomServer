const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

    classId: {
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true,
    },
    announcement: {
        type: String,
        required: false,
    },
    announcementBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    announcementDate: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            commentId: {
                type: mongoose.Schema.ObjectId,
                ref: "Comment",
                required: true,
            },

        }
    ],
    assignedTo: [
        {
            studentId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },

        }
    ],
    attachments: [{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    }],
}, { timestamp: true });

module.exports = mongoose.model("Announcement", announcementSchema);
