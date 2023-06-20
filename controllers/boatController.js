const Boat = require('../models/Boat')
const asyncHandler = require('express-async-handler')

// @desc Get all boats
// @route GET /boats
// @access Public
const getAllBoats = asyncHandler(async (req, res) => {
    const boats = await Boat.find().lean()
    if (!boats?.length) {
        return res.status(400).json({ message: 'No boats found' })
    }
    return res.json(boats)
})

// @desc Create a boat
// @route POST /boats
// @access Private
const createBoat = asyncHandler(async (req, res) => {
    const { boatType, material, prebuilt, purchased, hullColor,
    cockpitColor, amaColor, priceUSD } = req.body

    //confirm data
    if (!boatType || !material || !hullColor || !cockpitColor || !amaColor || !priceUSD) {
        console.log(req.body)
        return res.status(400).json({ message: 'All fields are required' })
    } 

    const boatObject = { boatType, material, prebuilt, purchased, hullColor,
        cockpitColor, amaColor, priceUSD }

    //create and store new boat
    const boat = await Boat.create(boatObject)

    if (boat) { //successfully create
        res.status(200).json({ message: `new ${boatType} created` })
    } else res.status(400).json({ message: 'invalid data recieved' })
})

// @desc Update a boat
// @route PATCH /boats
// @access Private
const updateBoat = asyncHandler(async (req, res) => {
    const { _id, boatType, material, prebuilt, purchased, hullColor,
        cockpitColor, amaColor, priceUSD } = req.body
    
    //confirm data
    if (!_id || !boatType || !material || !hullColor || !cockpitColor || !amaColor || !priceUSD) {
        return res.status(400).json({ message: 'Invalid data sent to function' })
    }

    const boat = await Boat.findById(_id).exec()

    if (!boat) {
        return res.status(400).json({ message: 'Boat not found' })
    }

    //update user object
    boat.boatType = boatType
    boat.material = material
    boat.prebuilt = prebuilt
    boat.purchased = purchased
    boat.hullColor = hullColor
    boat.cockpitColor = cockpitColor
    boat.amaColor = amaColor
    boat.priceUSD = priceUSD

    const updatedBoat = await boat.save() 

    res.json({ message: `updated boat: ${_id}`})
})

// @desc Delete a boat
// @route DELETE /boats
// @access Private
const deleteBoat = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) res.status(400).json({ message: 'Boat id is required for delete operation' })

    const boat = await Boat.findById(_id).exec()

    if (!boat) {
        return res.status(400).json({ message: 'No boat found' })
    }

    const result = await boat.deleteOne()

    const reply = `Boat ${result._id} has been deleted`

    res.json(reply)
})

module.exports = {
    getAllBoats,
    createBoat,
    updateBoat,
    deleteBoat
}