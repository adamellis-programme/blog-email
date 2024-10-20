const { upload } = require('../middleware/multerMiddleware')
const express = require('express')
const router = express.Router()

const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  deleteBlogAdmin,
  deleteBlogImage,
  updateBlogImage,
  uploadBulkImages,
  deleteBulkImages,
} = require('../controllers/blogController')
const { protect } = require('../middleware/authMiddleware')

const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
])
// get all and post one
router.route('/').get(protect, getBlogs).post(uploadFields, protect, createBlog)

router.route('/admin-delete/:id').delete(protect, deleteBlogAdmin)
router.route('/delete-img').put(protect, deleteBlogImage)
router.route('/update-img').put(upload.single('image'), protect, updateBlogImage)
router.route('/update-imgs/bulk').put(upload.array('images'), protect, uploadBulkImages)
router.route('/delete-imgs/bulk').put(protect, deleteBulkImages)
// ASK WHY IT WORKS WHEN WE MOVE DELETE ROUTE
router
  .route('/:id')
  .get(protect, getBlog)
  .delete(protect, deleteBlog)
  .put(protect, updateBlog)

module.exports = router
