const controller = require("../controllers/carRental.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt")

const express = require("express")
const adminRouter = express.Router();
adminRouter.use(verifyToken)
adminRouter.use(isAdmin)
adminRouter.post("/", controller.add)
adminRouter.delete("/:id", controller.remove)
adminRouter.get("/", controller.get)

exports.adminRouter = adminRouter;

const router = express.Router();
router.post('/search', controller.search)

exports.router = router;
