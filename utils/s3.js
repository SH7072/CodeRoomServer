const fs=requrie("fs")
const multer = require("multer");
const multers3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.REGION
});
const bucket = process.env.BUCKET_NAME;


const s3 = new aws.S3();

// upload file to a s3 bucket using multer
exports.upload = multer({
    storage: multers3({
        bucket: bucket,
        s3: s3,
        acl: "public-read",
        key: (req, file, cb) => {
            cb(null, Date.now().toString());
        }
    })
})
// download File from s3
exports.downoladFile = (fileKey)=>{
    const downloadParams = {
        Key: fileKey,
        Bucket: bucket,
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