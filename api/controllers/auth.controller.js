import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10) // the number on the end is the number of rounds of hashing called salt which encrypts the password
    const newUser = new User({ username, email, hashedPassword })
    try {
        await newUser.save();
        res.status(201).json(newUser)
    } catch (error) {
        res.status(409).json(error.message)
    }
}