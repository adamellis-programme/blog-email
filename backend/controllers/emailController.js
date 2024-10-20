const asyncHandler = require('express-async-handler')
const EmailModel = require('../models/emailModel')
const UserModel = require('../models/userModel')
const MsgModel = require('../models/msgModel')

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
module.exports = { signUp, getEmailsAdmin, footerSignUp, msgSignUp, getUserForEmailAdmin }
