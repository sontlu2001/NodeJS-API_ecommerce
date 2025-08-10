"use strict";
const express = require("express");
const { grantAccess } = require("../../middlewares/rbac");
const rbacController = require("../../controllers/rbac.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

// router.use(authentication);

router.post("/role", asyncHandler(rbacController.createRole));
router.get("/roles", asyncHandler(rbacController.roleList));
router.post("/resource", asyncHandler(rbacController.createResource));
router.get("/resources", asyncHandler(rbacController.resourceList));
module.exports = router;
