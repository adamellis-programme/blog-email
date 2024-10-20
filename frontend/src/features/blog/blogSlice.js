import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utils'
import blogService from './blogService'
import { act } from 'react'

const initialState = {
  blogs: [],
  blog: {},
  publicBlogs: null,
  publicBlog: null,
  loading: false,
  message: '',
  showUpdateModal: false,
  showUpdateModalAdmin: false,
  showDeleteModal: false,
  deleteCode: '',
  adminBlogs: null,
  adminBlog: {},
  blogID: '',
  createNewUserModal: false,

  isError: null,
  errMSG: null,
}

export const createBlog = createAsyncThunk('blog/create', async (blogData, thunkAPI) => {
  try {
    // console.log(blogData)
    const token = thunkAPI.getState().auth.user.token
    return await blogService.createBlog(blogData, token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const getUserBlogs = createAsyncThunk('blog/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await blogService.getUserBlogs(token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const getPublicBlogs = createAsyncThunk('blogs/public', async (_, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().auth.user.token
    return await blogService.getPublicBlogs()
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const getPublicBlog = createAsyncThunk('blog/public', async (id, thunkAPI) => {
  // console.log(id)
  try {
    // const token = thunkAPI.getState().auth.user.token
    return await blogService.getPublicBlog(id)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const updatePublicBlog = createAsyncThunk(
  'blog/public',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    // console.log(data)
    try {
      // const token = thunkAPI.getState().auth.user.token
      return await blogService.updatePublicBlog(id, data)
    } catch (error) {
      // console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getUserBlog = createAsyncThunk('blog/userBlog', async (blogID, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await blogService.getUserBlog(blogID, token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const updateUserBlog = createAsyncThunk(
  'blog/update',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    // console.log(data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.updateUserBlog(id, token, data)
    } catch (error) {
      // console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const deleteBlogPost = createAsyncThunk('delete/blog', async (id, thunkAPI) => {
  // console.log(id)

  try {
    const tokenForDbAccess = thunkAPI.getState().auth.user.token
    return await blogService.deleteBlogPost(id, tokenForDbAccess) // Passing formData to the service
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// ===== ADMIN ======= //
// change naming
export const getAdminBlogs = createAsyncThunk('get/admin/blogs', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await blogService.getAdminBlogs(token)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const getBlogAdmin = createAsyncThunk('get/blog/admin', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await blogService.getBlogAdmin(token, id)
  } catch (error) {
    // console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const updateBlogAdmin = createAsyncThunk(
  'update/blog/admin',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.updateBlogAdmin(id, token, data)
    } catch (error) {
      // console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const deleteBlogPostAdmin = createAsyncThunk(
  'delete/blog/admin',
  async (id, thunkAPI) => {
    // console.log(id)

    try {
      const tokenForDbAccess = thunkAPI.getState().auth.user.token
      return await blogService.deleteBlogPostAdmin(id, tokenForDbAccess) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const createBlogAsAdmin = createAsyncThunk(
  'create/blog/as-admin',
  async (blogData, thunkAPI) => {
    console.log(blogData)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.createBlogAsAdmin(blogData, token) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

// UPDATE IMG ARRAY
export const deleteBlogImg = createAsyncThunk(
  'delete/img/blog',
  async (data, thunkAPI) => {
    console.log('image-data', data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.deleteBlogImg(token, data) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const updatBlogImg = createAsyncThunk(
  'update/img/blog',
  async (data, thunkAPI) => {
    console.log('image-data', data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.updateBlogImg(token, data) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const addBulkImages = createAsyncThunk(
  'add/img/blog/bulk',
  async (data, thunkAPI) => {
    console.log('image-data', data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.addBulkImages(token, data) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const deleteAllImages = createAsyncThunk(
  'delete/bulk/imgs',
  async (data, thunkAPI) => {
    console.log('image-data', data)
    try {
      const token = thunkAPI.getState().auth.user.token
      return await blogService.deleteAllImages(token, data) // Passing formData to the service
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // reset: (state) => initialState,
    resetAdminBlog: (state, action) => {
      state.adminBlog = {}
    },
    toggleUpdateModal: (state, action) => {
      state.showUpdateModal = action.payload
    },

    toggleDeleteModal: (state, action) => {
      state.showDeleteModal = action.payload
    },

    setDeleteCode: (state, action) => {
      state.deleteCode = action.payload
    },

    setBlogID: (state, action) => {
      state.blogID = action.payload
    },
    setAdminBlogs: (state, action) => {
      state.adminBlogs = [...action.payload]
    },
    setNewUserModal: (state, action) => {
      state.createNewUserModal = action.payload
    },
    resetErr: (state) => {
      state.isError = null
      state.errMSG = null
    },
    resetBlog: (state) => {
      state.blog = {}
      state.publicBlog = null
    },
    // used in delete user model
    setBLogs: (state, action) => {
      state.blogs = action.payload
    },
    // used for when a img is deleted / updated
    setBLog: (state, action) => {
      state.blog = action.payload
    },
  },

  // for async data
  extraReducers: (builder) => {
    builder
      .addCase(getUserBlogs.pending, (state) => {
        state.blogs = null
      })
      .addCase(getUserBlogs.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.blogs = action.payload
      })
      .addCase(getPublicBlogs.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.publicBlogs = action.payload
      })
      .addCase(getPublicBlog.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.publicBlog = action.payload
      })
      .addCase(getPublicBlog.rejected, (state, action) => {
        // console.log(action.payload)
        state.isError = true
        state.errMSG = action.payload
      })

      // .addCase(getUserBlogs.rejected, (state, action) => {
      //   state.message = action.payload
      // })

      .addCase(getUserBlog.fulfilled, (state, action) => {
        state.blog = action.payload
      })

      .addCase(getUserBlog.rejected, (state, action) => {
        state.isError = true
        state.errMSG = action.payload
      })

      // we get back the data and then updatae the state gloabaly
      .addCase(updateUserBlog.fulfilled, (state, action) => {
        state.blog = action.payload
        state.publicBlog = action.payload // seperate piect of state
        // map for the list
      })

      //  unwrap
      // admin
      .addCase(getAdminBlogs.fulfilled, (state, action) => {
        state.adminBlogs = action.payload
      })
      .addCase(getAdminBlogs.rejected, (state, action) => {
        state.isError = true
        state.errMSG = action.payload
      })
      .addCase(getBlogAdmin.fulfilled, (state, action) => {
        state.adminBlog = action.payload
      })
      .addCase(getBlogAdmin.rejected, (state, action) => {
        state.isError = true
        state.errMSG = action.payload
      })

    // .addCase(createBlogAsAdmin.rejected, (state, action) => {
    //   state.isError = true
    //   state.errMSG = action.payload
    // })
  },
})

export const {
  toggleUpdateModal,
  toggleDeleteModal,
  setDeleteCode,
  setBlogID,
  setBlogDeleteID,
  resetAdminBlog,
  setAdminBlogs,
  setNewUserModal,
  resetErr,
  resetBlog,
  setBLogs,
  setBLog,
} = blogSlice.actions
export default blogSlice.reducer
