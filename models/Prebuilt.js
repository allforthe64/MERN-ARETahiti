const mongoose = require('mongoose')

const prebuiltSchema = new mongoose.Schema({
    boatType: {
        type: String,
        required: true
    },
    hullColor: {
        type: String,
        required: true
    },
    cockpitColor: {
        type: String,
        required: true
    },
    amaColor: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    images: []
})

module.exports = mongoose.model('Prebuilt', prebuiltSchema)