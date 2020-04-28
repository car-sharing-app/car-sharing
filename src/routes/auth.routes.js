const controller = require("../controllers/auth.controller");

const express = require("express")
const router = express.Router();

router.post("/register", controller.register)
router.get("/activate", controller.activate)
router.post("/login", controller.login)

module.exports = router;
