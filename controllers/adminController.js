const Admin = require('../models/Admin')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get all boats
// @route GET /boats
// @access Public
const getAllAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.find().lean()
    if (!admin?.length) {
        return res.status(400).json({ message: 'No Admin found' })
    }
    return res.json(admin)
})

// @desc Create a boat
// @route POST /boats
// @access Private
const createAdmin = asyncHandler(async (req, res) => {
    const { username, password, repEmail, repPhone, region } = req.body

    //confirm data
    if (!username || !password || !repEmail || !repPhone || !region) {
        console.log(req.body)
        return res.status(400).json({ message: 'All fields are required' })
    } 

    //check for duplicate
    const duplicate = await Admin.findOne({ username }).lean().exec()

    if (duplicate) return res.status(409).json({ message: 'Duplicate username' })

    //hash password
    const hashed = await bcrypt.hash(password, 10) //number of salt rounds

    const adminObject = { username, "password": hashed, repEmail, repPhone, region }

    //create and store new admin
    const admin = await Admin.create(adminObject)

    if (admin) { //successfully create
        res.status(200).json({ message: `new admin: ${username} created` })
    } else res.status(400).json({ message: 'invalid data recieved' })
})

// @desc Update a boat
// @route PATCH /boats
// @access Private
const updateAdmin = asyncHandler(async (req, res) => {
    const { _id, username, password, repEmail, repPhone, region } = req.body
    
    //confirm data
    if (!_id || !username || !password || !repEmail || !repPhone || !region) {
        return res.status(400).json({ message: 'Invalid data sent to function' })
    }

    const admin = await Admin.findById(_id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'Admin user not found' })
    }

    //check for duplicate
    const duplicate = await Admin.findOne({ username }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'duplcate username'})
    }

    //update user object
    admin.username = username
    admin.repEmail = repEmail
    admin.repPhone = repPhone
    admin.region = region

    if (password) {
        //rehash password
        admin.password = await bcrypt.hash(password, 10) //10 salt rounds
    }

    const updatedAdmin = await admin.save() 

    res.json({ message: `updated admin: ${_id}`})
})

// @desc Delete a boat
// @route DELETE /boats
// @access Private
const deleteAdmin = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) res.status(400).json({ message: 'Admin id is required for delete operation' })

    const admin = await Admin.findById(_id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'No admin found' })
    }

    const result = await admin.deleteOne()

    const reply = `Boat ${result._id} has been deleted`

    res.json(reply)
})

module.exports = {
    getAllAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin
}