import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';

dotenv.config()
const app = express()

app.use(express.json())

// Routes
app.use('/api/user', userRoutes)

// Middleware
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Database connected')
    // we only want the app to connect to our Port if the database is connected
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
}).catch((err) => {
    console.log(err)
})


