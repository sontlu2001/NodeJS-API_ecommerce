"use strict ";
const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
const AccessControl = require("accesscontrol");


const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const rbac = new AccessControl();
      rbac.setGrants(await roleList({
        userId: 9999,
      }));
      const role_name = req.query.role;
      const permission = await rbac.can(role_name)[action](resource);
        if (!permission.granted) {
           throw new AuthFailureError('You do not have enough permission to perform this action');
        }
        next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
    grantAccess
}