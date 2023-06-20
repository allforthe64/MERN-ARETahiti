const express = require('express')
const router = express.Router()
const boatController = require('../controllers/boatController')

router.route('/')
    .get(boatController.getAllBoats)
    .post(boatController.createBoat)
    .patch(boatController.updateBoat)
    .delete(boatController.deleteBoat)

module.exports = router