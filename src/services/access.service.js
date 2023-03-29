"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, ForbiddenError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {

  static handleRefreshToken = async({keyStore,user,refreshToken})=>{
    const{userId,email} = user;
     // check Token đã được sử dụng chưa ?
    if(keyStore.refreshTokenUsed.includes(refreshToken)){
      // phát hiện nghi vấn => user login lại
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Some thing wrong happened !! Please login')
    }
    if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')
    const foundShop = await findByEmail({email})
    // create 1 cap tokens moi
    const tokens = await createTokenPair({userId,email},foundShop.publicKey,foundShop.privateKey)
    // update Token
    await keyStore.update({
      $set:{
        refreshToken:tokens.refreshToken
      },
      $addToSet:{
        refreshTokenUsed:refreshToken
      }
    })
    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  }

  /**
   * process login.
   * @param {string} refreshToken - user đó đã đăng nhập trước đó và tạo một phiên login mới => xoá token cũ trước đó.
   */
  static login = async ({ email, password, refreshToken = null }) => {
    //1.Check email trong DB
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop not registered')
    // 2.Match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')
    //3. create AT và RT and save
    //created privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    //4. Generate tokens
    const userId = foundShop._id;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    //5. Get Data return login
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    })
    return {
      shop: getInfoData({
        fields: ["id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }

  static signUp = async ({ name, email, password }) => {
    // check email exists ??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        return {
          code: "xxx",
          message: "PublicKeyString error",
        };
      }

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Create Token Success::`, tokens);
      return {
        shop: getInfoData({
          fields: ["id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metaData: null,
    };
  }
}

module.exports = AccessService;
