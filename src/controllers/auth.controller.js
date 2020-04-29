const db = require("../models");
const config = require("../config/auth.config");
const emailService = require("../services/emailService")
const { registerValidation, registerValidationAsync } = require("../validators/authRequestValidators")
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { cache } = require("../services/cache");

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body || {};
  let errors = registerValidation(username, email, password, phoneNumber);
  if (errors.length == 0) {
    errors = await registerValidationAsync(username, email, phoneNumber)
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
  }

  const hash = bcrypt.hashSync(password, 8);
  const user = await User.create({
    username: username,
    email: email,
    password: hash,
    phoneNumber: phoneNumber,
    roleId: 1,
    activeAccount: false
  })

  emailService(email, "Utworzono konto", "<a href='" +
    require('../config/appUrl.config').URL +
    "auth/activate?data=" + hash
    + "'>Aby aktywować konto kliknij ten link.</a>")

  res.status(200).send({
    resourceId: user.id
  })
};

exports.activate = async (req, res) => {
  if (req.query.data == null) {
    res.status(404).send({ message: "Activation link is invalid" })
    return;
  }

  const user = await User.findOne({
    where: {
      password: req.query.data
    }
  })

  if (user == null) {
    res.status(404).send({ message: "Activation link is invalid" })
    return;
  }

  await user.update({
    activeAccount: true
  })

  res.status(200).send({
    message: "Account activated."
  })
}

exports.logout = async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: "Unauthorized!"
      });
      return;
    }

    cache.set(token, true, 60 * 60 * 24)
    res.send({ message: "Token deleted!" })
  });
}



exports.login = async (req, res) => {
  req.body.username = req.body.username ? req.body.username : ""
  req.body.password = req.body.password ? req.body.password : ""
  const user = await User.findOne({
    where: {
      username: req.body.username
    },
    include: {
      model: Role,
      reqiured: true
    }
  })
  if (!user) {
    return res.status(401).send({ message: "Invalid credentials." });
  }

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Invalid credentials."
    });
  }

  if (!user.activeAccount) {
    return res.status(400).send({ message: "Account is not activated. Please check your email." });
  }

  const expiresSeconds = 60 * 60 * 24

  const token = jwt.sign({ id: user.id, role: user.role.dataValues.name }, config.secret, {
    expiresIn: expiresSeconds
  });

  const expires = new Date(Date.now() + 1000 * expiresSeconds)

  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role.dataValues.name,
    expires: expires,
    accessToken: token
  });
};
