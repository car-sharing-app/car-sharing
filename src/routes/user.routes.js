const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const express = require("express")
const router = express.Router();

router.use(authJwt.verifyToken)

router.put("/me/password", controller.changePassword);
router.put("/me/email", controller.changeEmail);
router.put("/me/phone", controller.changePhoneNumber);

module.exports = router;