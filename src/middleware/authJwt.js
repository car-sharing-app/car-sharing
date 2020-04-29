const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { cache } = require("../services/cache")
verifyToken = (req, res, next) => {
  const authorizationValue = req.header("Authorization");

  if (!authorizationValue) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  const [, token] = authorizationValue.split(" ");
  const cacheValue = cache.get(token)
  if (cacheValue != undefined) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.identity = decoded;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;
