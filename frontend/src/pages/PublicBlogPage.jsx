import { images } from '../img/temp-imgs/tempImgs'
import { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { getPublicBlog } from '../features/blog/blogSlice'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  toggleUpdateModal,
  toggleDeleteModal,
  setDeleteCode,
  getPublicBlog,
  updatePublicBlog,
  resetErr,
  resetBlog,
} from '../features/blog/blogSlice'

import boat from '../img/boat.jpg'
import UpdateBlogModal from '../components/modals/UpdateBlogModal'
import DeleteBlogModal from '../components/modals/DeleteBlogModal'
import NotAuthorized from '../components/NotAuthorized'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
function PublicBlogPage() {
  const [showSuccessMSG, setshowSuccessMSG] = useState(false)
  const [copyMSG, setCopyMSG] = useState('')
  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
    })
    return () => {
      dispatch(resetErr())
      dispatch(resetBlog())
    }
  }, [])

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      console.log('URL copied successfully!')
      setshowSuccessMSG(true)
      setCopyMSG('link copied success!')
      setTimeout(() => {
        setshowSuccessMSG(false)
        setCopyMSG('')
      }, 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      // Provide user-friendly message like "Couldn't copy URL to clipboard."
    }
  }
  // const params = useParams()
  const { blogID } = useParams()

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // console.log(user)
  const { publicBlog, showUpdateModal, showDeleteModal, isError, errMSG } = useSelector(
    (state) => state.blogs
  )
  console.log(errMSG)
  // console.log(publicBlog)

  // useEffect(() => {
  //   const views = publicBlog && publicBlog
  //   dispatch(updatePublicBlog({ id: blogID, data: { ...views, views: views + 1 } }))
  //   console.log(views)
  //   // return () => {}
  // }, [])

  // const imageUrls = publicBlog && publicBlog.images

  const { imageData } = publicBlog ?? {}
  const imageUrls = imageData?.imageUrls ?? []

  // console.log(imageUrls && imageUrls.length)

  //  1: Destructuring with Optional Chaining:
  // truthy and falsy ?? {}
  // : '' try
  // IF NO PUBLIC BLOG THEN EXPECT THE {}
  const { blogBody, country, blogTitle, status, edited, author, userID, views } =
    publicBlog ? publicBlog : {}

  const [wordCount, setWordCount] = useState(100)

  // console.log(author)
  // console.log(blogBody && blogBody.split(' '))
  useEffect(() => {
    dispatch(getPublicBlog(blogID))
      .unwrap()
      .then((data) => {
        dispatch(
          updatePublicBlog({ id: blogID, data: { ...data, views: data.views + 1 } })
        )

        console.log(data)
      })
      .catch((err) => console.log(err))
    // .unwrap().catch(toast.error)
  }, [blogID, isError])

  const [chunks, setChunks] = useState(null)

  useEffect(() => {
    if (blogBody) {
      const blogWords = blogBody && blogBody.split(' ')
      const chunks = []
      let currentChunk = []

      for (let i = 0; i < blogWords.length; i++) {
        currentChunk.push(blogWords[i])

        if (currentChunk.length === wordCount || i === blogWords.length - 1) {
          chunks.push(currentChunk.join(' '))
          currentChunk = []
        }
      }

      setChunks(chunks)
    }
  }, [blogBody, wordCount])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1300) {
        setWordCount(150)
      } else {
        setWordCount(100)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty dependency array ensures it runs only once

  const handleToggleUpdate = () => {
    dispatch(toggleUpdateModal(!showUpdateModal))
  }
  const handleToggleDelete = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  let chunkCount = 0
  let imgCount = 0
  // console.log(chunks)

  // getBoundingClientRect
  // check which dependencies are used for scroll check
  const handleScrollClick = (e) => {
    console.log('object')
    window.scrollTo({
      left: 0,
      top: 0,
    })
  }
  if (isError === true) {
    return <NotAuthorized errMSG={errMSG} />
  }
  // console.log(user.id)
  // console.log(userID)

  if (!publicBlog) {
    return <GlobalPageLoader />
  }

  return (
    <div className="page-container blog-page-container">
      {showUpdateModal && <UpdateBlogModal />}
      <div className="blog-page-hero">
        {showDeleteModal && <DeleteBlogModal />}
        <img className="hero-img" src={imageData && imageData?.heroImage?.url} alt="" />

        <div className="blog-post-title-div">
          <p>{blogTitle}</p>
          <p>by {author}</p>
        </div>

        <div className="blog-post-country-div">
          <p>{country && country.toLowerCase()}</p>
        </div>

        <div className="copy-link-div">
          {showSuccessMSG && <p className="link-copied-p">l{copyMSG}</p>}
          <button onClick={handleCopyLink} className="copy-link-btn">
            <i className=" copy-link-icon fa-solid fa-link"></i>
          </button>
        </div>
      </div>

      <section className="blog-page-info">
        <h2>Blog Written By {author}</h2>
        <p>{blogTitle}</p>
        <p>views {views}</p>

        <div className="blog-controls-container">
          {/* userId is the id on the public blog */}
          {user && user.id === userID && (
            <>
              <button onClick={handleToggleUpdate} className="update-blog-btn blog-btn">
                update
              </button>
              <button onClick={handleToggleDelete} className="delete-blog-btn blog-btn">
                {showDeleteModal ? 'close' : 'delete'}
              </button>

              {/* manage images page link */}
              <Link className="blog-btn" to={`/manage-images/${blogID}`}>
                images
              </Link>
            </>
          )}
        </div>
      </section>

      {/* blog views to do  */}
      {/* make agian with the async await */}
      {/* if no images display text and if no text display images  */}
      {/* first clicked first in  */}
      {/* use the async awaint to retrieve FRESH blog info and UPDATE the views  */}
      <section className="blog-page-content-container">
        <div className="blog-post ">
          {chunks &&
            chunks.map((paragraph, index) => {
              if (imageUrls && imageUrls[index]?.url) {
                {
                  chunkCount++
                  console.log(chunkCount)
                }
                // Check if image exists for this paragraph
                return (
                  <div
                    key={index}
                    className={`post-section  ${index % 2 === 0 && 'alternate'}`}
                  >
                    <div className={`side-img-container ${index % 2 && 'alt-img'}`}>
                      <img src={imageUrls[index]?.url} alt="" className="side-img" />
                    </div>

                    <div className="side-text-container">
                      <p>{paragraph}</p>
                    </div>
                  </div>
                )
              } else {
                return null // Don't render anything if no image
              }
            })}
          <div className="extra-text-container">
            {chunks &&
              chunks.length > chunkCount &&
              chunks.slice(chunkCount).map((paragraph, index) => {
                return (
                  <p key={index} className="extra-text-paragraph">
                    {paragraph}
                  </p>
                )
              })}
          </div>

          <div className="extra-img-container">
            {imageUrls &&
              imageUrls.length > chunkCount &&
              imageUrls.slice(chunkCount).map((img, index) => {
                return (
                  <img
                    key={index}
                    src={img?.url}
                    alt=""
                    className="side-img bottom-img"
                  />
                )
              })}
          </div>
        </div>

        {/*   delete contianer */}
        <div className="scroll-up-cotainer">
          <button onClick={handleScrollClick} className="scroll-up-btn">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  )
}

export default PublicBlogPage

//  how to re-write this so that it loops and displays the text and images ONLY up until we run out of images
