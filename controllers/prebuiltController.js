const Prebuilt = require('../models/Prebuilt')
const asyncHandler = require('express-async-handler')

// @desc Get all boats
// @route GET /boats
// @access Public
const getAllPrebuilts = asyncHandler(async (req, res) => {
    const prebuilts = await Prebuilt.find().lean()
    if (!prebuilts?.length) {
        return res.status(400).json({ message: 'No prebuilt boats found' })
    }
    return res.json(prebuilts)
})

// @desc Create a boat
// @route POST /boats
// @access Private
const createPrebuilt = asyncHandler(async (req, res) => {
    const {  boatType,
    hullColor,
    cockpitColor,
    amaColor,
    region,
    price,
    images } = req.body

    //confirm data
    if (!boatType || !region || !hullColor || !cockpitColor || !amaColor || !price) {
        console.log(req.body)
        return res.status(400).json({ message: 'All fields are required' })
    } 

    const prebuiltObject = { boatType,
        hullColor,
        cockpitColor,
        amaColor,
        region,
        price,
        images }

    //create and store new boat
    const prebuilt = await Prebuilt.create(prebuiltObject)

    if (prebuilt) { //successfully create
        res.status(200).json({ message: `new ${boatType} created` })
    } else res.status(400).json({ message: 'invalid data recieved' })
})

// @desc Update a boat
// @route PATCH /boats
// @access Private
const updatePrebuilt = asyncHandler(async (req, res) => {
    const { _id, boatType,
        hullColor,
        cockpitColor,
        amaColor,
        region,
        price,
        images } = req.body

    console.log(req.body)
    
    //confirm data
    if (!_id || !boatType /* || !region || !hullColor || !cockpitColor || !amaColor || !price */) {
        return res.status(400).json({ message: 'Invalid data sent to function' })
    }

    const prebuilt = await Prebuilt.findById(_id).exec()

    if (!prebuilt) {
        return res.status(400).json({ message: 'Boat not found' })
    }

    //update user object
    prebuilt.boatType = boatType
    prebuilt.region = region
    prebuilt.hullColor = hullColor
    prebuilt.cockpitColor = cockpitColor
    prebuilt.amaColor = amaColor
    prebuilt.price = price

    const updatedPrebuilt = await prebuilt.save() 

    res.json({ message: `updated boat: ${_id}`})
})

// @desc Delete a boat
// @route DELETE /boats
// @access Private
const deletePrebuilt = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) res.status(400).json({ message: 'Prebuilt id is required for delete operation' })

    const prebuilt = await Prebuilt.findById(_id).exec()

    if (!prebuilt) {
        return res.status(400).json({ message: 'No prebuilt boat found' })
    }

    const result = await prebuilt.deleteOne()

    const reply = `Prebuilt boat ${result._id} has been deleted`

    res.json(reply)
})

module.exports = {
    getAllPrebuilts,
    createPrebuilt,
    updatePrebuilt,
    deletePrebuilt
}