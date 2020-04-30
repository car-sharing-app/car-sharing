module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profiles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        aboutMe: {
            type: Sequelize.STRING
        }
    });

    return Profile;
};
