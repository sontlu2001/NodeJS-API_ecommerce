'use strict'
const express = require('express')
const { apiKey,permission } = require('../auth/checkAuth')
const router = express.Router()

// check apikey
router.use(apiKey)
// check permission 
router.use(permission('0000'))

router.use('/api/v1/rbac', require('./rbac'))
router.use('/api/v1/profile', require('./profile'))
router.use('/api/v1/comment',require('./comment'))
router.use('/api/v1/product',require('./products'))
router.use('/api/v1/discount',require('./discounts'))
router.use('/api/v1/cart',require('./cart'))
router.use('/api/v1/upload',require('./upload'))
router.use('/api/v1',require('./access') )
router.use('/api/v1/notification',require('./notification'))

module.exports = router