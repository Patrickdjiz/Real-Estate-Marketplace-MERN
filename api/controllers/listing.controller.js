import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body) // we create a new listing with the data from the request
        return res.status(201).json(listing) // we send the listing in the response
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id) // we find the listing by id
    if (!listing) {
        return next(errorHandler(404, 'Listing not found')) // if the listing doesn't exist we send a 404 status and a message
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, 'You are not authorized to delete this listing')) // if the user is not the owner of the listing we send a 403 status and a message
    }

    try {
        await Listing.findByIdAndDelete(req.params.id) // we delete the listing
        return res.status(200).json({ success: true, message: 'Listing deleted' }) // we send a success message
    } catch (error) {
        next(error)
    }

}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id) // we find the listing by id
    if (!listing) {
        return next(errorHandler(404, 'Listing not found')) // if the listing doesn't exist we send a 404 status and a message
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, 'You are not authorized to update this listing')) // if the user is not the owner of the listing we send a 403 status and a message
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id, // we find the listing by id
            req.body, // we update the listing with the data from the request
            { new: true } // we set new to true so we get the updated listing in the response
        ) // we update the listing with the data from the request
        return res.status(200).json(updatedListing) // we send the updated listing in the response
    } catch (error) {
        next(error)
    }

}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id) // we find the listing by id
        if (!listing) {
            return next(errorHandler(404, 'Listing not found')) // if the listing doesn't exist we send a 404 status and a message
        }
        return res.status(200).json(listing) // we send the listing in the response
    } catch (error) {
        next(error)
    }
}