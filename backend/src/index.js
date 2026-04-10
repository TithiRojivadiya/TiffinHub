import connectDB from './db/index.js'
import { app } from './app.js'   

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Server is running successfully 👍 on ' + process.env.PORT);
    })
})
.catch((err) => {
    console.log("Failed to connect DB 😟 : ", err);
    process.exit(1)
})