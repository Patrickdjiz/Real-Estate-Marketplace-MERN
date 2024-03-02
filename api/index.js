import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser()) // we use the cookieParser middleware to parse the cookies from the request so we can access them in our controllers

// Routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/listing', listingRouter)

//--------Middleware---------//
// our controllers send the error to next() and this middleware will catch it
app.use((err, req, res, next) => { 
    const statusCode = err.statusCode || 500 // if there is no statusCode in the error just use 500 as default
    const message = err.message || 'Internal Server Error' // if there is no message in the error just use 'Internal Server Error' as default
    return res.status(statusCode).json({ 
        success: false,
        statusCode,
        message,
     })
})

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


