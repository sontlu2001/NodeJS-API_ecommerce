'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, electronic, clothing, furniture } = require('../models/product.model')

// define Factory class to create product
class ProductFactory {
    // C1
    // static async createProduct(type,payload) {
    //     switch (type) {
    //         case 'Electronic':
    //             return new Electronic(payload).createProduct()
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct()
    //         default:
    //             throw new BadRequestError(`Invalid type ${type}`)
    //     }
    // }
    static productRegister = {}
    static registerProductType(type,classRef){
        ProductFactory.productRegister[type] = classRef
    }
    static async createProduct(type,payload){
        const productClass = ProductFactory.productRegister[type]
        if(!productClass) throw new BadRequestError(`Invalid type ${type}`)
        return new productClass(payload).createProduct()

    }
}
// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    // create new product
    async createProduct(productId){
        return await product.create({
            ...this,
            _id:productId,
        })
    }
}
// Define sub-class for different product types Clothing
class Clothing extends Product{
    async createProduct(){
        const newcClothing = await clothing.create(this.product_attributes)
        if(!newcClothing) throw new BadRequestError('create new Clothing error')
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Product error')
        return newProduct;
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('create new Electronic error')
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('create new Product error')
        return newProduct;
    }
}
// Define sub-class for different product types Furniture
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('create new Furniture error')
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('create new Product error')
        return newProduct;
    }
}
// register product types
ProductFactory.registerProductType('Electronic',Electronic)
ProductFactory.registerProductType('Clothing',Clothing)
ProductFactory.registerProductType('Furniture',Furniture)
 
module.exports = ProductFactory