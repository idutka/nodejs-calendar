const Joi = require('joi');
const jwt = require("jsonwebtoken");

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
} = require('../config/config')
const logger = require('../utils/logger')

const db = require('../models');
const RevokedTokens = db.RevokedTokens;

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
module.exports.schema = schema;

module.exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;

    // todo validate user
    if (!username || !password) {
      return res.sendStatus(401)
    }

    let accessToken = jwt.sign({username}, ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: ACCESS_TOKEN_LIFE
    })

    let refreshToken = jwt.sign({username}, REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: REFRESH_TOKEN_LIFE
    })

    res.json({access_token: accessToken, refresh_token: refreshToken})
  } catch (e) {
    const message = e.message || 'Some error occurred while logging';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.refreshTokens = async (req, res) => {
  try {
    const {refresh_token: refreshToken} = req.body;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    try {
      const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

      await RevokedTokens.create({token: req.token})

      let accessToken = jwt.sign({username: user.username}, ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_LIFE
      })

      res.json({
        access_token: accessToken
      });

    } catch (e) {
      return res.sendStatus(403);
    }
  } catch (e) {
    const message = e.message || 'Some error occurred while refreshing token';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.checkAccess = async (req, res) => {
  try {
    const {username} = req.user;
    res.json({message: `Hello ${username}!`});
  } catch (e) {
    const message = e.message || 'Some error occurred while checking access';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.logout = async (req, res) => {
  try {
    await RevokedTokens.create({token: req.token})
    res.sendStatus(200);
  } catch (e) {
    const message = e.message || 'Some error occurred while logout';
    res.status(500).send({message});
    logger.warn(message);
  }
};
