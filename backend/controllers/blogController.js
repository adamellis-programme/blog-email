const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const BlogModel = require('../models/blogModel')
const cloudinary = require('cloudinary').v2
const fs = require('fs') // To delete files

// @desc get ALL user blogs
// @route GET api/
// @ access private
const getBlogs = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  // console.log('USER-123=================IS ADMIN<>>', user.isAdmin)
  // console.log(user)

  // IF !ADMIN THROW NEW ERROR
  // IF ISADMIN ...
  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  // this is how we find all the blogs for that user
  const blogs = await BlogModel.find({ userID: userID })
  // console.log('blogs ====>>>>>>', blogs)
  res.status(200).json(blogs)
})

/**
 * 
 * 
 * const imagesToUpload = images.map((image) => {
  return limit(async () => {
    const result = await cloudinary.uploader.upload(image);
    return result;
  })
});

let uploads = await Promise.all(imagesToUpload);
console.log(uploads);
 * 
 * 
 */

// // @desc create new blog
// // @route POST api/blogs
// // @ access private
const createBlog = asyncHandler(async (req, res) => {
  console.log('req.body ===>', req.body)
  console.log('req.files ===>', req.files) // Logs the uploaded files

  const imageUrls = []
  let heroImage = {}

  // Process the hero image if it exists
  if (req.files['heroImage'] && req.files['heroImage'][0]) {
    const heroImageFile = req.files['heroImage'][0]
    console.log('Hero Image PATH -> ', heroImageFile.path)

    try {
      // Upload hero image to Cloudinary with higher resolution or different settings if needed
      const result = await cloudinary.uploader.upload(heroImageFile.path, {
        folder: 'blogs/heroImages', // Separate folder for hero images if desired
        width: 1600,
        height: 900,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto',
      })

      console.log('Hero Image Upload RESULT -> ', result)

      // Assign the secure URL from Cloudinary to the heroImage variable
      heroImage.url = result.secure_url
      heroImage.id = result.public_id

      // After successfully uploading to Cloudinary, delete the local file
      fs.unlink(heroImageFile.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${heroImageFile.path}`)
        } else {
          console.log(`Successfully deleted local file: ${heroImageFile.path}`)
        }
      })
    } catch (error) {
      console.error('Cloudinary upload error (Hero Image):', error)
      res.status(500)
      throw new Error('Hero image upload failed.')
    }
  }

  // Process other images if they exist
  if (req.files['images'] && req.files['images'].length > 0) {
    for (const file of req.files['images']) {
      console.log('Image PATH -> ', file.path)
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'blogs', // The folder where the images will be stored in Cloudinary
          width: 800,
          height: 500,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
          flags: 'progressive',
        })

        console.log('Image Upload RESULT -> ', result)

        // Push the secure URL from Cloudinary to the imageUrls array
        imageUrls.push({ url: result.secure_url, id: result.public_id })

        // After successfully uploading to Cloudinary, delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Failed to delete local file: ${file.path}`)
          } else {
            console.log(`Successfully deleted local file: ${file.path}`)
          }
        })
      } catch (error) {
        console.error('Cloudinary upload error (Image):', error)
        res.status(500)
        throw new Error('Image upload failed.')
      }
    }
  }

  // Destructure the necessary fields from req.body
  const { author, blogTitle, blogBody, country, featured, publish, status, lastEdited } =
    req.body

  if (!author || !blogTitle || !blogBody || !country) {
    res.status(400)
    throw new Error('Please include all required fields.')
  }

  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('No user found.')
  }

  // Create the blog with Cloudinary image URLs
  const blog = await BlogModel.create({
    author,
    userID, // From the JWT signed token decoded in auth and assigned to req.user
    blogTitle,
    blogBody,
    country,
    featured,
    publish,
    status,
    lastEdited,
    imageData: {
      heroImage, // The hero image URL onj
      imageUrls: imageUrls, // The array of other image URLs and IDs
    },
  })

  res.status(201).json(blog)
})

// Note: Be cautious when logging FormData
// containing files, as the file content won't
// be displayed, but you can verify that the keys and filenames are correct.

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  // if id is not correct show a error page
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log(blog)

  if (!blog) {
    res.status(404).json({ msg: 'not found ...' })
    throw new Error('No Blog Article Found')
  }

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  // console.log('blog userId ====> ', blog.userID)
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  res.status(200).json(blog)
})

// @desc DELETE  user blog
// @route DELETE api/blogs/:id
// @ access private
const deleteBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  // console.log('blog userId ====> ', blog.userID)
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  await blog.deleteOne()

  res.status(200).json({ success: true })
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
const updateBlog = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // limit blog article to that user
  // console.log('blog userId ====> ', blog.userID)

  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized this must be your blog to update')
  }

  // req.body has all the data to update
  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

// @desc get ALL user blogs
// @route GET api/public/
// @ access public
const getPublicBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.find()
  // console.log('blogs ====>>>>>>', blogs)
  res.status(200).json(blogs)
})

// @desc update  user blog
// @route PUT api/blogs/:id
// @ access private
const updatePublicBlog = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id)

  // console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // req.body has all the data to update
  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

const getPublicBlog = asyncHandler(async (req, res) => {
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log('blog ====>>>>>>', blog)
  // will only show Error if the id is exact length
  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found ...')
  }

  if (blog.suspended === true) {
    res.status(401)
    throw new Error('this blog has been suspended please contact a member of our team')
  }

  if (blog.publish === false) {
    throw new Error(
      'This blog is not ready to be viewed at this time please check back later!'
    )
  }

  res.status(200).json(blog)
})

// ====================================== ADMIN ====================================== //

// @desc get ALL blogs for admin
// @route GET api/admin
// @ access private

// // @desc create new blog
// // @route POST api/blogs
// // @ access private
const createBlogAsAdmin = asyncHandler(async (req, res) => {
  //  still nees the req.id to see if user is an admin and has authority

  // console.log('REQ-BODY-> ', req.body)
  console.log('REQ-FILES-> ', req.files)

  const imageUrls = []
  let heroImage = {}

  // check for hero image object
  if (req.files['heroImage'] && req.files['heroImage'][0]) {
    // get hero file obj
    const heroImageFile = req.files['heroImage'][0]

    console.log(heroImageFile)
    try {
      const result = await cloudinary.uploader.upload(heroImageFile.path, {
        folder: 'blogs/heroImages', // Separate folder for hero images if desired
        width: 1600,
        height: 900,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto',
      })

      console.log(result)
      heroImage.url = result.secure_url
      heroImage.id = result.public_id

      fs.unlink(heroImageFile.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${heroImageFile.path}`)
        } else {
          console.log(`Successfully deleted local file: ${heroImageFile.path}`)
        }
      })
    } catch (error) {
      console.error('Cloudinary upload error (Hero Image):', error)
      res.status(500)
      throw new Error('Hero image upload failed.')
    }
  }

  // check for images object / obj contains array
  if (req.files['images'] && req.files['images'].length > 0) {
    for (const file of req.files['images']) {
      console.log('Image PATH -> ', file.path)
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'blogs', // The folder where the images will be stored in Cloudinary
          width: 800,
          height: 500,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
          flags: 'progressive',
        })

        console.log('Image Upload RESULT -> ', result)

        // Push the secure URL from Cloudinary to the imageUrls array
        imageUrls.push({ url: result.secure_url, id: result.public_id })

        // After successfully uploading to Cloudinary, delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Failed to delete local file: ${file.path}`)
          } else {
            console.log(`Successfully deleted local file: ${file.path}`)
          }
        })
      } catch (error) {
        console.error('Cloudinary upload error (Image):', error)
        res.status(500)
        throw new Error('Image upload failed.')
      }
    }
  }

  const {
    author,
    blogTitle,
    blogBody,
    edited,
    country,
    publish,
    featured,
    status,
    lastEdited,
    userID,
    createdByAdmin,
  } = req.body

  if (!author || !blogTitle || !blogBody || !country) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  const loggedInUser = req.user.id
  const user = await User.findById(loggedInUser)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  if (user.isAdmin === false) {
    res.status(401)
    throw new Error('you have to have admin access to access this area')
  }
  if (user.isSuspended === true) {
    res.status(401)
    throw new Error('you are currently suspended please contact admin support!')
  }

  // if passes above test then create the blog
  const blog = await BlogModel.create({
    author,
    userID,
    blogTitle,
    blogBody,
    country,
    featured,
    publish,
    status,
    lastEdited,
    createdByAdmin,
    imageData: {
      heroImage, // The hero image URL onj
      imageUrls: imageUrls, // The array of other image URLs and IDs
    },
  })

  res.status(201).json(blog)
})
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  // console.log('USER-123=================IS ADMIN<>>', user.isAdmin)
  // console.log(user)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }
  // IF !ADMIN THROW NEW ERROR
  // IF ISADMIN ...

  if (user.isAdmin === false) {
    res.status(401)
    throw new Error('you have to have admin access to access this area')
  }
  if (user.isSuspended === true) {
    res.status(401)
    throw new Error('you art currently suspended please contact admin support!')
  }

  const blogs = await BlogModel.find()
  // console.log('blogs ====>>>>>>', blogs)
  res.status(200).json(blogs)
})

// @desc get  user blog
// @route GET api/blogs/:id
// @ access private
const getBlogAdmin = asyncHandler(async (req, res) => {
  if (req.params.id.length < 24) {
    res.status(400)
    throw new Error('no such blog exists')
  }

  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // check if is admin
  if (user.isAdmin === false) {
    throw new Error('You must be admin to view this document')
  }

  res.status(200).json(blog)
})

// @desc update blog admin
// @route PUT api/admin/:id
// @ access private
const updateBlogAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(401)
    throw new Error('User Not Found!')
  }

  const blog = await BlogModel.findById(req.params.id)
  // console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  // check if is admin
  if (user.isAdmin === false) {
    throw new Error('you must be admin to edit this blog')
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedBlog)
})

// @desc DELETE  user blog
// @route DELETE api/blogs/:id
// @ access private
const deleteBlogAdmin = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check if is admin
  if (user.isAdmin === false) {
    throw new Error('you must be admin to delete this article')
  }

  // if user is suspended
  if (user.isSuspended) {
    throw new Error('you are suspended')
  }

  const blog = await BlogModel.findById(req.params.id)
  console.log(blog)

  if (!blog) {
    res.status(404)
    throw new Error('No Blog Article Found')
  }

  await blog.deleteOne()

  res.status(200).json({ success: true })
})

// **  REFACTOR *** ///
// check if id matches id
const deleteBlogImage = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)
  const isDeleteHero = req.body.deleteHero
  console.log('DELTE-HERO BOOLEAN', isDeleteHero)
  console.log('DELTE-HERO BOOLEAN', req.body)
  // return // for de-bugging
  // check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check blog
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData
  // const imgToDelete = imageData.imageUrls.filter((i) => i.id === req.body.imgID)

  const { imageUrls } = imageData
  const updatedURLS = imageUrls.filter((i) => i.id !== req.body.imgID)

  // check if there to stop error
  if (blog.imageData.imageUrls) blog.imageData.imageUrls = updatedURLS
  if (isDeleteHero) blog.imageData.heroImage = {}

  // Make the changes and Save the updated document
  await blog.save()
  await cloudinary.uploader
    .destroy(req.body.imgID)
    .then((data) => console.log('image deleted!'))
  res.status(200).json(blog)
})

const updateBlogImage = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)

  const isHero = req.body.hero

  console.log('REQ.BODY---->', req.file)
  // return
  // check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check blog
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData
  const { imageUrls } = imageData

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: isHero ? 'blogs/heroImages' : 'blogs',
    width: 800,
    height: 500,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
    flags: 'progressive',
  })

  const newImgData = {
    url: result.secure_url,
    id: result.public_id,
  }

  // only run if not a hero
  if (!isHero) {
    const newArr = imageUrls.map((item) => {
      if (item.id === req.body.imgID) {
        return { ...newImgData }
      } else {
        return { ...item }
      }
    })
    console.log('IMAGE URLS', newArr)
    blog.imageData.imageUrls = newArr
  }

  blog.imageData.heroImage = newImgData

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(`Failed to delete local file: ${req.file.path}`)
    } else {
      console.log(`Successfully deleted local file: ${req.file.path}`)
    }
  })

  await blog.save()
  await cloudinary.uploader.destroy(req.body.imgID)
  console.log('hello there success')
  res.status(200).json({ success: true, blog })
})

const uploadBulkImages = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const blog = await BlogModel.findById(req.body.blogID)

  // Check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // Check blog ownership
  if (blog.userID.toString() !== userID) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const imageData = blog.imageData
  const { imageUrls } = imageData || { imageUrls: [] } // Ensure imageUrls is an array

  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('No files uploaded')
  }

  const imageUrlData = []
  // RESIZE ON UPLOAD
  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'blogs',
        width: 800,
        height: 500,
        crop: 'limit',
        quality: 'auto:good',
        fetch_format: 'auto',
        flags: 'progressive',
      })

      imageUrlData.push({ url: result.secure_url, id: result.public_id })

      // Delete the temporary file
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${file.path}`)
        } else {
          console.log(`Successfully deleted local file: ${file.path}`)
        }
      })
    } catch (error) {
      console.error(`Failed to upload image: ${file.path}`, error)
      throw new Error('Image upload failed')
    }
  }

  // Merge existing images with new images
  const updatedUrlData = [...imageUrls, ...imageUrlData]

  // Update the blog document
  blog.imageData.imageUrls = updatedUrlData

  // Save the updated blog
  await blog.save()

  console.log('Updated Image URLs:', blog.imageData.imageUrls)

  // Send the updated blog in the response
  res.status(200).json({ success: true, blog })
})

const deleteBulkImages = asyncHandler(async (req, res) => {
  const userID = req.user.id
  const user = await User.findById(userID)
  const isDeleteBlog = req.body.deleteBlog
  const blog = await BlogModel.findById(req.body.blogID)

  console.log('IS FROM DELETE BLOG ---> ', isDeleteBlog)
  // Check user
  if (!user) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  // check is user is admin then bypass
  console.log('user-admon-->', user.isAdmin)

  // Check blog ownership
  // If admin ovride this check
  if (!user.isAdmin) {
    if (blog.userID.toString() !== userID) {
      res.status(401)
      throw new Error('Not Authorized')
    }
  }
  // console.log('IMAGE DATA-:-->', blog.imageData)

  // we changed the data structure
  const imageData = blog.imageData
  const { imageUrls, heroImage } = imageData || { imageUrls: [] } // Ensure imageUrls is an array

  console.log('IMAGE URLS:-->', imageUrls)
  // CHECK WHY _ID AND THEN NOT ID ON heroImage
  console.log('HERO IMAGE DATA:-->', heroImage)

  const newImagesArray = [...imageUrls, heroImage]

  console.log('UPDATED--IMAGES--ARR-->', newImagesArray)

  // MAKE A NEW ARRAY, SPREAD OUT AND ADD THE HERO OBJECT ON
  // check the blod id is being sent
  for (const image of newImagesArray) {
    await cloudinary.uploader
      .destroy(image.id)
      .then((data) => console.log('img deleted -- '))
  }

  // delete all images from array
  blog.imageData.imageUrls = []

  // TO DO LOADER FOR ALL BLOG PAGES, PUBLIC, USER

  // do not save if deleteing blog
  if (!isDeleteBlog) {
    await blog.save()
  }

  res.status(200).json({ success: true, blog })
})

module.exports = {
  getBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
  getPublicBlogs,
  getPublicBlog,
  updatePublicBlog,
  deleteBlogImage,
  updateBlogImage,
  uploadBulkImages,
  deleteBulkImages,
  // admin
  getAllBlogsAdmin,
  updateBlogAdmin,
  getBlogAdmin,
  deleteBlogAdmin,
  createBlogAsAdmin,
}
