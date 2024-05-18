const Router = require('express');
const router = new Router();
const controller = require('../controllers/rentController')
const checkAuthorizedMiddleware = require("../middlewares/checkAuthorizedMiddleware");
const checkStaffMiddleware = require("../middlewares/checkStaffMiddleware");

router.get('/', checkAuthorizedMiddleware,controller.getAvailableClusters);
router.get('/nearest/', checkAuthorizedMiddleware,controller.getNearestCluster);
router.post('/new/',checkAuthorizedMiddleware,controller.rentStorage);
router.get('/active/',checkAuthorizedMiddleware,controller.getActiveBookings);
router.get('/all/', checkAuthorizedMiddleware,controller.getAllBookings);
router.patch('/open/',checkAuthorizedMiddleware,controller.openStorage);
router.get('/:id/',checkStaffMiddleware, controller.isStorageBooked);

module.exports = router;