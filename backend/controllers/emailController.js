const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
const EmailModel = require('../models/emailModel')
const UserModel = require('../models/userModel')
const MsgModel = require('../models/msgModel')
const SendEmailModel = require('../models/sendEmailModel')

const { loadTemplate, sendEmailFunc } = require('../utils/emailSender')

// from the home page
const signUp = asyncHandler(async (req, res) => {
  // structured
  const { name, email, terms, date, time } = req.body

  if (!name || !email) {
    res.status(400)
    throw new Error('Please include all fields ')
  }

  if (!email.includes('@')) {
    res.status(400)
    throw new Error('must be an email address ')
  }

  if (!terms) {
    res.status(400)
    throw new Error('terms must be accepted')
  }

  // check if email exists
  const emailSignUp = await EmailModel.findOne({ email })
  console.log('FOUND=>', emailSignUp)

  if (emailSignUp) {
    res.status(400)
    throw new Error('Email Already Registered!')
  }

  const newSignUp = await EmailModel.create({
    name,
    email,
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)
})

// WHY MSG AND NOT EMAIL....
// from the message component
// made for a generic one and checked in the service
const msgSignUp = asyncHandler(async (req, res) => {
  const { name, email, terms, date, time } = req.body
  // check if email exists
  const emailSignUp = await EmailModel.findOne({ email })
  console.log('FOUND=>', emailSignUp)

  // do not throw a error as we want to return
  // and carry on running the code
  if (emailSignUp) {
    res.status(200).json({ msg: 'you are already on our mailing list!' })
    return
  }
  if (!email.includes('@')) {
    res.status(400)
    throw new Error('email must be a email address')
    // res.status(200).json({ msg: 'email must be a email address' })
    // return
  }

  const newSignUp = await EmailModel.create({
    name,
    email,
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)

  // if email exests exit and do nothing
  // do not throw an error
  // if emailExists return / break - do not add
  // test /msg with postman
  // we are not worried about promting the user
  // we just need to make sure we do not add the
  // same email twice

  // if req.body.from ==== 'msg'
})

// seperate from the home page
const footerSignUp = asyncHandler(async (req, res) => {
  const { terms, footerEmail, date, time } = req.body
  console.log('footer - email --> ', footerEmail)

  if (!footerEmail) {
    res.status(400)
    throw new Error('Please provide an email')
  }
  if (!footerEmail.includes('@')) {
    res.status(400)
    throw new Error('please us a proper email address!')
  }

  if (!terms) {
    res.status(400)
    throw new Error('Please accept the terms ')
  }

  const emailSignUp = await EmailModel.findOne({ email: footerEmail })

  if (emailSignUp) {
    res.status(400)
    throw new Error('Email Already Registered!')
  }

  const newSignUp = await EmailModel.create({
    email: footerEmail,
    name: 'footer signup',
    date,
    time,
    terms,
  })

  res.status(201).json(newSignUp)
})

// we have this seperat route for the msg sign up as we want to handle it differenly
// with the errors we throw and the checks we do

const getEmailsAdmin = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }
  if (loggedInAdmin.isSuspended === true) {
    res.status(401)
    throw new Error('You are suspended and cannot access this email area')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('User as admin not found')
  }

  // find all
  const allEmails = await EmailModel.find()

  if (!allEmails) {
    throw new Error('somthing went wrong')
  }

  res.status(200).json(allEmails)
})

const getUserForEmailAdmin = asyncHandler(async (req, res) => {
  const userID = req.user._id
  const loggedInAdmin = await UserModel.findById(userID)

  const emailListID = req.body.id

  const userToEmail = await EmailModel.findById(emailListID)

  if (loggedInAdmin.isAdmin === false) {
    res.status(401)
    throw new Error('You must be an admin to access these emails')
  }

  if (!loggedInAdmin) {
    res.status(401)
    throw new Error('You must be logged in as admin to use this feature ')
  }

  if (!userToEmail) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json(userToEmail)
})

const sendEmail = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { from, to, text, subject } = req.body
  console.log(from)
  console.log(to)
  console.log(text)

  // return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'theblogsite101@gmail.com',
      pass: 'ugth avtg hdos aaqs', // See note below on using app-specific passwords
    },
  })
  const formattedBody = text.replace(/\n/g, '<br>')
  const replacements = {
    username: to,
    dashboardLink: 'https://example.com/dashboard',
    senderName: from,
    companyName: 'Travel Blogging site',
    body: formattedBody, // Use the formatted body with <br> tags
    subject,
    year: new Date().getFullYear(),
  }
  const welcomeEmail = loadTemplate('genericEmail', replacements)

  // return
  // console.log(welcomeEmail)

  try {
    // Await the email sending
    const info = await transporter.sendMail({
      from,
      to,
      subject: `${subject} ✔`,
      text: text, // text is a fallback
      html: welcomeEmail,
    })

    const emailData = {
      to,
      from,
      subject,
      body: formattedBody,
      read: false,
    }

    // for upadte save() or findByIdAndUpdate()
    const savedEmail = await SendEmailModel.create(emailData)
    console.log(savedEmail)

    console.log('Message sent: %s', info.messageId)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Error sending email', error })
  }
})

const sendWelcomeEmails = asyncHandler(async (req, res) => {
  const { email, username, invoiceNumber, loginDetails, purchases, tier } = req.body

  console.log(tier)

  // return

  console.log(loginDetails)
  // return

  // Calculate subtotal, tax, and total
  const subtotal = purchases.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // Assuming 10% tax rate
  const total = subtotal + tax

  // Prepare the dynamic replacements for Handlebars templates
  const replacements = {
    username,
    invoiceNumber,
    purchases,
    loginDetails,
    subtotal: subtotal.toFixed(2), // Format to 2 decimal places
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  }

  try {
    // Load and compile each email template
    const welcomeEmail = loadTemplate('welcome', replacements)
    const invoiceEmail = loadTemplate('invoice', replacements)
    const loginDetailsEmail = loadTemplate('loginDetails', replacements)

    // Send welcome email
    await sendEmailFunc(email, 'Welcome to Our Service', welcomeEmail)

    // Send invoice email
    if (tier === 'prem') await sendEmailFunc(email, 'Your Invoice', invoiceEmail)

    // Send login details email
    await sendEmailFunc(email, 'Your Login Details', loginDetailsEmail)

    res.status(200).json({ message: 'Emails sent successfully!' })
  } catch (error) {
    console.error('Error sending emails:', error)
    res.status(500).json({ message: 'Failed to send emails', error })
  }
})

const markEmailAsRead = asyncHandler(async (req, res) => {
  console.log(req.body)
  console.log(req.body.id)
  console.log(req.body.email)
  return
})

module.exports = {
  signUp,
  getEmailsAdmin,
  footerSignUp,
  msgSignUp,
  getUserForEmailAdmin,
  sendEmail,
  sendWelcomeEmails,
  markEmailAsRead,
}
