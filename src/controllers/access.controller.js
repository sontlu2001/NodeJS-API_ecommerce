"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success!',
      metaData: await AccessService.handleRefreshToken({
        refreshToken:req.refreshToken,
        user:req.user,
        keyStore:req.keyStore,
      })
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metaData: await AccessService.logout(req.keyStore)
    }).send(res)
  }
  
  login = async (req, res, next) => {
    new SuccessResponse({
      metaData: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    return new CREATED({
      message: "Registered OK",
      metaData: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
  };
}

module.exports = new AccessController();
