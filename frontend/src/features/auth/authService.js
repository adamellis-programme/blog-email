import axios from 'axios'

const API_URL = '/api/users'
const WELCOME_URL = '/api/users/welcome'
const API_URL_ADMIN = '/api/admin/create/'

// THIS SENDS THE USER DATA TO THE BACKEND TO BE AUTHENTICATED AND PROCECCED
// ONCE THE DATA COMES BACK WE NOW HAVE OUR TOKEN IN THE RES.DATA
// register user
// user data is name, email, password
// generates the token on the backend always
// we only use the token once we are logged in
// the register returns a token straight away from the backend an sets it to localStorage like when we login
//

// the reaseon we use the localStorage is that data will always be there until we delete it
// then when we move from page to page the auth.user state is always set to the localStorage item of user
// if the server sends back a response that means it is trusted and it will have the token in it
//    for the subsequent requests

const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  console.log('RESPONSE DATA==>', response)
  if (response.data) {
    // local storage can only have strings
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  // returns the data to the slice so we can pass into state with builders
  return response.data
}
const registerAsAdnin = async (token, userData) => {
  console.log(userData)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL_ADMIN, userData, config)
  console.log('RESPONSE DATA==>', response)
  // DO NOT WANT TO CHANGE THE LOGGED IN USER AS ADMIN REGISTERING
  if (response.data) {
    // local storage can only have strings
    // localStorage.setItem('user', JSON.stringify(response.data))
  }

  // returns the data to the slice so we can pass into state with builders
  return response.data
}

// 1: log in here
// 2: takes the userData and sends it to userRoutes /login
// 3: the controller then sends back the data to the client
// 4: sets that data to localStorage
// 5: finaly we set the auth.user to what is in localStorage with the token
// 6: we then send this to any protected routes --> const token = thunkAPI.getState().auth.user.token

const login = async (userData) => {
  console.log(userData)
  const response = await axios.post(API_URL + '/login', userData)
  console.log('RESPONSE DATA==>', response)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}
const sendWelcomeEmails = async (userData) => {
  console.log(userData)
  const response = await axios.post(WELCOME_URL, userData)
  console.log('RESPONSE DATA==>', response)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}
const logout = () => localStorage.removeItem('user')

// imoorted into slice
const authService = {
  register,
  logout,
  login,
  // admin
  registerAsAdnin,
  // send emails
  sendWelcomeEmails,
}

export default authService
