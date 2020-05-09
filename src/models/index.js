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
db.address = require("../models/address.model.js")(sequelize, Sequelize);
db.drivingLicense = require("../models/drivingLicense.model.js")(sequelize, Sequelize)
db.profile = require("../models/profile.model.js")(sequelize, Sequelize)
db.carCategory = require("../models/carCategory.model.js")(sequelize, Sequelize)
db.fuel = require("../models/fuel.model.js")(sequelize, Sequelize)
db.equipment = require("../models/equipment.model.js")(sequelize, Sequelize)
db.car = require("../models/car.model.js")(sequelize, Sequelize)
db.carRental = require("../models/carRental.model.js")(sequelize, Sequelize)
db.reservation = require("../models/reservation.model.js")(sequelize, Sequelize)

db.address.hasOne(db.carRental, {
  foreignKey: "addressId",
  sourceKey: "id",
  onDelete: 'CASCADE'
})

db.carRental.belongsTo(db.address, {
  foreignKey: "addressId",
  targetKey: "id",
  onDelete: 'CASCADE'
});

db.car.hasMany(db.carRental, {
  foreignKey: "carId",
  sourceKey: "id",
})

db.carRental.belongsTo(db.car, {
  foreignKey: "carId",
  targetKey: "id",
});

db.role.hasMany(db.user, {
  foreignKey: "roleId",
  sourceKey: "id"
});
db.user.belongsTo(db.role, {
  foreignKey: "roleId",
  targetKey: "id"
});

db.user.belongsTo(db.address, {
  foreignKey: "addressId",
  targetKey: "id"

})
db.address.hasOne(db.user, {
  foreignKey: "addressId",
  sourceKey: "id",
  onDelete: 'CASCADE'
})

db.user.hasOne(db.drivingLicense, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: 'CASCADE'
})
db.drivingLicense.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id"
})

db.user.hasOne(db.profile, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: 'CASCADE'
})
db.profile.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id"
})

db.carCategory.hasMany(db.car, {
  foreignKey: "carCategoryId",
  sourceKey: "id"
})

db.car.belongsTo(db.carCategory, {
  foreignKey: "carCategoryId",
  targetKey: "id"
})

db.fuel.hasMany(db.car, {
  foreignKey: "fuelId",
  sourceKey: "id"
})

db.car.belongsTo(db.fuel, {
  foreignKey: "fuelId",
  targetKey: "id"
})

db.carRental.hasMany(db.reservation, {
  foreignKey: "carRentalId",
  sourceKey: "id"
})

db.reservation.belongsTo(db.carRental, {
  foreignKey: "carRentalId",
  targetKey: "id"
})

db.user.hasMany(db.reservation, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: 'CASCADE'
})

db.reservation.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
  onDelete: 'CASCADE'
})

db.equipment.belongsToMany(db.car, { through: 'car_equipment' });
db.car.belongsToMany(db.equipment, { through: 'car_equipment' });

db.ROLES = ["user", "admin"];

module.exports = db;
