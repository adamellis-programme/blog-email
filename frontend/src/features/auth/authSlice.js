import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
// { } threw an error as a default
import authService from './authService'

import { extractErrorMessage } from '../../utils'

// USER HAS TO BE IN LS AS WHEN WE REFRESH WE LOOSE ALL OUR STATE
//      the state resets
// user in state comes from the local storage
let user = JSON.parse(localStorage.getItem('user'))
// isError, isSuccess
// if there is a trusted user in ls if not keep null
const initialState = {
  user: user ? user : null,
  isLoading: false,
  message: '',
  showAlert: false,
  isError: false,
}

// register and login have nothing todo with the localStorage
// localStorage gets set in the auth servive ONLY once we get a respomse.data
// user coming direct fro the form NOT the variable
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    console.log(user)
    return await authService.register(user)
  } catch (error) {
    // this is the REJECTED state
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const registerAsAdnin = createAsyncThunk(
  'auth/register/admin/new',
  async (user, thunkAPI) => {
    try {
      console.log(user)
      const token = thunkAPI.getState().auth.user.token
      console.log(token)
      return await authService.registerAsAdnin(token, user)
    } catch (error) {
      // this is the REJECTED state
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    console.log(user)
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// THIS NEEDS UPDATING ...
// export const logout = createAsyncThunk('auth/logout', async () => {

//   await authService.logout()
// })

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      //<-- reset initial state
      state.isLoading = false
      state.message = ''
    },
    updateUSerState: (state, action) => {
      //<-- reset initial state
      state.user = action.payload
    },

    logout: (state) => {
      authService.logout()
      state.user = null
    },

    // setShowAlert: (state, action) => {
    //   state.showAlert = true
    // },
  },
  // we do NOT call reset as we are not using isError / isSuccess / message
  // we will not see any state returned unless we use the reducers first
  // state. pertains to initial state
  // action is us getting the data back
  // state is state NOT pending fullfilled true
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.message = action.payload // <-- delete
        // state.user = null // <-- delete
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action)
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(registerAsAdnin.pending, (state) => {
        state.showAlert = true
        state.isError = false
      })
      .addCase(registerAsAdnin.fulfilled, (state) => {
        state.showAlert = false
        state.isError = false
      })
      .addCase(registerAsAdnin.rejected, (state) => {
        state.showAlert = true
        state.isError = true
      })

    // it first clears out from local storage but does not clear STATE
    // so we update the state with this function call
    // Logout
    // .addCase(logout.fulfilled, (state) => {
    //   state.user = null
    // })
  },
})

// reset is an action
export const { reset, setShowAlert, updateUSerState, logout } = authSlice.actions //<-- regular reducers

export default authSlice.reducer
