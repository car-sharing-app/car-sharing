const controller = require("../controllers/car.controller");
const { verifyToken, isAdmin } = require('../middleware/authJwt')
const express = require("express")
const router = express.Router();

router.use(verifyToken)
router.use(isAdmin)
router.get("/", controller.get)

module.exports = router;
