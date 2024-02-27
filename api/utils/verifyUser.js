import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token // we get the token from the cookies. We called it the access_token in the auth controller

    if (!token) {
        return next(errorHandler(401, 'Unauthorized')) // if there is no token we send an error
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // we verify the token with the secret key from the .env file
        if (err) {
            return next(errorHandler(403, 'Forbidden')) // if the token is not valid we send an error
        }
        req.user = user // we add the user to the request object so we can access it in our controllers
        next() // we call next to move to the next middleware
    })
}