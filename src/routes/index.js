'use strict'
const express = require('express')
const { apiKey,permission } = require('../auth/checkAuth')
const router = express.Router()

// check apikey
router.use(apiKey)
// check permission 
router.use(permission('0000'))

router.use('/v1/api/comment',require('./comment'))
router.use('/v1/api/product',require('./products'))
router.use('/v1/api/discount',require('./discounts'))
router.use('/v1/api/cart',require('./cart'))
router.use('/v1/api',require('./access') ),
router.use('/v1/api/notification',require('./notification'))

module.exports = router