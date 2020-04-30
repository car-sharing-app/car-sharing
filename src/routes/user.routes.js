const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const express = require("express")
const router = express.Router();

router.use(authJwt.verifyToken)

router.put("/me/password", controller.changePassword);

module.exports = router;