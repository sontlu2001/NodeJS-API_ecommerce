'use strict'

const CartService = require("../services/cart.service")
const { SuccessResponse } = require("../core/success.response")


class CartController{
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart success',
            metaData: await CartService.addProductToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart success',
            metaData: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete cart success',
            metaData: await CartService.deleteProductCart(req.body)
        }).send(res)
    }

    
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List cart success',
            metaData: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}


module.exports =  new CartController()