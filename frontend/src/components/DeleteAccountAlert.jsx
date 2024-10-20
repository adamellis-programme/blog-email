import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { deleteUser } from '../features/users/userSlice'
import { setBLogs } from '../features/blog/blogSlice'
import { useSelector } from 'react-redux'
import { setShowDeleteAccAlert, setMsg } from '../features/users/userSlice'

function DeleteAccountAlert({ setDeleteAlert, deleteID }) {
  // record sheet log after every entry
  const { showDeleteAccAlert } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleDelete = () => {
    console.log(deleteID)

    dispatch(deleteUser(deleteID))
      .unwrap()
      .then((data) => {
        console.log(data.blogs)
        dispatch(setBLogs(data.blogs))
        navigate('/')
        dispatch(logout())
        setDeleteAlert(false)
      })
      .catch((err) => {
        console.log(err)
        dispatch(setMsg(err))
        dispatch(setShowDeleteAccAlert(true))
        setTimeout(() => {
          dispatch(setShowDeleteAccAlert(false))
          dispatch(setMsg(''))
        }, 3500)
      })
  }
  // nav to acc deleted
  // survey page
  // look up a messaging portal

  return (
    <div className="account-delete-alert">
      <i className="warning-delete-icon fa-solid fa-user-ninja"></i>
      <p className="account-delete-p">
        you are about to delete your account, tasks, blogs and all data associated with
        this account. are you sure you want to continue? this cannot be undone!
      </p>
      {/* <p>are you sure you want to continue?</p> */}
      {/* <p>this cannot be undone!</p> */}
      <div className="delte-acc-btn-wrap">
        <button onClick={handleDelete} className="acc-delete-btn">
          delete
        </button>

        <button onClick={() => setDeleteAlert(false)} className="acc-delete-btn">
          back
        </button>
      </div>
    </div>
  )
}

export default DeleteAccountAlert
