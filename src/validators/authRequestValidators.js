const db = require('../models')
const isNotValidPassword = require('./passwordValidation')
const User = db.user;

exports.registerValidation = (username, email, password, phoneNumber) => {
    const errors = [];
    if (username == null || username.length < 5) {
        errors.push({
            message: "Failed! Username has not been given or is too short!"
        })
    }

    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email == null || !emailRegex.test(email)) {
        errors.push({
            message: "Failed! Email has not been given or is not valid!"
        })
    }

    if (isNotValidPassword(password)) {
        errors.push({
            message: "Failed! Password has not been given or does not \
            contain minimum seven characters, at least one letter and one number!"
        })
    }

    const phoneNumberRegex = /^\d{9}$/;
    if (phoneNumber == null || !phoneNumberRegex.test(phoneNumber)) {
        errors.push({
            message: "Failed! Phone has not been given or it's incorrect!"
        })
    }

    return errors;
}

exports.registerValidationAsync = async (username, email, phoneNumber) => {
    const errors = [];
    const existingUserWithGivenUsername = await User.findOne({
        where: {
            username: username
        }
    })
    if (existingUserWithGivenUsername) {
        errors.push({
            message: "Failed! Username is already in use!"
        })
    }
    const existingUserWithGivenEmail = await User.findOne({
        where: {
            email: email
        }
    });
    if (existingUserWithGivenEmail) {
        errors.push({
            message: "Failed! Email is already in use!"
        })
    }
    const existingUserWithGivenPhoneNumber = await User.findOne({
        where: {
            phoneNumber: phoneNumber
        }
    })
    if (existingUserWithGivenPhoneNumber) {
        errors.push({
            message: "Failed! Phone number is already in use!"
        })
    }

    return errors;
}