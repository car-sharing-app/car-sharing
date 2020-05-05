const db = require('../models')
const Car = db.car
const CarCategory = db.carCategory;
const Equipment = db.equipment;
const Fuel = db.fuel;
const { carValidation, carValidationAsync } = require('../validators/carValidation')

exports.get = async (req, res) => {
    const cars = await Car.findAll({
        include: [CarCategory, Equipment, Fuel],
    });
    res.send(cars)
}

exports.add = async (req, res) => {
    const errors = carValidation(req.body)
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }
    errors.concat(await carValidationAsync(req.body));
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    const newCar = await Car.create({
        brand: req.body.brand,
        model: req.body.model,
        doorsNumber: req.body.doorsNumber,
        personsNumber: req.body.personsNumber,
        automaticTransmition: req.body.automaticTransmition,
        carCategoryId: req.body.carCategoryId,
        fuelId: req.body.fuelId
    })

    for (let i = 0; i < req.body.equipment.length; i++) {
        let equipment = await Equipment.findOne({ where: { id: req.body.equipment[i] } })
        await newCar.addEquipment(equipment);
    }
    res.send({
        resourceId: newCar.id
    })
}