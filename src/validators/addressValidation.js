exports.addressValidation = (address) => {
    const { addressLine1, city, zipCode } = address || {};

    const errors = []
    if (addressLine1 == null || addressLine1.lenght == 0) {
        errors.push({ message: "First address line has not been given." })
    }

    if (city == null || city.lenght == 0) {
        errors.push({ message: "City has not been given." })
    }
    const zipCodeRegex = /\d{2}-\d{3}/
    if (zipCode == null || !zipCodeRegex.test(zipCode)) {
        errors.push({ message: "Zip code has not been given or is invalid." })
    }
    return errors;

}