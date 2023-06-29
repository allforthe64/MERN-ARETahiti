const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')

// @desc Get all boats
// @route GET /boats
// @access Public
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().lean()
    if (!orders?.length) {
        return res.status(400).json({ message: 'No orders found' })
    }
    return res.json(orders)
})

// @desc Create a boat
// @route POST /boats
// @access Private
const createOrder = asyncHandler(async (req, res) => {
    const { fName, lName, email, phone, boatType, region } = req.body

    //confirm data
    if (!fName || !lName || !email || !phone || !boatType || !region) {
        console.log(req.body)
        return res.status(400).json({ message: 'All fields are required' })
    } 

    const orderObject = { "customerFName" : fName, "customerLName" : lName, "customerEmail" : email, "customerPhone" : phone, boatType, region }

    //create and store new boat
    const order = await Order.create(orderObject)

    if (order) { //successfully create
        res.status(200).json({ message: 'new order created' })
    } else res.status(400).json({ message: 'invalid data recieved' })
})

// @desc Update a boat
// @route PATCH /boats
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
    const { id, editFName, editLName, editEmail, editPhone, editBoat, editRegion } = req.body

    console.log(editBoat)
    console.log(editRegion)
    console.log(editPhone)
    console.log(editEmail)
    console.log(editLName)
    console.log(editFName)
    
    //confirm data
    if (!id || !editFName || !editLName || !editEmail || !editPhone || !editBoat || !editRegion) {
        console.log('failed here')
        return res.status(400).json({ message: 'Invalid data sent to function' })
    }

    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }

    //update user object
    order.customerFName = editFName
    order.customerLName = editLName
    order.customerEmail = editEmail
    order.customerPhone = editPhone
    order.boatType = editBoat
    order.region = editRegion

    const updatedOrder = await order.save() 

    res.json({ message: `updated boat: ${id}`})
})

// @desc Delete a boat
// @route DELETE /boats
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { id } = req.body

    if (!id) res.status(400).json({ message: 'Order id is required for delete operation' })

    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'No order found' })
    }

    const result = await order.deleteOne()

    const reply = `Order ${result.id} has been deleted`

    console.log('this worked')

    res.json(reply)
})

module.exports = {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
}