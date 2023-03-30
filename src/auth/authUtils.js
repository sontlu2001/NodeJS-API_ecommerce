"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const asyncHandler = require('../helpers/asyncHandler');
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN:'x-rtoken-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    // refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.log(`error verify::`, err);
      else console.log(`decode verify`, decode);
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  // 1.Check userId missing ?
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')
  // 2.Get accessToken
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore')
  // 3.
  if(req.headers[HEADER.REFRESHTOKEN]){
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw AuthFailureError('Invalid UserId')
      req.keyStore = keyStore
      req.user=decodeUser
      req.refreshToken=refreshToken
      return next();
    } catch (error) {
      throw error
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')
  // 4.check user in dbs.
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    // 5. check keyStore with this userId?
    if (userId !== decodeUser.userId) throw AuthFailureError('Invalid UserId')
    // 6.OK all => return next()
    req.keyStore = keyStore
    req.user= decodeUser  //{userId,email}
    return next();
  } catch (error) {
    throw error
  }
})

const verifyJWT= async(token,keySecret)=>{
  return await JWT.verify(token,keySecret)
}
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
