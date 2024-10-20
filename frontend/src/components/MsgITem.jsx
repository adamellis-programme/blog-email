import { useState, useRef, forwardRef } from 'react'
import { setMessageID } from '../features/messages/msgSlice'
import { useDispatch, useSelector } from 'react-redux'
function MsgItem({
  msg: { fullName, about, email, msg, mailingList, date, time, phone, _id },
  i,
  deleteDiv,
  user,
}) {
  const dispatch = useDispatch()
  // const { user } = useSelector((state) => state.auth)
  // console.log(user)
  const [hoverIndex, setHoverIndex] = useState(null)
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null) // State to track the active delete modal

  const item = useRef(null)
  const nav = useRef(null)

  // Convert the msg string into an array of words
  const wordsArray = msg.split(' ')
  // Slice the array to get the first 5 words
  const truncatedMsg = wordsArray.slice(0, 5).join(' ') + '...'

  const handleDelete = (id) => {
    console.log(id)
    // Logic to handle delete action
  }
  // detect resize and close modal

  // what is the difference between getBoundingClientRect().top and offsetTop
  const handleDeleteClick = (id) => {
    // item is msg-item
    dispatch(setMessageID(id))
    const deleteContainer = deleteDiv.current
    deleteContainer.classList.add('show-delete-div')

    console.log(deleteDiv.current)
    console.log(id)
    if (item.current) {
      const topPosition = item.current.offsetTop
      console.log(item)

      // lookup getBounding as calculations to minus the nav bar etc
      // lookup getBounding as calculations to minus the nav bar etc
      // lookup getBounding as calculations to minus the nav bar etc

      const left = item.current.getBoundingClientRect().left
      const right = item.current.getBoundingClientRect().right
      // console.log(left, right)

      const center = left + right / 2
      // console.log(center)

      const deleteDivItem = deleteDiv.current
      console.log(deleteDivItem)
      const top = topPosition - 16
      // console.log(top)
      deleteDivItem.style.top = `${top}px`
      deleteDivItem.style.left = `${center}px`

      // passed down and TAB INDEX -1
      deleteDivItem.focus()
      //  GET THE CENTER BY DIVIDING THE TWO
      // DISPATCH THE _ID TO GLOBAL STATE AND PICK UP IN ANOTHER
    } else {
      console.error('item.current is null')
    }
  }

  return (
    <>
      <article ref={item} className="msg-item">
        <div className="msg-div">
          {' '}
          <span className="msg-span">item number</span> <span>{i + 1}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message date</span> <span>{date}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message about</span> <span>{about}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message from</span>
          <span>{fullName}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">email address</span>
          <span>{email}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">on mailing list</span>{' '}
          <span>{mailingList ? 'yes ' : 'no'}</span>
        </div>
        <div
          className="msg-div"
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <span className="msg-span">message content</span>
          <span>
            {' '}
            <p>{truncatedMsg}</p>
          </span>
        </div>
        {hoverIndex === i && (
          <span className="content-div">
            <div className="content-inner-div">
              <div>from: {fullName}</div>
              <div>time: {time}</div>
              <div>phone: {phone}</div>
            </div>
            {msg}
          </span>
        )}
        {user && user.isSuperAdmin === true && (
          <div className="delete-msg-div">
            <button
              // CAN SEND ID AND INDEX IN AN OBJECT AND DESTRUCTURE
              onClick={() => handleDeleteClick(_id)} // Handle delete button click
              className="msg-delete-btn"
            >
              x
            </button>
          </div>
        )}
      </article>
    </>
  )
}

export default MsgItem
