const db = require("../models");
const config = require("../config/auth.config");
const emailService = require("../services/emailService")
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body || {};
  if (username == null || username.length < 5) {
    res.status(400).send({
      message: "Failed! Username has not been given or is too short!"
    })
    return;
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email == null || !emailRegex.test(email)) {
    res.status(400).send({
      message: "Failed! Email has not been given or is not valid!"
    })
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/
  if (password == null || !passwordRegex.test(password)) {
    res.status(400).send({
      message: "Failed! Password has not been given or does not contain minimum seven characters, at least one letter and one number!"
    })
    return;
  }

  const phoneNumberRegex = /^\d{9}$/;
  if (phoneNumber == null || !phoneNumberRegex.test(phoneNumber)) {
    res.status(400).send({
      message: "Failed! Phone has not been given or it's incorrect!"
    })
    return;
  }


  let existingUser = await User.findOne({
    where: {
      username: username
    }
  })
  if (existingUser) {
    res.status(400).send({
      message: "Failed! Username is already in use!"
    });
    return;
  }
  existingUser = await User.findOne({
    where: {
      email: email
    }
  });
  if (existingUser) {
    res.status(400).send({
      message: "Failed! Email is already in use!"
    });
    return;
  }
  existingUser = await User.findOne({
    where: {
      phoneNumber: phoneNumber
    }
  })
  if (existingUser) {
    res.status(400).send({
      message: "Failed! Phone number is already in use!"
    });
    return;
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



exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      const authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
