const db = require('../models')
const CarCategory = db.carCategory;
const Fuel = db.fuel;
const Equipment = db.equipment;

function arrayContainsIds(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] <= 0) {
            return false;
        }
    }
    return true;
}


exports.carValidation = (body) => {
    const { brand, model, doorsNumber, personsNumber, automaticTransmition, carCategoryId, fuelId, equipment } = body || {}

    const errors = [];
    if (brand == null || brand.length == 0) {
        errors.push({ message: "Brand has not been given." })
    }

    if (model == null || model.length == 0) {
        errors.push({ message: "Model has not been given." })
    }

    if (doorsNumber <= 0) {
        errors.push({ message: "Invalid amount of doors." })
    }

    if (personsNumber <= 0) {
        errors.push({ message: "Invalid amount of persons." })
    }

    if (typeof automaticTransmition !== "boolean") {
        errors.push({ message: "Information about transmition has not been given." });
    }

    if (carCategoryId <= 0) {
        errors.push({ message: "Invalid car category id." });
    }

    if (fuelId <= 0) {
        errors.push({ message: "Invalid fuel id." });
    }

    if (equipment.length == null) {
        errors.push({ message: "Equipment is not an array." });
    }

    if (!arrayContainsIds(equipment)) {
        errors.push({ message: "Equipment array does not contain IDs." });
    }

    return errors;
}


exports.carValidationAsync = async (body) => {
    const errors = [];
    const { carCategoryId, fuelId, equipment } = body || {}
    let result = await CarCategory.findOne({
        where: {
            id: carCategoryId
        }
    })
    if (result != null) {
        errors.push({ message: "Car category with given id does not exists." })
    }

    result = await Fuel.findOne({
        where: {
            id: fuelId
        }
    })
    if (result != null) {
        errors.push({ message: "Fuel with given id does not exists." })
    }

    for (let i = 0; i < equipment.length; i++) {
        result = await Equipment.findOne({
            where: {
                id: equipment[i]
            }
        })
        if (result != null) {
            errors.push({ message: "Equipment with given id does not exists." })
        }
    }
    return errors;
}