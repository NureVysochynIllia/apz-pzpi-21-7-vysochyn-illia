const Router = require('express');
const router = new Router();
const controller = require('../controllers/staffController')
const checkStaffMiddleware = require("../middlewares/checkStaffMiddleware");

router.post("/price/",checkStaffMiddleware, controller.changePrice);
router.get('/stat/',checkStaffMiddleware,controller.getStatistics);

module.exports = router;