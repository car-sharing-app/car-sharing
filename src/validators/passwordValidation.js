module.exports = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/
    return password == null || !passwordRegex.test(password)
}