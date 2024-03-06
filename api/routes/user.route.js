import express from 'express'
import { updateUser, deleteUser, getUserListings } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/update/:id', verifyToken, updateUser) // we use the verifyToken middleware to check if the user is authenticated then we use the updateUser controller to update the user
router.delete('/delete/:id', verifyToken, deleteUser) // we use the verifyToken middleware to check if the user is authenticated then we use the deleteUser controller to delete the user
router.get('/listings/:id', verifyToken, getUserListings)

export default router