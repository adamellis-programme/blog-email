import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'

import adminService from './adminService'

import { extractErrorMessage } from '../../utils'
//  {} look up the object way
const initialState = {
  users: null,
  isLoading: false,
  isError: false,
  userID: '',
  isRejected: false,
  errMSG: null,
  emailData: null,
  deleteUserInfo: {},
  showDeleteUserModal: false,
  showEmailModal: false,
  adminEmailUserID: '',
}

export const getAllUsersAdmin = createAsyncThunk('admin/get/all', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await adminService.getAllUsersAdmin(token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const getUserAdmin = createAsyncThunk('admin/get/one', async (id, thunkAPI) => {
  // console.log(id)
  try {
    const token = thunkAPI.getState().auth.user.token
    return await adminService.getUserAdmin(id, token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const updateUserAdmin = createAsyncThunk(
  'admin/put/one',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.updateUserAdmin(id, data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const deleteUserAdmin = createAsyncThunk(
  'admin/delete/one',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.deleteUserAdmin(id, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

//  *************  EMAILS **************** //

export const getEmailListAdmin = createAsyncThunk(
  'admin/get/allEmails',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getEmailListAdmin(token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const getUserForEmailAdmin = createAsyncThunk(
  'admin/get/user/email',
  async (data, thunkAPI) => {
    // const { id } = data
    // console.log(id)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getUserForEmailAdmin(token, data)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  toggleUpdateModal: false,
  reducers: {
    setToggleUpdateModal: (state, action) => {
      state.toggleUpdateModal = action.payload
    },
    setUserID: (state, action) => {
      state.userID = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    // sperad out to create a copy as object freeze so hade to work with a copy
    setEmailData: (state, action) => {
      state.emailData = [...action.payload]
    },
    setUserData: (state, action) => {
      state.users = [...action.payload]
    },
    setUserToDelete: (state, action) => {
      state.deleteUserInfo = action.payload
    },
    setToggleDeleteUserModal: (state, action) => {
      state.showDeleteUserModal = action.payload
    },
    setShowEmailModal: (state, action) => {
      // console.log(action.payload)
      state.showEmailModal = action.payload.boolean
      state.adminEmailUserID = action.payload.id
    },

    // kept as a refrence to a learning process
    // setEmailDataFiltered: (state, action) => {
    //   const filteredItems = [...action.payload]
    //   console.log(filteredItems)
    //   state.emailData = filteredItems
    // },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllUsersAdmin.fulfilled, (state, action) => {
      state.users = action.payload
    })
    builder.addCase(getAllUsersAdmin.rejected, (state, action) => {
      state.errMSG = action.payload
      state.isRejected = true
    })
    builder.addCase(getEmailListAdmin.rejected, (state, action) => {
      console.log(action.payload)
      state.errMSG = action.payload
      state.isRejected = true
    })
  },
})

export const {
  setToggleUpdateModal,
  setUserID,
  setUsers,
  setEmailData,
  setEmailDataFiltered,
  setUserData,
  setUserToDelete,
  setToggleDeleteUserModal,
  setShowEmailModal,
} = adminSlice.actions
export default adminSlice.reducer
