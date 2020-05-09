module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define("reservation", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        from: {
            type: Sequelize.DATE,
            required: true
        },
        to: {
            type: Sequelize.DATE,
            required: true
        }
    });

    return Reservation;
};
