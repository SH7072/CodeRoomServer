const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

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

}, { timestamp: true });

module.exports = mongoose.model("Comment", commentSchema);
