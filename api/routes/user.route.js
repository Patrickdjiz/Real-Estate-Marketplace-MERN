import express from 'express'
import { updateUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/update/:id', verifyToken, updateUser) // we use the verifyToken middleware to check if the user is authenticated then we use the updateUser controller to update the user

export default router