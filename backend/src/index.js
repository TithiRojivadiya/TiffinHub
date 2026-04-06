import connectDB  from './db/index.js'
import express from 'express'

const app = express()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log('Server is running successfully 👍 on ' + process.env.PORT);
    })
})
.catch((err) => {
    console.log("Failed to connect DB 😟 : ", err);
    process.exit(1)
})