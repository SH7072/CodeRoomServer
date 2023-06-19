const express = require("express");
const router = express.Router();

const { createAnnouncement, getAnnouncements, announcementPostComments,getAnnouncementComments,editAnnouncement,deleteAnnouncement } = require('../controllers/announcementController');
const { isAuth } = require('../middleware/isAuth');
const { uploadToS3 } = require("../utils/s3");


// create anouncement
router.post('/createAnnouncement', isAuth, uploadToS3, createAnnouncement);

// get All Announcements
router.get('/getAnnouncements/:classId', isAuth, getAnnouncements);

// Edit Announcement
router.post('/editAnnouncement/:classId/:announcementId',isAuth,uploadToS3,editAnnouncement)

// Delete Announcement 
router.delete('/deleteAnnouncement/:classId/:announcementId',isAuth,deleteAnnouncement);

// Get All comments for an Announcement
router.get('/announcementGetComments/:announcementId',isAuth,getAnnouncementComments);

// comment on a particular announcement
router.post('/announcementPostComment/:announcementId', isAuth, announcementPostComments);

module.exports = router;