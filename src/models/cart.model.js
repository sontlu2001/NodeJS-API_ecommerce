'use strict'
const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },

    cart_userId: {
        type: Number,
    }
},{
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = model(DOCUMENT_NAME, cartSchema)