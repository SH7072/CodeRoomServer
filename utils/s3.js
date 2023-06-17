const fs = require("fs");
const multer = require("multer");
const multers3 = require("multer-s3");
const aws = require("aws-sdk");
const crpyto = require("crypto");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.REGION
});
const bucketName = process.env.BUCKET_NAME;

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.mimetype === "application/vnd.ms-powerpoint" ||
        file.mimetype === "application/vnd.oasis.opendocument.text" ||
        file.mimetype === "application/vnd.oasis.opendocument.spreadsheet" ||
        file.mimetype === "application/vnd.oasis.opendocument.presentation"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const fileStorage = multers3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read",
    key: function (req, file, cb) {
        cb(null, crpyto.randomBytes(10).toString("hex") + "-" + file.originalname);
    },
});

exports.uploadToS3 = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}).single('file');



// download File from s3
exports.downloadFile = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
}

// Delete file from s3
exports.deleteFile = (fileKey) => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return s3.deleteObject(deleteParams).promise();
};
