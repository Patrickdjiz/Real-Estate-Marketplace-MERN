import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'

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