const express = require('express');
const composerController = require('../controllers/composerController');

const router = express.Router();

router.get('/', composerController.index);
router.get('/:route', composerController.view_part);
router.get('/add/:instrument', composerController.add_part);
router.get('/add/:instrument/:svg_path', composerController.add_part_svg);
router.get('/delete/:route', composerController.delete_part);

module.exports = router;