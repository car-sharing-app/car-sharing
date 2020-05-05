module.exports = (sequelize, Sequelize) => {
    const Fuel = sequelize.define("fuel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        timestamps: false
    });

    return Fuel;
};
