import Listing from '../models/listing.model.js'

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body) // we create a new listing with the data from the request
        return res.status(201).json(listing) // we send the listing in the response
    } catch (error) {
        next(error)
    }
}