const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    repEmail: {
        type: String,
        required: true,
    },
    repPhone: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchema)