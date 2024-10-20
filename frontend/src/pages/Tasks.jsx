import TaskItem from '../components/TaskItem'
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  createTask,
  getTasks,
  updateTask,
  setIsEditMode,
  setTasks,
  setFilter,
} from '../features/tasks/taskSlice'
import { getDate, clearUpdateVisual } from '../utils'
import { toast } from 'react-toastify'
import DeleteTaskModal from '../components/modals/DeleteTaskModal'
import BackButton from '../components/BackButton'
import PageLoader from '../components/loaders/PageLoader'
import MobileBackBTN from '../components/MobileBackBTN'
import NoDataPlaceHolder from '../components/place holder components/NoDataPlaceHolder'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'

function Tasks() {
  const [taskFocus, setTaskFocus] = useState(null)
  const [loading, setLoading] = useState(true)

  // console.log(taskFocus)

  // prettier-ignore
  useEffect(() => {
    // ****************  DELETE THIS CODE ************************* //
    if (taskFocus) {
      const focusListItem = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const lisItem = document.querySelector(`.task-list-item[data-id="${taskFocus.item._id}"]`);
        // console.log('lisItem:', lisItem); // Check if element is found
        if (lisItem) {
          lisItem.focus();
          // console.log('Focused:', lisItem); // Check if focus is successful
        }
      };
      
      focusListItem();
    }
  }, [taskFocus]);

  const { tasks, showDeleteModal, taskItem, isEditMode } = useSelector(
    (state) => state.tasks
  )

  const { user } = useSelector((state) => state.auth)

  // console.log(taskItem && taskItem.taskText)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    taskText: '',
    important: false,
  })

  useEffect(() => {
    return () => {
      dispatch(setIsEditMode(false))
    }
  }, [])

  //  this gets the data on page load
  useEffect(() => {
    dispatch(getTasks()).then((data) => {
      dispatch(setTasks(data.payload))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (isEditMode && taskItem !== null) {
      // console.log(taskItem)
      setFormData((prevState) => ({
        ...prevState,
        taskText: taskItem.taskText,
        important: taskItem.important,
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        taskText: '',
        important: false,
      }))
    }
  }, [isEditMode, taskItem])

  const onChange = (e) => {
    const { name, type, checked, id, placeholder } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const { taskText, important } = formData

  const handleSubmit = (e) => {
    e.preventDefault()
    // isEdit flag
    if (!isEditMode) {
      // task text will be the global state set to '' .taskText dotTaskText
      const taskDta = {
        taskText,
        important,
        date: getDate().date,
        time: getDate().time,
      }

      // console.log(taskDta)
      dispatch(createTask(taskDta))
        .unwrap()
        .then((data) => {
          // console.log(data)
          toast.success('task addded success')
        })
        .catch(toast.error)
    } else {
      // update the db
      const updatedTaskData = {
        taskText,
        important,
        // updatedDate: getDate(),
      }

      // update the database
      dispatch(updateTask({ id: taskItem._id, data: updatedTaskData }))

      // console.log(updatedTaskData)
      // console.log(taskItem)
      dispatch(setIsEditMode(false))
      clearUpdateVisual()

      // update the dom
      const newDomData = {
        ...taskItem,
        taskText,
        important,
      }

      // update the dom straight away
      const data = tasks.map((item) => {
        return item._id === taskItem._id ? newDomData : item
      })
      dispatch(setTasks(data))
    }

    setFormData((prevState) => ({
      ...prevState,
      taskText: '',
      important: false,
    }))
    // console.log(taskItem)
  }

  const handleExitEditMode = () => {
    dispatch(setIsEditMode(false))
    clearUpdateVisual()
  }

  // no need to set the form data as we are not doing anything with it
  const handleSearch = async (e) => {
    const inputText = e.target.value.toLowerCase()
    // const data = await dispatch(getTasks())
    const newArr = []
    // THE ISSUE WAS AS WE WERE FILTERING WE WERE looping around and setting the ORIGINAL DATA
    // SO WE WERE ESSENTUALLY DELETEING ALL THE ITEMS WE WERE FILTERING OUT

    // have another pisece of state that holds all the tasks so we
    // are not filtering down the whole list to nothing
    // solve the problem of getting the fresh data we must filter client side
    // filtering down and not pulling fresh data

    // *****************************************
    // bring in fresh data and use the spread operaator in slice [...action.payload]
    // due to object freeze placed and it becomes inmutible data

    const freshData = await dispatch(getTasks()).unwrap()
    freshData.forEach((item) => {
      const loopedItem = item.taskText.toLowerCase()
      if (loopedItem.indexOf(inputText) !== -1) {
        newArr.push(item)
      }

      dispatch(setTasks(newArr))
    })
  }

  if (loading) {
    return <GlobalPageLoader />
  }

  const taskLength = 39

  return (
    <>
      <div className="page-container tasks-container">
        <div className="back-btn-wrap">
          <BackButton />
        </div>
        <div className="back-btn-wrap-mobile">
          <MobileBackBTN />
        </div>
        <section className="tasks-head-section">
          {showDeleteModal && <DeleteTaskModal />}
          <p>your tasks list</p>
          <p>keep track of all your tasks here in one place</p>
          <p className="logged-in-as tasks-logged-in-as">
            <span>logged in as {user.name}</span>
          </p>
        </section>

        <section className="task-input-section">
          <form onSubmit={handleSubmit} className="task-form">
            {/* <span>{taskText.length}</span> */}
            <div className="task-form-group">
              <input
                onChange={onChange}
                type="text"
                className="task-input"
                placeholder="enter task"
                name="taskText"
                value={taskText.slice(0, taskLength)}
              />
            </div>
            <div className="task-length-div">
              <div>
                <span> max chars:</span> <span>40</span>
              </div>
              <div>
                <span> chars used:</span> <span>{taskText.length}</span>{' '}
              </div>
              <div>
                <span>chars left: </span>
                <span>{taskLength + 1 - taskText.length}</span>{' '}
              </div>
            </div>

            <label className="check-form-control task-form-control">
              <input
                onChange={onChange}
                type="checkbox"
                name="important"
                value={false}
                checked={important}
              />
              important
            </label>

            <button className="task-submit-btn">
              {isEditMode ? 'update' : 'submit'}
            </button>
          </form>
          <div className="task-search-container">
            <input
              onChange={handleSearch}
              className="task-search-input"
              type="text"
              placeholder="search tasks"
            />
          </div>
          {isEditMode && (
            <button onClick={handleExitEditMode} className="cancel-update">
              exit edit mode
            </button>
          )}
        </section>

        <section className="tasks-list-section">
          <div className="task-list-header">
            <div>date of task</div>
            <div>task text</div>
            <div>status</div>
            <div>controls</div>
          </div>
          {tasks && tasks.length < 1 && <NoDataPlaceHolder data={{ page: 'tasks' }} />}
          {/* {tasks && console.log(tasks)} */}

          <ul>
            {tasks &&
              tasks.length > 0 &&
              tasks.map((task, i) => (
                <TaskItem key={task._id} task={task} i={i} user={user} />
              ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export default Tasks
