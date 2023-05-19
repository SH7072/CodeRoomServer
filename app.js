const dotenv = require('dotenv');
const express = require('express');
const app = express();

// Importing routes
const user = require('./routes/userRoutes');
const classwork = require('./routes/classworkRoutes');
const class_ = require('./routes/classRoutes');


const cors = require("cors");
dotenv.config({
    path: "./config/config.env",
});

//Db  connection
require('./config/dbConnection');

// setting cors 
app.use(
    cors({
        origin: "*",
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());

// adding Routes
app.use("/user", user);
app.use("/classwork", classwork);
app.use("/class", class_);



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

app.listen(process.env.PORT, () => {
    console.log(`Server runs on port ${process.env.PORT}`);
});
