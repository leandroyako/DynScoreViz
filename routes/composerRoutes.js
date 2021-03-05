const express = require('express')
const router = express.Router()
const composerController = require('../controllers/composerController')

router.get('/', composerController.index)
router.get('/:route', composerController.view_part)
router.get('/add/:instrument', composerController.add_part)
router.get('/add/:instrument/:svg_path', composerController.add_part_svg)
router.get('/scroll/:instrument', composerController.scroll_part)
router.get('/delete/:route', composerController.delete_part)

module.exports = router;