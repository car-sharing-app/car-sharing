const { drivingLicenseValidation, drivingLicenseValidationAsync } = require('../validators/drivingLicenseValidators')
const { addressValidation } = require('../validators/addressValidation')
const db = require('../models')
const Profile = db.profile
const Address = db.address
const DrivingLicense = db.drivingLicense
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