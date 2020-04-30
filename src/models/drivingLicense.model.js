module.exports = (sequelize, Sequelize) => {
    const DrivingLicense = sequelize.define("driving_licenses", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING,
            required: true
        },
        middleName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING,
            required: true
        },
        birthDate: {
            type: Sequelize.DATE,
            required: true
        },
        birthPlace: {
            type: Sequelize.STRING,
            required: true
        },
        validFrom: {
            type: Sequelize.DATE,
            required: true
        },
        validTo: {
            type: Sequelize.DATE,
            required: true
        },
        drivingLicenseNumber: {
            type: Sequelize.STRING,
            required: true
        },
        pesel: {
            type: Sequelize.STRING,
            required: true
        }
    });

    return DrivingLicense;
};
