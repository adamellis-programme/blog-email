import axios from 'axios'

const API_URL_ADMIN = '/api/admin/users/'
const API_URL_EMAILS = '/api/emails'
const API_URL_USER_EMAIL = '/api/emails/user'

const getAllUsersAdmin = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL_ADMIN, config)
  // console.log(response)
  return response.data
}
const getUserAdmin = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL_ADMIN + id, config)
  console.log(response)
  return response.data
}

const updateUserAdmin = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL_ADMIN + id, data, config)
  console.log(response)
  return response.data
}

const deleteUserAdmin = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL_ADMIN + id, config)
  console.log(response)
  return response.data
}

const getEmailListAdmin = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL_EMAILS, config)
  // console.log(response)
  return response.data
}
const getUserForEmailAdmin = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // console.log(data)

  const response = await axios.post(API_URL_USER_EMAIL, data, config)
  // console.log(response)
  return response.data
}

const adminService = {
  getAllUsersAdmin,
  getUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  // EMAILS
  getEmailListAdmin,
  getUserForEmailAdmin,
}

export default adminService
