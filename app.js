const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require("cors");
const multer = require('multer');
const httpServer = require("http").createServer(app);
const { EditorSockets } = require('./controllers/sockets');





dotenv.config({
    path: "./config/config.env",
});
//Db  connection
require('./config/dbConnection');
app.use(express.json({ limit: '50mb' }), express.urlencoded({ extended: true, limit: '50mb' }));

// Importing routes
const user = require('./routes/userRoutes');
const classWork = require('./routes/classworkRoutes');
const class_ = require('./routes/classRoutes');
const announcement = require('./routes/announcementRoutes');


const { uploadToS3, downloadFile } = require('./utils/s3');
const { onConnection } = require('./controllers/sockets2');

// setting cors 
app.use(
    cors({
        origin: "*",
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);



// FOR UPLOADING THE PDF
// app.use(uploadToS3);

// FOR DOWNLOADING THE PDF
app.get("/file/:key", (req, res, next) => {
    const key = req.params.key;
    const readStream = downloadFile(key);
    readStream.pipe(res);
});


// adding Routes
app.use("/user", user);
app.use("/classWork", classWork);
app.use("/class", class_);
app.use("/announcement", announcement);



app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});

app.get("/", (req, res) =>
    res.send(
        `<h1>Hello From Server</h1>`
    )
);


httpServer.listen(process.env.PORT, () => {
    console.log(`Server runs on port ${process.env.PORT}`);
});

const io = exports.io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

EditorSockets(io);