import axios from 'axios'

const USER = '/api/users/update/'
// we use diffrent routes as in the email controller we manipulate the data diffrently
const SIGNUP = '/api/emails'
const SIGNUP_FOOTER = '/api/emails/footer'
const SIGNUP_MSG_FORM = '/api/emails/msg'
const CURRENT_USER = '/api/users/logged-in-user/'
const GET_ME = '/api/users/me'
const UPDATE_PW = '/api/users/change-pw'
const UPDATE_EMAIL = '/api/users/change-email'
const UPDATE_NAME = '/api/users/change-name'
const DELETE_USER = '/api/users/delete-user/'
const UPDATE_USER_PROFILE_IMG = '/api/users/update-user-img'

// change this name
const updateUserDate = async (blogID, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(USER + blogID, data, config)
  // console.log(response)
  return response.data
}

// =====================

const getCurrentUSer = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(CURRENT_USER, config)
  // console.log(response)
  return response.data
}
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(GET_ME, config)
  // console.log(response)
  return response.data
}

const updatePassword = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_PW, data, config)
  console.log(response)
  return response.data
}

const updateEmail = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_EMAIL, data, config)
  console.log(response)
  return response.data
}

const updateName = async (data, token) => {
  console.log(data)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_NAME, data, config)
  console.log(response)
  return response.data
}

const deleteUser = async (id, token) => {
  console.log(id)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(DELETE_USER + id, config)
  console.log(response)
  return response.data
}
// =====================

// this works but as all routes work and there
// is AN ELSE it will allways run the else if no other match matches
// MAKE another controller and route for the msg form
// and bypass the checks as we do this in the initial msg check

const emailSignUp = async (data) => {
  // console.log(data)
  if (data.from === 'footer') {
    const response = await axios.post(SIGNUP_FOOTER, data.data)
    console.log(response.data)
    return response.data
  } else if (data.from === 'msgPage' || data.from === 'regPage') {
    console.log(data.from)
    const response = await axios.post(SIGNUP_MSG_FORM, data.data)
    console.log(response.data)
    return response.data
    // change these to ifs not else
  } else {
    const response = await axios.post(SIGNUP, data.data)
    console.log(response.data)
    return response.data
  }
}

const updateUserProfileImage = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(UPDATE_USER_PROFILE_IMG, data, config)
  console.log(response)
  return response.data
}
const userService = {
  updateUserDate,
  getCurrentUSer,
  emailSignUp,
  getMe,
  updateName,
  updatePassword,
  updateEmail,
  deleteUser,
  updateUserProfileImage,
}

export default userService
