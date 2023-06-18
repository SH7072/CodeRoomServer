const express = require("express");
const router = express.Router();

const { createAnnouncement, getAnnouncements,announcementPostComments}= require('../controllers/announcementController');
const { isAuth } = require('../middleware/isAuth');
const { uploadToS3 } = require("../utils/s3");


// create anouncement
router.post('/createannouncement',isAuth, uploadToS3 ,createAnnouncement);

// get All Announcements
router.get('/getannouncement',isAuth,getAnnouncements);

router.post('/announcementpostcomment',isAuth,announcementPostComments);

module.exports = router;