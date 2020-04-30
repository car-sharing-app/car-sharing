const DrivingLicense = require('../models').drivingLicense


function isPeselValid(pesel) {
    const length = pesel.length
    if (length == 11) {
        var controlSum = pesel[0] * 9 + pesel[1] * 7 + pesel[2] * 3 + pesel[3] * 1 + pesel[4] * 9 + pesel[5] * 7 + pesel[6] * 3 + pesel[7] * 1 + pesel[8] * 9 + pesel[9] * 7
        if (controlSum % 10 == pesel[10]) {
            return true;
        }
    }
    return false
}

exports.drivingLicenseValidation = (drivingLicense) => {
    const { firstName, lastName, birthDate,
        birthPlace, validFrom, validTo, drivingLicenseNumber, pesel } = drivingLicense || {};

    const errors = []
    if (firstName == null || firstName.length == 0) {
        errors.push({ message: "Firstname has not been given" })
    }

    if (lastName == null || lastName.length == 0) {
        errors.push({ message: "Lastname has not been given" })
    }

    const birthDateObject = new Date(birthDate)

    if (birthDateObject.getTime() >= Date.now()) {
        errors.push({ message: "Invalid birth date." })
    }

    if (birthPlace == null || birthPlace.length == 0) {
        errors.push({ message: "Birth place has not been given" })
    }

    const validFromObject = new Date(validFrom)
    if (birthDateObject.getTime() >= validFromObject.getTime()) {
        errors.push({ message: "Invalid birth date or valid from date." })
    }
    const validToObject = new Date(validTo)

    if (validFromObject.getTime() >= validToObject.getTime()) {
        errors.push({ message: "Invalid from date or invalid to date." })
    }

    if (birthDateObject.getTime() >= validToObject.getTime()) {
        errors.push({ message: "Invalid birth date or valid to date." })
    }

    if (validToObject.getTime() <= Date.now()) {
        errors.push({ message: "Driving license has already expired." })
    }

    const drivingLicenseNumberRegex = /\d{5}\/\d{2}\/\d{4}/
    if (drivingLicenseNumber == null || !drivingLicenseNumberRegex.test(drivingLicenseNumber)) {
        errors.push({ message: "Invalid driving license number." })
    }

    const peselRegex = /\d{11}/
    if (pesel == null || (!peselRegex.test(pesel)) || !isPeselValid(pesel)) {
        errors.push({ message: "Invalid PESEL number." })
    }

    return errors;

}

exports.drivingLicenseValidationAsync = async (drivingLicense) => {
    const errors = []
    const drivingLicenseWithGivenNumber = await DrivingLicense.findOne({
        where: {
            drivingLicenseNumber: drivingLicense.drivingLicenseNumber
        }
    })
    if (drivingLicenseWithGivenNumber) {
        errors.push({ message: "Given driving license is already in database." })
    }

    const drivingLicenseWithGivenPesel = await DrivingLicense.findOne({
        where: {
            pesel: drivingLicense.pesel
        }
    })
    if (drivingLicenseWithGivenPesel) {
        errors.push({ message: "Given pesel is already in database." })
    }
    return errors;
}