const isNotValidPassword = require('../validators/passwordValidation')
const isNotValidEmail = require('../validators/emailValidation')
const isNotVaildPhoneNumber = require('../validators/phoneNumberValidation')
const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.user;
const Role = db.role;
const { cache } = require('../services/cache')
const emailService = require('../services/emailService')
const config = require('../config/appUrl.config')
const { registerValidation, registerValidationAsync } = require('../validators/authRequestValidators')

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

exports.get = async (req, res) => {
  const userId = req.identity.id;
  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (user == null) return res.status(400).send({ message: 'User not found' })
  res.send({
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: req.identity.role
  })
}

exports.delete = async (req, res) => {
  const userId = req.identity.id;
  const user = await User.findOne({ where: { id: userId } });
  if (user == null) {
    return res.status(400).send({ message: 'User not found' });
  }
  cache.set(req.identity.token, true, 60 * 60 * 24);
  const addressId = user.addressId;
  if (addressId != null) {
    const address = await Address.findOne({ where: { id: addressId } });
    await user.destroy();
    await address.destroy();
  }
  else {
    await user.destroy();
  }
  res.send({ message: "User has been deleted." });
}

exports.addAdmin = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body || {};
  let errors = registerValidation(username, email, password, phoneNumber);
  if (errors.length > 0) {
    res.status(400).send({ errors })
    return;
  }
  errors = errors.concat(await registerValidationAsync(username, email, phoneNumber))
  if (errors.length > 0) {
    res.status(400).send({ errors })
    return;
  }

  const hash = bcrypt.hashSync(password, 8)


  const user = await User.create({
    username: username,
    email: email,
    password: hash,
    phoneNumber: phoneNumber,
    roleId: 2,
    activeAccount: true
  })

  res.status(200).send({
    resourceId: user.id
  })
}

exports.deleteAdmin = async (req, res) => {
  const userIdToDelete = req.params.userId;
  const userToDelete = await User.findOne({
    where: {
      id: userIdToDelete
    }
  })
  if (userToDelete == null) {
    res.status(404).send({ message: "User does not exists." })
    return;
  }
  const addressId = userToDelete.addressId;
  if (addressId != null) {
    const address = await Address.findOne({ where: { id: addressId } });
    await userToDelete.destroy();
    await address.destroy();
  }
  else {
    await userToDelete.destroy();
  }

  res.status(200).send({ message: "User has been deleted." });
}

exports.getUsers = async (req, res) => {
  const pageNumber = req.params.pageNumber;
  if (pageNumber <= 0) {
    res.status(400).send({ message: "Invalid page number" });
  }

  const usersAmount = await User.count();
  const pages = Math.ceil(usersAmount / 10)

  const users = await User.findAll({
    include: [Role],
    offset: (pageNumber - 1) * 10,
    limit: 10
  })

  res.send({
    pageNumber: pageNumber,
    allPages: pages,
    allUsers: usersAmount,
    users: users.map(x => {
      return {
        id: x.id,
        username: x.username,
        email: x.email,
        phoneNumber: x.phoneNumber,
        activeAccount: x.activeAccount,
        role: x.role.dataValues.name
      }
    })
  })
}

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  if (userId <= 0) {
    res.status(400).send({ message: "Invalid id." })
    return;
  }

  const user = await User.findOne({
    include: [Role],
    where: {
      id: userId
    }
  })
  if (user == null) {
    res.status(404).send({ message: "User does not exists." })
    return;
  }
  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    activeAccount: user.activeAccount,
    role: user.role.dataValues.name
  })
}