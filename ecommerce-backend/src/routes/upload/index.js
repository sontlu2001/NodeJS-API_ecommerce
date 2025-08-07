'use strict'
const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/multer')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadThumb))
router.post('/product/image/s3', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageToS3))

module.exports = router