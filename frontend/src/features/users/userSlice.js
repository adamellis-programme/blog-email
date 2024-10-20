import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utils'
import userService from './userService'

const initialState = {
  users: null,
  isError: null,
  errMSG: null,
  msg: '',
  showDeleteAccAlert: false,
  user: null,
}

export const updateUserDate = createAsyncThunk(
  'user/update/date',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    console.log(id, data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updateUserDate(id, data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

// ONLY REQUIRES THE TOKEN AND NOT THE ID AS WE GET THE
// LOGGED IN USER BY SENDING THE TOKEN WHICH HAS THE ID IN IT
// TO THE BACKEND OF /api/users/logged-in-user/
// WHICH THEN PASSES THROUGH THE MIDDLEWARE TO GET THE USER AND RETURN THE DATA
export const getCurrentUSer = createAsyncThunk(
  'user/get-current-user',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getCurrentUSer(token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const getMe = createAsyncThunk('user/get-me', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await userService.getMe(token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const updatePassword = createAsyncThunk(
  'user/update-pw',
  async (data, thunkAPI) => {
    console.log(data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updatePassword(data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const updateEmail = createAsyncThunk(
  'user/update-email',
  async (data, thunkAPI) => {
    console.log(data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updateEmail(data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const updateName = createAsyncThunk('user/update-name', async (data, thunkAPI) => {
  console.log(data)
  try {
    const token = thunkAPI.getState().auth.user.token
    return await userService.updateName(data, token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// self delete
export const deleteUser = createAsyncThunk('user/delete-own', async (id, thunkAPI) => {
  console.log(id)
  try {
    const token = thunkAPI.getState().auth.user.token
    return await userService.deleteUser(id, token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const emailSignUp = createAsyncThunk('user/email/new', async (data, thunkAPI) => {
  // const { id, data } = idAndData
  console.log(data)
  try {
    // const token = thunkAPI.getState().auth.user.token
    return await userService.emailSignUp(data)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const updateUserProfileImage = createAsyncThunk(
  'user/email/new',
  async (data, thunkAPI) => {
    // const { id, data } = idAndData
    console.log(data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updateUserProfileImage(data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // reset: (state) => initialState,
    resetAdminBlog: (state, action) => {},
    setShowDeleteAccAlert: (state, action) => {
      state.showDeleteAccAlert = action.payload
    },
    setMsg: (state, action) => {
      state.msg = action.payload
    },
    setLoggedInUser: (state, action) => {
      // console.log(action.payload)
      state.user = action.payload
    },
  },

  // for async data
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUSer.rejected, (state, action) => {
        state.isError = true
        state.errMSG = action.payload
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isError = false
        state.user = action.payload
      })
  },
})

export const { setShowDeleteAccAlert, setMsg, setLoggedInUser } = userSlice.actions
export default userSlice.reducer
