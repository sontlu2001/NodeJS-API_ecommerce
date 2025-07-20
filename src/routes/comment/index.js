"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const CommentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//authentication
router.use(authentication);

router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getCommentByProductId));
router.delete("", asyncHandler(CommentController.deleteComment));

module.exports = router;
