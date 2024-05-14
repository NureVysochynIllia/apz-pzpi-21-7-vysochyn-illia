const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController')
const checkAuthorizedMiddleware = require("../middlewares/checkAuthorizedMiddleware");

router.get("/",checkAuthorizedMiddleware,controller.getProfile);
router.post("/reg/", controller.registration);
router.post("/login/", controller.login);
router.patch("/replenish/", checkAuthorizedMiddleware, controller.replenishBalance)

module.exports = router;