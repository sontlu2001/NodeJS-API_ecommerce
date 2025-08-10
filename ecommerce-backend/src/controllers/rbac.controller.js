"use strict";
const { SuccessResponse } = require("../core/success.response");
const { createRole, createResource, roleList, resourceList } = require("../services/rbac.service");

class RbacController {
  async createRole(req, res, next) {
    new SuccessResponse({
      message: "Create new role success",
      metaData: await createRole(req.body),
    }).send(res);
  }

  async createResource(req, res, next) {
    new SuccessResponse({
      message: "Create new resource success",
      metaData: await createResource(req.body),
    }).send(res);
  }

  async resourceList(req, res, next) {
    new SuccessResponse({
      message: "Get list of resources success",
      metaData: await resourceList(req.query),
    }).send(res);
  }

  async roleList(req, res, next) {
    new SuccessResponse({
      message: "Get list of roles success",
      metaData: await roleList(req.query),
    }).send(res);
  }
}

module.exports = new RbacController();
