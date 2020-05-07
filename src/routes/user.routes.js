const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const express = require("express")
const router = express.Router();
const adminRouter = express.Router();
adminRouter.use(authJwt.verifyToken);
adminRouter.use(authJwt.isAdmin);

adminRouter.post("/", controller.addAdmin);
adminRouter.delete("/:userId", controller.deleteAdmin);
adminRouter.get("/page/:pageNumber", controller.getUsers)

router.use(authJwt.verifyToken)

router.put("/me/password", controller.changePassword);
router.put("/me/email", controller.changeEmail);
router.put("/me/phone", controller.changePhoneNumber);
router.get("/me", controller.get);
router.get("/:id", controller.getUser)
router.delete("/me", controller.delete);

module.exports = {
    router: router,
    adminRouter: adminRouter
};