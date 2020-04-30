module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define("addreses", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        addressLine1: {
            type: Sequelize.STRING,
            required: true
        },
        addressLine2: {
            type: Sequelize.STRING,
            required: false
        },
        city: {
            type: Sequelize.STRING,
            required: true
        },
        zipCode: {
            type: Sequelize.STRING,
            required: true
        }
    });

    return Address;
};
