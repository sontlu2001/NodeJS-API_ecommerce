"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey,refreshToken }) => {
    try {
      // level 0
      //   const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey,
      //   });
      // return tokens ? tokens.publicKey : null;

      const filter = { user: userId },
      update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
      options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
    } catch (error) {
      console.log('tao key fail',error);
      return error;
    }
  };
}

module.exports = KeyTokenService;
