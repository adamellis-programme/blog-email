import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
  setToggleUpdateModal,
  getUserAdmin,
  setUsers,
  updateUserAdmin,
} from '../../features/admin/adminSlice'
function UpdateUserModal() {
  const [user, setUser] = useState({})
  const dispatch = useDispatch()
  const { toggleUpdateModal, userID, users } = useSelector((state) => state.admin)
  const { user: loggedInUser } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    isSuspended: false,
    isSuperAdmin: false,
  })
  // if super admin is a special route on the backend
  //  sign in as super admin
  const { name, email, isSuspended, isAdmin, isSuperAdmin } = formData
  const loggedInUserID = loggedInUser.id

  useEffect(() => {
    dispatch(getUserAdmin(userID))
      .unwrap()
      .then((data) => {
        setUser(data)
        setFormData((prevState) => ({
          ...prevState,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          isSuspended: data.isSuspended,
        }))
      })
  }, [userID])

  // new use effect fot the setFormData

  const onMutate = (e) => {
    const { name, type, checked, id, placeholder } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const handleClose = () => {
    dispatch(setToggleUpdateModal(!toggleUpdateModal))
  }

  // look at all the update files and how they are all done different

  const onSubmit = (e) => {
    e.preventDefault()
    const dataUpdate = {
      ...user,
      name,
      email,
      isAdmin,
      isSuspended,
    }
    dispatch(setToggleUpdateModal(!toggleUpdateModal))
    dispatch(updateUserAdmin({ id: userID, data: dataUpdate }))

    // dispatch to the db
    // dispatch to the dom -> map

    const updatedData = users.map((user) => (user._id === userID ? dataUpdate : user))
    dispatch(setUsers(updatedData))
    console.log(updatedData)
  }

  // determines the logged in user and locks btns
  const isDisabled = () => {
    if (user._id === loggedInUserID) {
      return true
    } else {
      return false
    }
  }
  return (
    <div className="modal-container">
      <div className="modal">
        <h3 className="admin-h3 admin-user-h3">
          <span>update user admin controls</span>
        </h3>

        <button onClick={handleClose} className="close-modal-btn">
          cancel
        </button>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="admin-controls-div">
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="isSuspended"
                  id="isSuspended"
                  value={false}
                  checked={isSuspended}
                  disabled={isDisabled()}
                />
                suspended
              </label>
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  value={false}
                  checked={isAdmin}
                />
                admin
              </label>
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="name">
                User Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="modal-input"
                placeholder="Enter Name"
                value={name}
                onChange={onMutate}
              />
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="userEmail">
                User Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className="modal-input"
                placeholder="Enter Email"
                value={email}
                onChange={onMutate}
              />
            </div>

            <div className="modal-form-control update-modal-btn-container">
              <button className="update-modal-btn">update as adnin</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserModal
