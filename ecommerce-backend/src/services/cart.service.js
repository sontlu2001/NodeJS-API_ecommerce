"use strcit";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/**
 * Key features:
 * - Add product to cart [user]
 * - Reduce product quantity by one [user]
 * - Increase product quantity by one [user]
 * - Delete cart [user]
 * - Get cart [user]
 * - Delete cart item [user]
 */

class CartService {
  static async createCart(userId, product) {
    const query = { cart_userId: userId, cart_status: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateCartQuantity({userId, product}) {
    const { productId, quantity } = product;
    console.log("updateCartQuantity -> product", product);
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_status: "active",
    };

    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addProductToCart({ userId, product }) {
    // check cart exist
    const userCart = await cartModel.findOne({ cart_userId: userId});
    if (!userCart) {
      // create new cart
      return await CartService.createCart(userId, product);
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await CartService.updateCartQuantity(userId, product);
  }

  static async addToCartV2({ shop_order_ids, userId }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check product exist
    const foundProduct = await getProductById({product_id: productId});

    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }
    //  compare shopId
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product not found");
    }
    if (quantity === 0) {
      // delete product from cart
      return await CartService.deleteProductCart({userId, productId});
    }

    return await CartService.updateCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteProductCart({ userId, productId }) {
      const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: productId
      },
    };
    return await cartModel.updateOne(query, updateSet);
  }

  static async getListUserCart({ userId }) {
    return await cartModel.findOne({
        cart_userId: userId,
      })
      .lean();
  }
}

module.exports = CartService;
