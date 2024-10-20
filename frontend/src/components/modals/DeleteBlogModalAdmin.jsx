import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  toggleDeleteModal,
  deleteBlogPostAdmin,
  setAdminBlogs,
  deleteAllImages,
} from '../../features/blog/blogSlice'
// setBlogDeleteID
// blogDeleteID
// pass in isDeleting
function DeleteBlogModalAdmin({ loading, setLoading, setIsDeleting }) {
  const deleteModal = useRef(null)
  useEffect(() => {
    const delElement = deleteModal.current
    delElement.focus()
    return () => {}
  }, [deleteModal])

  const [isDisabled, setisDisabled] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { blogID } = useParams()

  const { showDeleteModal, deleteCode, blogID, adminBlogs } = useSelector(
    (state) => state.blogs
  )
  // console.log(adminBlogs)
  const { user } = useSelector((state) => state.auth)
  // console.log(user)
  const handleClose = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }
  // todo: delete code and delete all images
  const handleDeleteCode = (e) => {
    console.log(e.target.value)
    if (e.target.value.trim() === deleteCode) {
      setisDisabled(false)
    } else {
      setisDisabled(true)
    }
    console.log(isDisabled)
  }

  const filteredData = adminBlogs.filter((item) => item._id !== blogID)

  //
  // await and show the loader same as .then()
  const handleDelete = async () => {
    try {
      setLoading(true) // Start the loading
      setIsDeleting(true)
      //
      dispatch(deleteBlogPostAdmin(blogID))
      dispatch(toggleDeleteModal(!showDeleteModal))
      // await and show spinner / loader
      const res = await dispatch(deleteAllImages({ blogID, deleteBlog: true }))
      console.log(res)
      dispatch(setAdminBlogs(filteredData))
      // send boolean isDeleteBlog to true

      // setIsDeleting(false)
      // setLoading(false) // Stop the loading after 5 seconds
      console.log('Loading finished')
    } catch (error) {
      setIsDeleting(false)
      setLoading(false)
      console.error('Error occurred during deletion:', error)
    } finally {
      setIsDeleting(false) // Reset the deleting state
      setLoading(false) // Reset the deleting state
    }
  }

  return (
    <div ref={deleteModal} tabIndex={-1} className="delete-modal">
      <div className="delete-modal-inner-div">
        <div className="delete-modal-body">
          <i className="fa-regular stop-sign fa-hand"></i>
          <p>stop</p>
          <p> you are about to delete this blog</p>
          <p>are you sure you wish to continue?</p>
        </div>

        <p className="delete-code-p">
          please copy and paste <span>{deleteCode}</span> to cofirm delete
        </p>

        <div className="delete-modal-input-container">
          <input
            className="delete-modal-input"
            type="text"
            placeholder="enter delete code"
            onChange={handleDeleteCode}
            // disabled={true}
          />
        </div>

        <div className="delete-modal-btn-container">
          <button
            onClick={handleDelete}
            className={`delete-modal-btn ${isDisabled && 'delte-btn-disabled '}`}
            disabled={isDisabled}
          >
            delete
          </button>
          <button
            onClick={handleClose}
            className=" delete-modal-btn close-delete-modal-btn"
          >
            close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteBlogModalAdmin
