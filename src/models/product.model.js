"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, num: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.3456 =>4.3
        set: (val) => Math.round(val * 10) / 10
    },
    // sản phẩm có thể nhiều màu, kích thước, loại khác nhau
    product_variations: { type: Array, default: [] },
    // la san pham nhap 
    isDraft: { type: Boolean, default: true, index: true,select:false },
    isPublished: { type: Boolean, default: false, index: true,select:false },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

// create index for Search
productSchema.index({product_name:'text',product_description:'text'})
// Document middleware: run before .save() and .create()...
productSchema.pre('save',function (next){
    this.product_slug = slugify(this.product_name,{lower:true})
    next()
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'electronics',
    timestamps: true
})
// define the product type = furniture
const furnitureSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'furnitures',
    timestamps: true
})
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
}