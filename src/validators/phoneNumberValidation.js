module.exports = (phoneNumber) => {
    const phoneNumberRegex = /^\d{9}$/;
    return phoneNumber == null || !phoneNumberRegex.test(phoneNumber)
}