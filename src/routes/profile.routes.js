const controller = require("../controllers/profile.controller");
const authJwt = require("../middleware/authJwt")

const express = require("express")
const router = express.Router();

router.use(authJwt.verifyToken)
router.use(authJwt.isUser)

router.post("/me", controller.create)
router.put("/me", controller.update)
router.get("/me", controller.get)

module.exports = router;
