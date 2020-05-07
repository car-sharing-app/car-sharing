module.exports = (sequelize, Sequelize) => {
    const CarRental = sequelize.define("carRental", {
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
