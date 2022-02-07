const router = require('express').Router()
const controller = require('../controllers/interpreter');

router.get('/', controller.index);
router.get('/settings', controller.settings);
router.get('/:route', controller.view_part);

module.exports = router