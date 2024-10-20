import { useSelector, useDispatch } from 'react-redux'
import { setToggleUpdateModal, setUserID } from '../features/admin/adminSlice'
import {
  setUsers,
  updateUserAdmin,
  setUserToDelete,
  setToggleDeleteUserModal,
} from '../features/admin/adminSlice'

function UserItem({
  user: {
    name,
    email,
    createdAt,
    _id,
    isSuspended,
    isAdmin,
    lastLoginDate,
    lastLoginTime,
  },
  index,
}) {
  const { toggleUpdateModal } = useSelector((state) => state.admin)
  const { user } = useSelector((state) => state.auth)
  const { users, showDeleteUserModal } = useSelector((state) => state.admin)

  const dispatch = useDispatch()

  const adminID = user.id

  const handleUpdate = (id) => {
    console.log(id)
    dispatch(setToggleUpdateModal(!toggleUpdateModal))
    dispatch(setUserID(id))
  }

  // prettier-ignore
  // --> this is a more consise way of updating as it keeps the keys the same
  // --> return a new object
  const handleSuspend = (id) => {
      const user = users.find((item) => item._id === id )
      console.log(user)
    const updatedData = {
        ...user,
        isSuspended: !isSuspended,
    }
    console.log(updatedData)
    // update the database
    dispatch(updateUserAdmin({ id, data: updatedData }))

    // update the dom
    dispatch(setUsers(users.map((user) =>user._id === id ? { ...user, isSuspended: !user.isSuspended } : user)))
  }

  const getSuspendButtonClass = (id) => {
    return `user-item-btn ${isSuspended && 'suspended'}  ${id === adminID && 'grey'}`
  }

  const getDeleteButtonClass = (id) => {
    return `user-item-btn ${id === adminID && 'grey'}`
  }

  const handleDisabled = (id) => {
    if (id === adminID) {
      return true
    } else {
      return false
    }

    // use ref and conditionaly set class to grey
  }

  // removes the user from the dom 1st
  // makes request to the back end 2nd

  const handleToggleDeleteModel = (id) => {
    console.log(id)

    const userToDelete = users.find((user) => user._id === id)
    dispatch(setUserToDelete({ id, userToDelete }))
    dispatch(setToggleDeleteUserModal(!showDeleteUserModal))
  }

  // responsivness start removing columns as we go in
  // make a request to the pubplic blog and the UNMOUNT
  return (
    <div className="user-item">
      <div className="user-item-div user-item-admin-div">
        {isAdmin && <i className=" admin-icon-2 fa-solid fa-user-tie"></i>}
      </div>
      <div className="user-item-div">
        <span className="mobile-label-user">item number</span>
        {
          <div className="is-admin-div">
            {/* {isAdmin && <i className=" admin-icon-2 fa-solid fa-user-tie"></i>} */}
          </div>
        }{' '}
        <p> {index + 1}</p>
      </div>
      <div className="user-item-div">
        <span className="mobile-label-user">user suspended</span>
        <p>
          {' '}
          {isSuspended ? (
            <i className=" check-mark fa-solid fa-check"></i>
          ) : (
            <i className=" un-check-mark fa-solid fa-xmark"></i>
          )}
        </p>
      </div>
      <div className="user-item-div">
        <span className="mobile-label-user">signup date</span>
        <p> {new Date(createdAt).toLocaleString('en-gb')}</p>
      </div>
      <div className="last-login-div user-item-div">
        <span className="mobile-label-user">Last login date and time</span>
        <p className="user-item-p">
          <span> {lastLoginDate}</span>
        </p>
        <p className="user-item-p">{lastLoginTime}</p>
      </div>
      <div className="user-item-div">
        <span className="mobile-label-user">user name </span>
        <p>{name}</p>
      </div>
      <div className="user-item-div">
        <span className="mobile-label-user">user email </span>
        <p>{email}</p>
        {/* <p> {new Date(createdAt).toLocaleString('en-gb')}</p> */}
      </div>
      <div className="user-admin-btn-container">
        <button onClick={() => handleUpdate(_id)} className="user-item-btn">
          update
        </button>
        <button
          disabled={handleDisabled(_id)}
          onClick={() => handleSuspend(_id)}
          className={getSuspendButtonClass(_id)}
        >
          suspend
        </button>
        <button
          onClick={() => handleToggleDeleteModel(_id)}
          disabled={handleDisabled(_id)}
          className={getDeleteButtonClass(_id)}
        >
          delete
        </button>
      </div>
    </div>
  )
}

export default UserItem
