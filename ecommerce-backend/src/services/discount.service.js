"use strict";

const { BadRequestError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectMongodb } = require("../utils");
const { findAllProduct } = require("./product.service");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");

/**
 * 1 - Generator discount code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      users_count,
      users_used,
      max_users_per_user,
    } = payload;

    // if (new Date(start_date) > new Date() || new Date(end_date) < new Date()) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be less than end date");
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount already exists");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_oder_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_users_count: users_count,
      discount_users_used: users_used,
      discount_max_users_per_user: max_users_per_user,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      users_count,
      users_used,
      max_users_per_user,
    } = payload;

    if (new Date(start_date) > new Date() || new Date(end_date) < new Date()) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be less than end date");
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();

    if (!foundDiscount) {
      throw new BadRequestError("Discount not found");
    }

    const updatedDiscount = await discountModel.findOneAndUpdate(
      {
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      },
      {
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_code: code,
        discount_value: value,
        discount_min_oder_value: min_order_value || 0,
        discount_max_value: max_value,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_max_uses: max_uses,
        discount_users_count: users_count,
        discount_users_used: users_used,
        discount_max_users_per_user: max_users_per_user,
        discount_shopId: shopId,
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === "all" ? [] : product_ids,
      },
      { new: true }
    );
    return updatedDiscount;
  }

  // Get all discount codes available with products
  static async getAllDiscountCodesWithProducts({ code, shopId, limit, page }) {
    //create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products = [];

    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get specific products
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // Get all discount codes of Shop
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "createdAt", "updatedAt"],
      model: discountModel,
    });

    return discounts;
  }

  // Apply discount code
  static async getDiscountAmount({ code, shopId, userId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
        discount_is_active: true,
      },
    });

    if (!foundDiscount) {
      throw new BadRequestError("Discount code not found");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_oder_value,
      discount_start_date,
      discount_end_date,
      discount_max_users_per_user,
      discount_type,
      discount_value,
      discount_users_used,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError("Discount code has expired");
    }
    if (!discount_max_uses) {
      throw new BadRequestError("Discount are out of uses");
    }
    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    let totalOrder = 0;
    if (discount_min_oder_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
      }, 0);

      if (totalOrder < discount_min_oder_value) {
        throw new BadRequestError(
          `Discount require minimum order value of ${discount_min_oder_value}!`
        );
      }
    }

    // check if discount code has been used
    if (discount_max_users_per_user > 0) {
      const foundUser = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (foundUser && foundUser.count >= discount_max_users_per_user) {
        throw new BadRequestError(`Discount code has expired`);
      }
    }

    // calculate discount amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ code, shopId }) {
    const foundDiscount = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new BadRequestError("Discount not found");
    }

    return foundDiscount;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BadRequestError("Discount not found");
    }

    const result = discountModel.findOneAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: { userId },
      },
      $inc: {
        discount_max_uses: 1,
        discount_users_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
