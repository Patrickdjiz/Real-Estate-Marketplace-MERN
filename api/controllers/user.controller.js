import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import Listing from '../models/listing.model.js'

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) { // we check if the user id from the token we verified is the same as the user id from the request
        return next(errorHandler(403, 'You can only update your account'))
    }
    try {
        if(req.body.password) { // if the user wants to update their password we hash it
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { 
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, { new: true }) // we update the user with the id from the request and the data from the request

        const { password, ...userInfo } = updatedUser._doc // we remove the password from the updatedUser so we only send the userInfo

        res.status(200).json(userInfo) // we send the userInfo in the response

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) { // we check if the user id from the token we verified is the same as the user id from the request
        return next(errorHandler(403, 'You can only delete your account'))
    }
    try {
        await User.findByIdAndDelete(req.params.id) // we delete the user with the id from the request
        res.clearCookie('access_token') // we clear the access_token cookie
        res.status(200).json('Account has been deleted') // we send a success message in the response
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    
    if(req.user.id === req.params.id) { // we check if the user id from the token we verified is the same as the user id from the request
        try {
            const listings = await Listing.find({ userRef: req.params.id }) // we find the listings with the user id from the request
            res.status(200).json(listings) // we send the listings in the response
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'you can only view your own listings'))
    }
}