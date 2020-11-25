const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = require("../config/config");

const db = require('../models');
const RevokedTokens = db.RevokedTokens;
const Op = db.Sequelize.Op;

exports.verify = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const revoked = await RevokedTokens.findOne({
      where: {
        token: {[Op.iLike]: token}
      }
    })

    if (revoked) {
      return res.sendStatus(403);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}
