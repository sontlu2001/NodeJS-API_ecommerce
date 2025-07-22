"use strict";

const { SuccessResponse } = require("../core/success.response");
const { createComment, getCommentsByParentId, deleteComments } = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create comment successfully",
      metaData: await createComment(req.body),
    }).send(res);
  };

  getCommentByProductId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get comments by product ID successfully",
      metaData: await getCommentsByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete comment successfully",
      metaData: await deleteComments(req.query), // Add relevant data if needed
    }).send(res);
  }
}

module.exports = new CommentController();
