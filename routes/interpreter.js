const router = require('express').Router()
const interpreterController = require('../controllers/interpreterController');

router.get('/', interpreterController.index);
router.get('/:route', interpreterController.view_part);

module.exports = router