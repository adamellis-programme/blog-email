const {
  signUp,
  getEmailsAdmin,
  footerSignUp,
  msgSignUp,
  getUserForEmailAdmin,
  sendEmail,
} = require('../controllers/emailController')
const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(signUp).get(protect, getEmailsAdmin)
router.route('/user').post(protect, getUserForEmailAdmin)
router.route('/user/send').post(protect, sendEmail)
// no need for id as we get this from token
router.route('/footer').post(footerSignUp)
router.route('/msg').post(msgSignUp)

module.exports = router
