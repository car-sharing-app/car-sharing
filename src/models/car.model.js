module.exports = (sequelize, Sequelize) => {
    const Car = sequelize.define("car", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand: {
            type: Sequelize.STRING,
            required: true
        },
        model: {
            type: Sequelize.STRING,
            required: true
        },
        model: {
            type: Sequelize.STRING,
            required: true
        },
        doorsNumber: {
            type: Sequelize.INTEGER,
            required: true
        },
        personsNumber: {
            type: Sequelize.INTEGER,
            required: true
        },
        automaticTransmition: {
            type: Sequelize.BOOLEAN,
            required: true
        }
    }, {
        timestamps: false
    });

    return Car;
};
