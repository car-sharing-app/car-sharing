const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { cache } = require("../services/cache")
const verifyToken = (req, res, next) => {
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
    req.identity.token = token;
    next();
  });
};

const isUser = (req, res, next) => {
  const role = req.identity.role
  if (role != 'user') {
    res.status(401).send({ message: "Unauthorized" })
    return;
  }
  next();
}

const authJwt = {
  verifyToken: verifyToken,
  isUser: isUser,
};
module.exports = authJwt;
