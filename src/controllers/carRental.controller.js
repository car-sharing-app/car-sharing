const db = require('../models')
const { addressValidation } = require('../validators/addressValidation')

const CarRental = db.carRental
const Address = db.address;
const Car = db.car;
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