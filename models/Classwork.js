const mongoose= require("mongoose");

const classWorkSchema=mongoose.Schema({

    classId:{
        type:mongoose.Schema.ObjectId,
        ref:"Class",
        required:true,
    },
    
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,

    },
    topic:{
        type:String,
        required:true,
        default: "No Topic",

    },
    dueDate:{

        type:Date,
        required:true,
        default: "No Due Date"
    },
    classWorkFile:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,

        },
    },
    classWorkMarks:{
        type:Number,
        default:0,
    },
    classWorkComments:[
        {
            comment:{
                type:String,
                required:true,
            },
            commentBy:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            commentDate:{
                type:Date,
                default:Date.now,
            },
        }
    ],

})