const Router = require('express');
const router = new Router();
const controller = require('../controllers/clusterController')
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");
const checkStaffMiddleware = require("../middlewares/checkStaffMiddleware");
const checkAuthorizedMiddleware = require("../middlewares/checkAuthorizedMiddleware");

router.get('/', checkStaffMiddleware,controller.getClusters);
router.post('/', checkAdminMiddleware, controller.addCluster);
router.get('/:id/', checkAuthorizedMiddleware,controller.getCluster);
router.patch('/:id/', checkAdminMiddleware, controller.editCluster);
router.delete('/:id/', checkAdminMiddleware, controller.deleteCluster);

module.exports = router;