'use strict'
const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk } = require('../../configs/multer')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadThumb))

module.exports = router