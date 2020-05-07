const controller = require("../controllers/carRental.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt")

const express = require("express")
const router = express.Router();
router.use(verifyToken)
router.use(isAdmin)
router.post("/", controller.add)

module.exports = router;
