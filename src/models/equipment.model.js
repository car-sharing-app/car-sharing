module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipment", {
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

    return Equipment;
};
