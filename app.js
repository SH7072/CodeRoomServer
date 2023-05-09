const express = require('express');
const app = express();
const dotenv=require('dotenv');

dotenv.config({
    path: "./config/config.env",
});

//Db  connection
require('./config/dbConnection');


app.get("/", (req, res) =>
    res.send(
        `<h1>Hello</h1>`
    )
);

app.listen(process.env.PORT, () => {
    console.log(`Server runs on port ${process.env.PORT}`);
});
