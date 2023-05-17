const mongoose = require('mongoose')

const boatSchema = new mongoose.Schema({
    boatType: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    prebuilt: {
        type: Boolean,
        required: true
    },
    purchased: {
        type: Boolean,
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
    },
    priceUSD: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Boat', boatSchema)