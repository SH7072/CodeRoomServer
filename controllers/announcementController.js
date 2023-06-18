const Announcement = require("../models/Announcement");
const ClassWork = require("../models/Announcement");


// router.post('/create', isAuth, createAnnouncement);
// router.get('/getAnnouncementInfo/:id', isAuth, getAnnouncementInfo);
// router.post('/editAnnouncement/:id', isAuth, editAnnouncement);
// router.post('/deleteAnnouncement/:id', isAuth, deleteAnnouncement);
// router.post('/addComment/:id', isAuth, addComment);
// router.post('/deleteComment/:id', isAuth, deleteComment);

exports.createAnnouncement = async (req, res) => {
    try {
        const { description, classId } = req.body;

        const announcement = new Announcement({

            announcement: description,
            classId,
            announcementBy: req.userId
        });

        const result = await announcement.save();

        res.status(201).json({
            message: "Announcement created",
            announcementId: result._id,
        });

    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
exports.getAnnouncements = async (req, res) => {

try {
        const classId = req.params.classId;
        // const userId=req.params.userId;

        const announcement = await Announcement.find({ classId }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Announcement fetched",
            announcement: announcement

        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
// exports.getComments =async(req,res)=>{
//     try{
//         const announcementId=req.params.announcementId;
//         const announcement=await Announcement.findById(announcementId);
//         res.status(200).json({
//             message:"Comments fetched",
//             comments:announcement.comments
//         });
//     }
//     catch(err) {
//         console.log(err);
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

exports.announcementPostComments = async (req, res) => {
    try{
        const {announcementId,userId,description}=req.body;
        const announcement = await Announcement.findById(announcementId);
        
        const comments= new Comments({
            comment:description,
            commentBy:userId,
            
        });
        const result =await comments.save();

        announcement.comments.push(result._id);    
        const result1 = await announcement.save();

        res.status(201).json({
            message:"Comment posted",
            classworkId:result1._id,
        });

    }
    catch(err){
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
