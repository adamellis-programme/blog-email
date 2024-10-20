import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utils'
import taskService from './taskService'

const initialState = {
  tasks: null,
  tasksForFilter: null,
  task: {},
  showUpdateModal: false,
  showDeleteModal: false,
  taskID: '',
  taskItem: null,
  isEditMode: false,
}

export const createTask = createAsyncThunk('task/create', async (taskData, thunkAPI) => {
  try {
    // console.log(taskData)
    const token = thunkAPI.getState().auth.user.token
    // console.log(token)
    return await taskService.createTask(taskData, token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// not sending any data so use _,
export const getTasks = createAsyncThunk('tasks', async (_, thunkAPI) => {
  // console.log('123')
  try {
    const token = thunkAPI.getState().auth.user.token
    // console.log('TOKEN =>', token)
    return await taskService.getTasks(token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const deleteTask = createAsyncThunk('delete/task', async (id, thunkAPI) => {
  // console.log('123')
  try {
    const token = thunkAPI.getState().auth.user.token
    // console.log('TOKEN =>', token)
    return await taskService.deleteTask(id, token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const updateTask = createAsyncThunk('update/task', async (taskData, thunkAPI) => {
  // console.log(taskData)
  const { id, data } = taskData
  // console.log(data)
  try {
    const token = thunkAPI.getState().auth.user.token
    // console.log('TOKEN =>', token)
    return await taskService.updateTask(id, token, data)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    toggleDeleteModal: (state, action) => {
      state.showDeleteModal = action.payload
    },

    setTaskID: (state, action) => {
      state.taskID = action.payload
    },

    // spread for the search functionality
    setTasks: (state, action) => {
      state.tasks = [...action.payload]
    },

    setTaskItem: (state, action) => {
      state.taskItem = action.payload
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload
    },

    // setTasks: (state, action) => {
    //   const filteredItems = action.payload.slice()
    //   state.tasks = filteredItems
    // },

    // // change this name
    // setTasksForFilter: (state, action) => {
    //   state.tasksForFilter = action.payload
    // },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })

    // .addCase(updateTask.fulfilled, (state, action) => {
    //   console.log(action)
    //   state.tasks = state.tasks.map((task) =>
    //     task._id === action.payload._id ? action.payload : task
    //   )
    // })
  },
})

export const {
  toggleDeleteModal,
  setTaskID,
  setTasks,
  setTaskItem,
  setIsEditMode,
  setFilter,
  setTasksForFilter,
} = taskSlice.actions
export default taskSlice.reducer
