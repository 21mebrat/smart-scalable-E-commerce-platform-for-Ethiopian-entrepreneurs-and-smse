const express = require('express');
const { registerTemplate, getAllTemplate, getTemplateById, updateTempalate, deleteById } = require('../controllers/template.controller');
const upload = require('../config/multer.config')
const router = express.Router()

// Account routes
router.post('/register', upload.single('PreviewImage'), registerTemplate)
router.get('/get-all', getAllTemplate)
router.get('/get/:templateId', getTemplateById)
router.delete('/delete/:templateId', deleteById)
router.put('/update/:templateId', upload.single('PreviewImage'), updateTempalate)
module.exports = router 
