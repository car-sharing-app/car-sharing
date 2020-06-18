const db = require('../models')
const { addressValidation } = require('../validators/addressValidation')
const { QueryTypes } = require('sequelize');
const sequelize = require('sequelize');
const CarRental = db.carRental
const Address = db.address;
const Car = db.car;
const Equipment = db.equipment;
const Fuel = db.fuel;
const CarCategory = db.carCategory;
const Reservation = db.reservation;
const canReservationBeDone = require('../validators/canReservationBeDone');

exports.add = async (req, res) => {
    const { address, prizePerDay, carId } = req.body || {}
    const errors = addressValidation(address)
    if (prizePerDay <= 0) {
        errors.push({ message: "Prize per day cannot be lower or equal zero." })
    }
    if (carId <= 0) {
        errors.push({ message: "Car id cannot be lower or equal zero." })
    }


    const car = await Car.findOne({ where: { id: carId } })
    if (car == null) {
        errors.push({ message: "Car with given id does not exist." })
    }
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    const createdAddress = await Address.create({
        addressLine1: req.body.address.addressLine1,
        addressLine2: req.body.address.addressLine2,
        city: req.body.address.city,
        zipCode: req.body.address.zipCode
    })

    const carRental = await CarRental.create({
        prizePerDay: prizePerDay,
        addressId: createdAddress.id,
        carId: carId
    })

    res.send({ resourceId: carRental.id })
}

exports.remove = async (req, res) => {
    const carRentalId = req.params.id;
    const carRental = await CarRental.findOne({ where: { id: carRentalId } })
    if (carRental == null) {
        res.status(404).send({ message: "Car rental not found." })
        return;
    }
    const addressId = carRental.addressId;
    const address = await Address.findOne({ where: { id: addressId } });
    await carRental.destroy();
    await address.destroy();
    res.send({ message: "Car rental deleted." })
}

exports.search = async (req, res) => {
    const { rentFrom, rentTo, city, carCategoryId, fuelId, requiredEquipment, hasAutomaticTransmission, minPersonsNumber } = req.body || {}

    const errors = [];

    if (rentFrom == null || rentTo == null) {
        errors.push({ message: "Rent from and rent to is required." });
    }

    if (new Date(rentFrom).getTime() > new Date(rentTo).getTime()) {
        errors.push({ message: "Rent date from have to be before rent date to." })
    }
    if (new Date(rentFrom).getTime() < Date.now() || new Date(rentTo).getTime() < Date.now()) {
        errors.push({ message: "Car cannot be rented in the past." })
    }
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    let cars = await CarRental.findAll({
        include: [Address, Reservation]
    })
    cars = cars.filter(car => canReservationBeDone(car.reservations, new Date(rentFrom), new Date(rentTo)))
    if (city != null && city != "")
        cars = cars.filter(car => car.addrese.city.includes(city))

    cars = await Promise.all(cars.map(async carRental => {
        const car = await Car.findOne({
            where: {
                id: carRental.carId
            },
            include: [CarCategory, Equipment, Fuel]
        })
        return { carRental, car };
    }))

    if (carCategoryId > 0)
        cars = cars.filter(x => x.car.carCategoryId == carCategoryId)
    if (fuelId > 0)
        cars = cars.filter(x => x.car.fuelId == fuelId)
    if (hasAutomaticTransmission !== null && hasAutomaticTransmission !== undefined)
        cars = cars.filter(x => x.car.automaticTransmition == hasAutomaticTransmission)
    if (minPersonsNumber > 0)
        cars = cars.filter(x => x.car.personsNumber >= minPersonsNumber)
    if (requiredEquipment != null && requiredEquipment.length != null)
        cars = cars.filter(x => {
            for (let i = 0; i < requiredEquipment.length; i++) {
                if (x.car.equipment.findIndex(eq => eq.id == requiredEquipment[i]) < 0) {
                    return false;
                }
            }
            return true;
        })
    cars = cars.map(x => {
        const carRental = JSON.parse(JSON.stringify(x.carRental));
        carRental.car = x.car;
        return carRental;
    })

    res.send(cars);
}

exports.get = async (req, res) => {
    let carRentals = await CarRental.findAll({
        include: [Reservation, Car, Address]
    })
    res.send(carRentals)
}