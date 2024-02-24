"use strict";

const { BadRequestError } = require("../core/error.response");
const { 
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");

const { insertInventory } = require("../models/repositories/inventory.repo");

const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublicForShop,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

// define Factory class to create product
class ProductFactory {
  static productRegister = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) throw new BadRequestError(`Invalid type ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) throw new BadRequestError(`Invalid type ${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // Query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublicForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublicForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProduct({ keySearch });
  }

  // detail
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_ratingsAverage",
      ],
    });
  }
}

// define base product class
class Product {

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add product_stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  // update product
  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attr has null or undefined
    const objectParams = removeUndefinedObject(this);
    // 2. check xem update ở đâu
    if (objectParams.product_attributes) {
      // update clothing
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    if (!updateProduct) throw new BadRequestError("Can't found product");

    return updateProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

// Register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
