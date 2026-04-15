const express = require('express')

const { loginAdmin, getMe } = require('../controllers/authController')
const { adminAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', loginAdmin)
router.get('/me', adminAuth, getMe)

module.exports = router
