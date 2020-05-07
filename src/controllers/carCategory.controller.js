const db = require('../models')
const CarCategory = db.carCategory
exports.get = async (req, res) => {
    const carCategories = await CarCategory.findAll();
    res.send(carCategories)
}