const controller = require("../controllers/car.controller");
const { verifyToken, isAdmin } = require('../middleware/authJwt')
const express = require("express")
const router = express.Router();

router.use(verifyToken)
router.use(isAdmin)
router.get("/", controller.get)
router.post("/", controller.add)
router.delete("/:id", controller.delete)

module.exports = router;
