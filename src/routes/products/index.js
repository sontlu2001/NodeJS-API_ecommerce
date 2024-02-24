'use strict'
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// list routers mustn't be unauthenticated
router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.findAllProduct))
router.get('/:product_id',asyncHandler(productController.findProduct))

// list routers must be authenticated
router.use(authentication)

// create, update, publish, unpublish
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// draft, published
router.get('/drafts/all',asyncHandler(productController.findAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.findAllPublicForShop))

module.exports = router