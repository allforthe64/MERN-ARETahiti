const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerFName: {
        type: String,
        required: true
    },
    customerLName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    boatType: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)