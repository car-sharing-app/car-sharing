const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.hasMany(db.user, {
  foreignKey: "roleId",
  sourceKey: "id"
});
db.user.belongsTo(db.role, {
  foreignKey: "roleId",
  targetKey: "id"
});

db.ROLES = ["user", "admin"];

module.exports = db;
