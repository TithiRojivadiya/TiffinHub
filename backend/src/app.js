import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))    // extended: true ---> to give object inside object
app.use(express.static("public"))
app.use(cookieParser())


// router declaration
app.use("/api/v1/users", userRouter); 

export {app}