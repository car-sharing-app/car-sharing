module.exports = (sequelize, Sequelize) => {
    const CarCategory = sequelize.define("car_categories", {
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

    return CarCategory;
};
