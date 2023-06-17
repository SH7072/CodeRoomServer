const  mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

    classId: {
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true,
    },
    
    announcement: {
        type: String,
        required: true,
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

    commnets:[
        {
            commentId:{
                type:mongoose.Schema.ObjectId,
                ref:"Comment",
                required:true,
            },

        }
    ],

    assignedTo:[
        {
            studentId:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },

        }
    ],
    
    attachments:[{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },

    }],

}, { timestamp: true });

module.exports = mongoose.model("Announcement", announcementSchema);
