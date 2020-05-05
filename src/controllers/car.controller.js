const db = require('../models')
const Car = db.car
const CarCategory = db.carCategory;
const Equipment = db.equipment;
const Fuel = db.fuel;

exports.get = async (req, res) => {
    const cars = await Car.findAll({
        include: [CarCategory, Equipment, Fuel],
    });
    res.send(cars)
}