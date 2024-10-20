const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/multerMiddleware')

const {
  registerUser,
  loginUser,
  getMe,
  getCurrentUSer,
  updateUserDate,
  changePassword,
  changeEmail,
  changeName,
  deleteUser,
  updateUserPfofileImg,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
console.log(protect)
// this is a rest setup

// not to be protected
router.post('/', registerUser)
router.post('/login', loginUser)

// router.put('/update/:id', updateUserDate)
router.get('/me', protect, getMe)
router.put('/change-pw', protect, changePassword)
router.put('/change-email', protect, changeEmail)
router.put('/change-name', protect, changeName)
// delete user no need for :id as we get this from token
router.delete('/delete-user/:id', protect, deleteUser)

router.put('/update-user-img', upload.single('file'), protect, updateUserPfofileImg)

router.get('/logged-in-user', protect, getCurrentUSer)
router.route('/update/:id').put(protect, updateUserDate)
 
module.exports = router
