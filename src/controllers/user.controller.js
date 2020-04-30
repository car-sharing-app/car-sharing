const isNotValidPassword = require('../validators/passwordValidation')
const isNotValidEmail = require('../validators/emailValidation')
const isNotVaildPhoneNumber = require('../validators/phoneNumberValidation')
const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.user
const { cache } = require('../services/cache')
const emailService = require('../services/emailService')
const config = require('../config/appUrl.config')

exports.changePassword = async (req, res) => {
  const userId = req.identity.id;
  const { oldPassword, newPassword } = req.body || {};
  const errors = [];
  if (isNotValidPassword(newPassword)) {
    errors.push({
      message: "Failed! Password has not been given or does not \
      contain minimum seven characters, at least one letter and one number!"
    })
  }

  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }

  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (user == null) {
    errors.push({ message: "User does not exists." })
    res.status(400).send({ errors })
    return;
  }

  const passwordIsValid = bcrypt.compareSync(
    oldPassword,
    user.password
  );
  if (!passwordIsValid) {
    res.status(401).send({ message: "Unauthorized!" })
  }
  const hash = bcrypt.hashSync(newPassword, 8);
  const key = 'changePassword-' + hash.replace('/', "").replace('/', "");
  cache.set(key, { operation: "changePassword", hash, id: user.id }, 60 * 60)
  emailService(user.email, "Confirm changing password (car-sharing).", "<a href='" + config.URL + "auth/confirm/" + key + "'>Click to confirm changing password.</a>")
  res.send({ message: "Check your email to confirm changing password." })
};

exports.changeEmail = async (req, res) => {
  const userId = req.identity.id;
  const { password, email } = req.body || {};
  const errors = [];
  if (isNotValidEmail(email)) {
    errors.push({
      message: "Email has not been given or is invalid!"
    })
  }

  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }
  var existingUserWithGivenEmail = await User.findOne({
    where: { email: email }
  })
  if (existingUserWithGivenEmail != null) {
    errors.push({
      message: "User with given email already exists."
    })
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }

  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (user == null) {
    errors.push({ message: "User does not exists." })
    res.status(400).send({ errors })
    return;
  }

  const passwordIsValid = bcrypt.compareSync(
    password,
    user.password
  );
  if (!passwordIsValid) {
    res.status(401).send({ message: "Unauthorized!" })
  }
  const encodedEmail = encodeURI(email)
  const key = 'changeEmail-' + encodedEmail;
  cache.set(key, { operation: "changeEmail", email, id: user.id }, 60 * 60)
  emailService(email, "Confirm changing email (car-sharing).", "<a href='" + config.URL + "auth/confirm/" + key + "'>Click to confirm new email address.</a>")
  res.send({ message: "Check your email to confirm changing email address." })
}

exports.changePhoneNumber = async (req, res) => {
  const userId = req.identity.id;
  const { phoneNumber } = req.body || {};
  const errors = [];

  if (isNotVaildPhoneNumber(phoneNumber)) {
    errors.push({
      message: "Failed! Phone has not been given or it's incorrect!"
    })
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }
  var existingUserWithGivenPhoneNumber = await User.findOne({
    where: { phoneNumber: phoneNumber }
  })
  if (existingUserWithGivenPhoneNumber != null) {
    errors.push({
      message: "User with given phone number already exists."
    })
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }

  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (user == null) {
    errors.push({ message: "User does not exists." })
    res.status(400).send({ errors })
    return;
  }

  user.phoneNumber = phoneNumber;
  await user.save();
  res.send({ message: "Phone number has been changed successfully." })
}

