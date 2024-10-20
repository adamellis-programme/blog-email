import axios from 'axios'

const API_URL = '/api/tasks/'

const createTask = async (taskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  //  making the request
  const response = await axios.post(API_URL, taskData, config)

  // console.log(response.data)
  return response.data
}

const getTasks = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  //  making the request
  const response = await axios.get(API_URL, config)

  // console.log(response.data)
  return response.data
}

const deleteTask = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  //  making the request
  const response = await axios.delete(API_URL + id, config)

  // console.log(response.data)
  return response.data
}

const updateTask = async (id, token, data) => {
  // console.log(data)
  // console.log({
  //   id,
  //   token,
  //   data,
  // })
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  // console.log(token)
  // console.log(API_URL + id)
  //  making the request
  const response = await axios.put(API_URL + id, data, config)

  // console.log(response.data)
  return response.data
}

const taskService = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
}

export default taskService
