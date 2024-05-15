const Router = require('express');
const router = new Router();
const controller = require('../controllers/adminController');
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

router.get('/users/',checkAdminMiddleware,controller.getUsers);
router.patch('/role/', checkAdminMiddleware, controller.changeRole);
router.get('/import/',checkAdminMiddleware,controller.importDatabase);
router.get('/export/',checkAdminMiddleware,controller.exportDatabase);

module.exports = router;