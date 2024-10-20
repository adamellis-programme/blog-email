const dotenv = require('dotenv').config()
const colors = require('colors')
const express = require('express')
const PORT = process.env.PORT || 6001
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleWare')
const path = require('path')
const cloudinary = require('cloudinary').v2
// const cors = require('cors')
// Serve static files from the 'public' folder
const app = express()

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'travel-adam',
  api_key: '976162447695986',
  api_secret: 'ew-2X-SkHrAAhvHWzHcxqV6M69A',
})

// Log the configuration
// console.log(cloudinary.config())

// app.use(
//   cors({
//     origin: 'http://localhost:3001', // Replace with your frontend's URL
//   })
// )
// conect to db using mongoos
connectDB()
//  initialises the app variable

app.use(express.static(path.join(__dirname, '..', 'public', 'uploads')))
console.log(path.join(__dirname, '..', 'public', 'uploads'))
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// // rest
// app.get('/', (req, res) => {
//   res.json({ msg: 'hello' })
// })

// connec address to that file    --    /api/users is the root api

// needs req, res
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/blogs', require('./routes/blogRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))

app.use('/api/public', require('./routes/publicRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

app.use('/api/emails', require('./routes/emailRoutes'))
app.use('/api/msg', require('./routes/msgRoutes'))

// --> for blogs ONLY:->)

app.use(errorHandler)

app.listen(PORT, () => console.log('server started on port ', PORT))
