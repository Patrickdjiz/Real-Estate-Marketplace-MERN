import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken" 

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10) // the number on the end is the number of rounds of hashing called salt which encrypts the password
    const newUser = new User({ username, email, password: hashedPassword })
    try {
        await newUser.save();
        res.status(201).json(newUser)
    } catch (error) {
        next(error) // this will send the error to the middleware
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'Invalid email'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password) // we compare the password from the request with the hashed password in the database
        if (!validPassword) {
            return next(errorHandler(404, 'Invalid password'))
        }
        // token will be used to authenticate the user in the future
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET) // we create a token with the user id and the secret key from our .env file
        const { password: hashedPassword, ...userInfo} = validUser._doc; // we remove the password from the validUser so we can only send the userInfo
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(userInfo) // we send the token as a cookie to the user in their browser and the userInfo in the response 
    } catch (error) {
        next(error)
    }
}