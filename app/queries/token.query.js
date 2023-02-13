const {TokenTypes, CacheKeyTypes} = require("../../config/constant")
const jwt = require("jsonwebtoken")
const config = require("../../config").jwt
const Cache = require("../service/cache.service");


async function CreateAuthToken(user, notifiable = null) {
  /** Delete login token Cache */
  await Cache.del(CacheKeyTypes.login + user.uuid)
  const type = TokenTypes.login;
  const auth = { _id: user._id, uuid: user.uuid, name: user.name, email: user.email, type }
  const token = jwt.sign(auth, config.secret, {
    expiresIn: config.lifetime,
  });
  /** Cache the user */
  await Cache.set(CacheKeyTypes.login + user.uuid, token);
  return {
    token: token,
    type,
  }
}

module.exports = {CreateAuthToken}