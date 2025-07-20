"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectMongodb, getInfoData } = require("../utils");
const { findProduct } = require("./product.service");

class CommentService {
  static async createComment({
    productId,
    userId = 1,
    content = "",
    parentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentId ? parentId : null,
    });

    let rightValue = 1;
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment)
        throw new NotFoundError(`Parent comment with ID ${parentId} not found`);

      rightValue = parentComment.comment_right;

      console.log("Parent comment found:", parentComment);
      // update many comments
      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      const maxRight = await Comment.findOne(
        {
          comment_productId: convertToObjectMongodb(productId),
          isDeleted: false,
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRight) {
        rightValue = maxRight.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 10,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError(
          `Parent comment with ID ${parentCommentId} not found`
        );
      }
      const comments = await Comment.find({
        comment_productId: convertToObjectMongodb(productId),
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lte: parentComment.comment_right },
      })
        .select({
          comment_content: 1,
          comment_userId: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return comments;
    }

    const comments = await Comment.find({
        comment_productId: convertToObjectMongodb(productId),
        comment_parentId: null,
      })
        .select({
          comment_content: 1,
          comment_userId: 1,
          comment_left: 1,
          comment_right: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return comments;
  }

  static async deleteComments({
    commentId,
    productId
  }){
    // Check the product is exist
    const foundProduct = await findProduct({ product_id: productId });

    if (!foundProduct) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFoundError(`Comment with ID ${commentId} not found`);
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;
    await Comment.deleteMany({
      comment_productId: convertToObjectMongodb(productId),
      comment_content: {$gte: leftValue, $lte: rightValue},
    });
    // Update the left
    await Comment.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      { $inc: { comment_right: -width } }
    );
    // Update the right
    await Comment.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      { $inc: { comment_left: -width } }
    );
  }
}

module.exports = CommentService;
