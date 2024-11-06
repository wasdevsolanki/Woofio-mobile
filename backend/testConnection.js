// testConnection.js

import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "89.117.188.1",
    user: "u976590105_thewoofio_2307",
    password: "Thewoofio_2307",
    database: "u976590105_thewoofio_2307"
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON ${PORT}`);
});
