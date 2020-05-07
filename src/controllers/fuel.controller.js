const db = require('../models')
const Fuel = db.fuel
exports.get = async (req, res) => {
    const fuels = await Fuel.findAll();
    res.send(fuels)
}