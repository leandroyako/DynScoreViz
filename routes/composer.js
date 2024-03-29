const router = require('express').Router()
const controller = require('../controllers/composer')

router.get('/', controller.index)
//router.get('/settings', controller.settings)
router.get('/:route', controller.view_part)
router.get('/addPart/:route/:name', controller.add_part)
router.get('/addStaff/:route/:svg_path', controller.add_staff)
router.get('/scroll/:route', controller.scroll_part)
router.get('/scroll/:route/:beats', controller.scroll_next_beats)
router.get('/delete/:route', controller.delete_part)
router.get('/previewStaff/:route/:svg_path', controller.preview_staff)
router.get('/clearPreview/:route', controller.clear_preview)

module.exports = router