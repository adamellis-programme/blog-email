const express = require('express')
const router = express.Router()
const { newMsg, getMessages, deleteMsg } = require('../controllers/msgCotroller')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(newMsg).get(protect, getMessages)

router.route('/:id').delete(protect, deleteMsg)

module.exports = router
