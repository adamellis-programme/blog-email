import React, { useState, useEffect, useRef } from 'react'
import BackButton from '../components/BackButton'
import { getCurrentUSer } from '../features/users/userSlice'
import { getAllUsersAdmin } from '../features/admin/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createBlogAsAdmin, updateBlogAdmin } from '../features/blog/blogSlice'
import Loading from '../components/loaders/Loading'
import NotAuthorized from '../components/NotAuthorized'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function CreateBlogAdmin() {
  const navigate = useNavigate()

  // this locks the screen if user is not admin or suspended
  // or some other kind of err
  const { isRejected, errMSG } = useSelector((state) => state.admin)
  const [submited, setSubmited] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userSelectData, setUserSelectData] = useState({
    userDropDownID: '',
    userDropDownName: '',
  })

  // get current user
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    author: '',
    blogTitle: '',
    country: '',
    blogBody: '',
    featured: false,
    publish: false,
    status: '',
    createdByAdmin: true,
  })

  const { blogTitle, country, blogBody, featured, publish, createdByAdmin, author } =
    formData
  // const { isError, errMSG } = useSelector((state) => state.user)

  const { userDropDownID, userDropDownName } = userSelectData
  const userDropDown = useRef(null)

  const imagesInputRef = useRef(null)
  const heroImageInputRef = useRef(null)

  const [images, setImages] = useState([])
  const [heroImage, setHeroImage] = useState(null)

  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.admin)
  // console.log(users)
  useEffect(() => {
    dispatch(getAllUsersAdmin())
    return () => {}
  }, [])
  //prettier-ignore
  const handleUserSelect = (e) => {
    const userElement = userDropDown.current
    const selectedOption = userElement.selectedOptions[0]
    // console.log( userElement.selectedOptions[0].dataset.id)
    console.log(selectedOption.dataset.id)
    // if (selectedOption.dataset.id === 'please-select') return
    setUserSelectData((prevState) => ({
      ...prevState,
      userDropDownID: selectedOption.id,
      // if the data id of the actual select element === 'please select' then set the value of the author to '' else set it to selection.value
      // we controll the select box which controlls the author box
      userDropDownName: selectedOption.dataset.id === 'please-select' ? '' : selectedOption.value,
    }))
  }

  const onChange = (e) => {
    const { type, id, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))

    // e.target.value mataches the value={} in the select option ?
  }

  const url = 'https://api.cloudinary.com/v1_1/travel-adam/image/upload'

  const triggerImagesSelect = () => {
    if (imagesInputRef.current) {
      imagesInputRef.current.click()
    }
  }

  const triggerHeroImageSelect = () => {
    if (heroImageInputRef.current) {
      heroImageInputRef.current.click()
    }
  }

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setImages(selectedFiles)
  }

  const handleHeroImageChange = (e) => {
    const selectedFile = e.target.files[0]
    console.log(selectedFile)
    setHeroImage(selectedFile)
  }

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    const formData = new FormData()

    // Append text data
    formData.append('author', userDropDownName)
    formData.append('blogTitle', blogTitle)
    formData.append('country', country)
    formData.append('blogBody', blogBody)
    formData.append('featured', featured)
    formData.append('publish', publish)
    formData.append('userID', userDropDownID)

    // Append hero image
    if (heroImage) {
      formData.append('heroImage', heroImage)
    }

    // Append other images
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image) // 'images' field name will collect all image files
      })
    }

    try {
      const res = await dispatch(createBlogAsAdmin(formData)).unwrap()
      console.log('res----->', res)
      toast.success('Success! Blog created')
      handleClearForm()
      navigate(`/user-blog/${res._id}`)
    } catch (error) {
      toast.error('Failed to create blog')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    setFormData({
      author: '',
      blogTitle: '',
      country: '',
      blogBody: '',
      featured: false,
      publish: false,
    })

    // if (submited === true) return

    // Cannot set properties of null (setting 'value') was the error === if !null if (el-existts)
    //  due to react rendering process
    // on a small amount of loading time it is ok
    // as the dom may not have caught up yet

    // COMPONENT LIFE CYCLE
    // Component Lifecycle: React components go through a lifecycle of creation, mounting, updating, and unmounting.
    // DOM and then updates the actual DOM to reflect the virtual DOM. This initial render happens very quickly.
    // useRef Initialization: When you define userDropDown = useRef(null), it's initialized with null during this initial render because the DOM element hasn't been created yet.
    // So, if you try to access userDropDown.current.value within the same function where you initialize userDropDown (like handleClearForm), it might be null because the DOM hasn't caught up yet.
    // This approach is the one already implemented in your code. You add a check before accessing userDropDown.current.value:

    // 2. useEffect Hook:

    /**
     
      useEffect(() => {
    if (userDropDown.current) {
    userDropDown.current.value = 'please select author';
  }
}, []) // Empty dependency array to run only once after mount
     

*/
    if (userDropDown.current) {
      const userElement = userDropDown.current
      userElement.value = 'please select author'
      const selectedOption = userElement.selectedOptions[0]
      setUserSelectData((prevState) => ({
        ...prevState,
        userDropDownID: selectedOption.id,
        // if the data id of the actual select element === 'please select' then set the value of the author to ''
        // we controll the select box which controlls the author box
        userDropDownName: selectedOption.dataset.id === 'please-select' && '',
      }))
    }
  }

  if (loading) {
    return <Loading />
  }

  if (isRejected === true) {
    return <NotAuthorized errMSG={errMSG} />
  }
  return (
    <div className="page-container admin-new-blog-container">
      {/* <BackButton /> */}

      {/* if not publish then return ... this article is not ready yet */}
      <section className="admin-blog-form-container">
        {' '}
        <div className="admin-blog-form-container-right-div">
          <div className="admin-blog-icon-div">
            <i className="admin-blog-icon fa-solid fa-blog"></i>
          </div>
          <div>
            <p>hello {user.name}</p>
            <p>create a new blog for any user</p>
          </div>
          <p>new blog for: {userDropDownName && userDropDownName}</p>
          <p>
            user id: <span className="user-id">{userDropDownID && userDropDownID}</span>
          </p>

          {showToast && (
            <div className="created-toast"> blog created for {userDropDownName}</div>
          )}
        </div>
        <div>
          {' '}
          <form onSubmit={onSubmit} className="form new-blog-form-admin">
            <div className="form-group user-select-dropdown-wrap">
              <select
                className="admin-user-create-dropdown"
                ref={userDropDown}
                onChange={handleUserSelect}
                name="userDropDown"
                id="userDropDown"
              >
                {/* do the checks to see if it matches data-id */}
                <option data-id="please-select">please select author</option>
                {users &&
                  users.map((user) => (
                    <option
                      data-id={user._id}
                      key={user._id}
                      id={user._id} // needed to send to db
                      value={user._name}
                      // e.target.value ?
                    >
                      {user.name}
                    </option>
                  ))}
              </select>
              <i className="dropdown-chevron fa-solid fa-chevron-down"></i>
            </div>

            <div className="form-group">
              {/* LOOP THROUGH INPUTS DYNAMICLY */}
              <input
                type="text"
                id="author"
                value={userDropDownName}
                onChange={onChange}
                className="form-input"
                name="author"
                placeholder="Blog Author"
                disabled={true}
                // required
              />
            </div>
            <div className="form-group">
              <input
                type="blogTitle"
                id="blogTitle"
                value={blogTitle}
                onChange={onChange}
                className="form-input"
                name="blogTitle"
                placeholder="Blog BlogTitle"
                // required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="country"
                value={country}
                onChange={onChange}
                className="form-input"
                name="country"
                placeholder="Blog Country"
                autoComplete="on"
                // required
              />
            </div>

            <div className="form-group">
              <textarea
                name="blogBody"
                onChange={onChange}
                id="blogBody"
                value={blogBody}
                className="form-input blog-input-body"
                placeholder="Blog Text"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="check-form-control">
                <input
                  onChange={onChange}
                  id="featured"
                  type="checkbox"
                  name="featured"
                  value={false}
                  checked={featured}
                />
                featured
              </label>

              <label className="check-form-control">
                <input
                  onChange={onChange}
                  type="checkbox"
                  id="publish"
                  name="publish"
                  value={false}
                  checked={publish}
                />
                publish
              </label>
            </div>

            {/* RE-FACTOR THIS AND ADMIN */}
            {/* <input className="file-input" type="file" name="files[]" multiple /> */}
            <div className="form-group image-select-btn-wrap">
              {/* Hidden file input for images */}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imagesInputRef}
                style={{ display: 'none' }}
                onChange={handleImagesChange}
              />
              <button
                type="button"
                className="select-images-btn"
                onClick={triggerImagesSelect}
              >
                Images
              </button>

              {/* Hidden file input for hero image */}
              <input
                type="file"
                accept="image/*"
                ref={heroImageInputRef}
                style={{ display: 'none' }}
                onChange={handleHeroImageChange}
              />
              <button
                type="button"
                className="select-images-btn"
                onClick={triggerHeroImageSelect}
              >
                Hero
              </button>

              {images.length > 0 && (
                <div>
                  <h4>Selected Images:</h4>
                  <ul>
                    {images.map((file, index) => (
                      <li className="file-li-item" key={index}>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {heroImage && (
                <div className="file-li-item">
                  <h4>Selected Hero Image:</h4>
                  <p>{heroImage.name}</p>
                </div>
              )}
            </div>

            <div className="form-group form-btn-container create-blog-btn-container">
              <button
                onClick={handleClearForm}
                type="button"
                className="form-btn clear-blog-text-btn create-blog-btn"
              >
                clear all
              </button>
              <button className="form-btn create-blog-btn">create blog</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default CreateBlogAdmin
