module.exports = (sequelize, Sequelize) => {
    const CarRental = sequelize.define("car_rental", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        prizePerDay: {
            type: Sequelize.REAL,
            required: true
        }
    }, {
        timestamps: false
    });

    return CarRental;
};
