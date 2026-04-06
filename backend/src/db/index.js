import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'
import express from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config({
    path: './.env'
})

const connectDB = async () => {

    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log("Mongo db connection successfully 😁");
        
        
    } catch (error) {
        console.log("Failed to connect DB 😟 : ", error);
        process.exit(1)
    }

}

export default connectDB;