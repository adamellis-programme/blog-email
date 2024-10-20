import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { toggleDeleteModal, deleteTask, setTasks } from '../../features/tasks/taskSlice'

function DeleteTaskModal() {
  const deleteRef = useRef()
  /**
   * WE DO NOT PASS ANYTHING DOWN HERE AS WE CANNOT
   * PASS BACK UP ?????????
   *
   * without use effect
   * and the dependency
   * it will not work
   * ----------------
   * can acheive the same thing
   * by passing deleteRef in from
   *
   * as the component opens
   * ONLY THEN FOCUS
   * --- In message page we have a deleteDiv element that is hidden by default
   * --- we then pass the deleteDiv={deleteDiv} as a prop DOWN
   * --- into the message item where we handle the
   * -- ON CLICK EVENT AND LOGIC TO SHOW THE ELEMENT
   * -- which is up in the PARENT
   */
  useEffect(() => {
    console.log(deleteRef.current)
    deleteRef.current.focus()
    return () => {}
  }, [deleteRef])
  
  const [isDisabled, setIsDisabled] = useState(false)
  const dispatch = useDispatch()
  const { showDeleteModal, taskID, tasks } = useSelector((state) => state.tasks)
  const updatedData = tasks.filter((item) => item._id !== taskID)
  // console.log(tasks)
  // console.log(updatedData)
  // console.log(taskID)
  const handleClose = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  const deleteCode = 'xxx'

  const handleDelete = () => {
    dispatch(deleteTask(taskID))
    dispatch(setTasks(updatedData))
    handleClose()
  }
  return (
    <div tabIndex={-1} ref={deleteRef} className="delete-modal">
      <div className="delete-modal-inner-div">
        <div className="delete-modal-body">
          <i className="fa-regular stop-sign fa-hand"></i>
          <p>stop</p>
          <p> you are about to delete this task</p>
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
            // onChange={handleDeleteCode}
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

export default DeleteTaskModal
