const db = require('../models')
const Equipment = db.equipment
exports.get = async (req, res) => {
    const equipment = await Equipment.findAll();
    res.send(equipment)
}