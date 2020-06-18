const db = require('../models')
const CarRental = db.carRental;
const Reservation = db.reservation
const Car = db.car;
const CarCategory = db.carCategory;
const Fuel = db.fuel;
const Equipment = db.equipment;
const Address = db.address;

const canReservationBeDone = require('../validators/canReservationBeDone')

exports.add = async (req, res) => {
    const userId = req.identity.id;
    const { from, to, carRentalId } = req.body || {}

    const errors = [];
    if (from == null || to == null) {
        errors.push({ message: "From and to is required." });
    }

    if (new Date(from).getTime() > new Date(to).getTime()) {
        errors.push({ message: "Rent date from have to be before rent date to." })
    }
    if (new Date(from).getTime() < Date.now() || new Date(to).getTime() < Date.now()) {
        errors.push({ message: "Car cannot be rented in the past." })
    }
    if (carRentalId <= 0) {
        errors.push({ message: "Car rental id has not been specified correctly." })
    }
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    const carRental = await CarRental.findOne({ where: { id: carRentalId }, include: [Reservation] })
    const canBeDone = canReservationBeDone(carRental.reservations, new Date(from), new Date(to))
    if (!canBeDone) {
        errors.push({ message: "Car at this time is not available." })
    }
    if (errors.length > 0) {
        res.status(400).send({ errors })
        return;
    }

    const newReservation = await Reservation.create({
        from: from,
        to: to,
        carRentalId: carRentalId,
        userId: userId
    })

    res.send({ resourceId: newReservation.id })
}

exports.getMy = async (req, res) => {
    const userId = req.identity.id;
    let reservations = await Reservation.findAll({
        where: { userId: userId },
        include: [CarRental],
    })

    reservations = await Promise.all(reservations.map(async reservation => {
        let carId = reservation.car_rental.carId;
        let addressId = reservation.car_rental.addressId;
        let car = await Car.findOne({
            where: { id: carId },
            include: [CarCategory, Fuel, Equipment]
        })
        let address = await Address.findOne({ where: { id: addressId } })
        let resultReservation = JSON.parse(JSON.stringify(reservation));
        resultReservation.car_rental.car = car;
        resultReservation.car_rental.address = address;
        return resultReservation;
    }))

    res.send(reservations);
}

exports.remove = async (req, res) => {
    const reservationId = req.params.id;
    const userId = req.identity.id;
    let reservation = await Reservation.findOne({
        where: { userId: userId, id: reservationId }
    })

    if (reservation == null) {
        res.status(404).send({ message: "Reservation does not exists." })
        return;
    }

    await reservation.destroy();

    res.send({ message: "Reservation has been deleted." })
}