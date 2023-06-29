const express = require('express')
const router = express.Router()
const prebuiltController = require('../controllers/prebuiltController')

router.route('/')
    .get(prebuiltController.getAllPrebuilts)
    .post(prebuiltController.createPrebuilt)
    .patch(prebuiltController.updatePrebuilt)
    .delete(prebuiltController.deletePrebuilt)

module.exports = router