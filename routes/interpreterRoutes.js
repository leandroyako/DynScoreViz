const express = require('express');
const interpreterController = require('../controllers/interpreterController');

const router = express.Router();

router.get('/', interpreterController.index);
router.get('/:route', interpreterController.view_part);

module.exports = router;