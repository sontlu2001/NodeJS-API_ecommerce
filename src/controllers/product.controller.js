"use strict";

const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metaData: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product by id success',
            metaData: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
               ...req.body,
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product by shop success',
            metaData: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product by shop success',
            metaData: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }

    // Query
    /**
     * @desc Gel all Drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON} 
     */
    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list drafts success',
            metaData: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }

    findAllPublicForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list public success',
            metaData: await ProductService.findAllPublicForShop({
                product_shop: req.user.userId //decodeUser accessToken file authUtils 
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product public success',
            metaData: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all list product public success',
            metaData: await ProductService.findAllProduct(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find product public success',
            metaData: await ProductService.findProduct(req.params)
        }).send(res)
    }
    // End query
}

module.exports = new ProductController()