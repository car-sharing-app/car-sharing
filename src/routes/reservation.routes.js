const controller = require("../controllers/reservation.controller");
const authJwt = require("../middleware/authJwt")

const express = require("express")
const router = express.Router();

router.use(authJwt.verifyToken)
router.use(authJwt.isUser)

router.post("/", controller.add)
router.get("/me", controller.getMy)

module.exports = router;
