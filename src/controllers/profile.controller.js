const { drivingLicenseValidation, drivingLicenseValidationAsync } = require('../validators/drivingLicenseValidators')
const { addressValidation } = require('../validators/addressValidation')
const db = require('../models')
const Profile = db.profile
const Address = db.address
const DrivingLicense = db.drivingLicense
const User = db.user;
exports.create = async (req, res) => {
    const userId = req.identity.id;
    const { aboutMe, drivingLicense, address } = req.body || {}

    let errors = drivingLicenseValidation(drivingLicense)
    errors.concat(addressValidation(address))
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }
    errors.concat((await drivingLicenseValidationAsync(drivingLicense)))
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    let theAboutMe = aboutMe == null ? "" : aboutMe

    await Profile.create({
        aboutMe: theAboutMe,
        userId: userId,
    })

    await DrivingLicense.create({
        firstName: req.body.drivingLicense.firstName,
        lastName: req.body.drivingLicense.lastName,
        middleName: req.body.drivingLicense.middleName,
        birthDate: req.body.drivingLicense.birthDate,
        birthPlace: req.body.drivingLicense.birthPlace,
        validFrom: req.body.drivingLicense.validFrom,
        validTo: req.body.drivingLicense.validTo,
        drivingLicenseNumber: req.body.drivingLicense.drivingLicenseNumber,
        pesel: req.body.drivingLicense.pesel,
        userId: userId
    })

    await Address.create({
        addressLine1: req.body.address.addressLine1,
        addressLine2: req.body.address.addressLine2,
        city: req.body.address.city,
        zipCode: req.body.address.zipCode,
        userId: userId
    })

    res.send({ message: "Profile has been created successfully." })
}

exports.update = async (req, res) => {
    const userId = req.identity.id;
    const { aboutMe, drivingLicense, address } = req.body || {}

    let errors = drivingLicenseValidation(drivingLicense)
    errors.concat(addressValidation(address))
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }
    errors.concat((await drivingLicenseValidationAsync(drivingLicense, userId)))
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    let theAboutMe = aboutMe == null ? "" : aboutMe

    const profile = await Profile.findOne({
        where: {
            userId: userId,
        }
    })
    profile.aboutMe = theAboutMe
    await profile.save();

    const drivingLicenseFromDB = await DrivingLicense.findOne({
        where: {
            userId: userId,
        }
    })
    drivingLicenseFromDB.firstName = req.body.drivingLicense.firstName
    drivingLicenseFromDB.lastName = req.body.drivingLicense.lastName
    drivingLicenseFromDB.middleName = req.body.drivingLicense.middleName
    drivingLicenseFromDB.birthDate = req.body.drivingLicense.birthDate
    drivingLicenseFromDB.birthPlace = req.body.drivingLicense.birthPlace
    drivingLicenseFromDB.validFrom = req.body.drivingLicense.validFrom
    drivingLicenseFromDB.validTo = req.body.drivingLicense.validTo
    drivingLicenseFromDB.drivingLicenseNumber = req.body.drivingLicense.drivingLicenseNumber
    drivingLicenseFromDB.pesel = req.body.drivingLicense.pesel
    await drivingLicenseFromDB.save();


    const addressFromDb = await Address.findOne({
        where: {
            userId: userId,
        }
    })
    addressFromDb.addressLine1 = req.body.address.addressLine1
    addressFromDb.addressLine2 = req.body.address.addressLine2
    addressFromDb.city = req.body.address.city
    addressFromDb.zipCode = req.body.address.zipCode
    await drivingLicenseFromDB.save();

    res.send({ message: "Profile has been updated successfully." })
}

exports.get = async (req, res) => {
    const userId = req.identity.id;
    const user = await User.findOne({
        where: {
            id: userId
        },
        include: [Address, DrivingLicense, Profile]
    })
    res.send({
        address: {
            addressLine1: user.addrese.dataValues.addressLine1,
            addressLine2: user.addrese.dataValues.addressLine2,
            city: user.addrese.dataValues.city,
            zipCode: user.addrese.dataValues.zipCode
        },
        aboutMe: user.profile.dataValues.aboutMe,
        drivingLicense: {
            firstName: user["driving_license"].dataValues.firstName,
            lastName: user["driving_license"].dataValues.lastName,
            middleName: user["driving_license"].dataValues.middleName,
            birthDate: user["driving_license"].dataValues.birthDate,
            birthPlace: user["driving_license"].dataValues.birthPlace,
            validFrom: user["driving_license"].dataValues.validFrom,
            validTo: user["driving_license"].dataValues.validTo,
            drivingLicenseNumber: user["driving_license"].dataValues.drivingLicenseNumber,
            pesel: user["driving_license"].dataValues.pesel,
        }
    })
}

