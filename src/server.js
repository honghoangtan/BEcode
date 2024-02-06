import express from "express";

import cors from 'cors'

import configViewEngine from "./config/viewEngine";

import initWebRoutes from "./routes/web";
import initApiRoutes from './routes/api'

require("dotenv").config()

import bodyParser from 'body-parser';

import connection from "./config/connectDB";

import configCors from "./config/cors";

import cookieParser from 'cookie-parser'


const app = express()

const PORT = process.env.PORT || 8080

// config CORS
configCors(app)

// config view engine
configViewEngine(app)

//config body-parser
// Lấy data từ request trang client gửi từ form lên
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie - parser
app.use(cookieParser())

// Truoc khi init web routes
// test connection db
connection()

// init web routes
initWebRoutes(app)
initApiRoutes(app)

app.use((req, res) => {
    console.log(">>> Check new request")
    console.log("host: ", req.hostname)
    console.log("path: ", req.path)
    console.log("method: ", req.method)
})

app.use((req, res) => {
    return res.send('404 not found')
})

app.listen(PORT, () => {
    console.log(">>> JWT Backend is running on the port: "+PORT)
})