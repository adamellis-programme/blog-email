import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPublicBlogs } from '../features/blog/blogSlice'
import img1 from '../img/temp-imgs/home-imgs/img-1.jpg'
import img2 from '../img/temp-imgs/home-imgs/img-2.jpg'
import img3 from '../img/temp-imgs/home-imgs/img-3.jpg'
import img4 from '../img/temp-imgs/home-imgs/img-4.jpg'
import EmailSignUpForm from '../components/EmailSignUpForm'
import FeaturedBlogItem from '../components/FeaturedBlogItem'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import HomeLoader from '../components/loaders/HomeLoader'
function Home() {
  const dispatch = useDispatch()
  const { publicBlogs } = useSelector((state) => state.blogs)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
    })

    return () => {}
  }, [])

  useEffect(() => {
    dispatch(getPublicBlogs())
  }, [])

  //  profile picture upload
  // header image upload
  // if user.adminn ==== true && <AdminPanel/> on get me, list all users with delete functionality on the getMe
  // admin page -> list all users and all blogs
  // work on the admin in the gym or cafe
  // mern shop in bedroom
  // admin routes still need to be protected but we rwturn ALL blogs and notes not by the id in the JWT token
  const filtered = publicBlogs && publicBlogs.filter((item) => item.featured === true)
  // console.log(filtered)

  function greeting() {
    // if (!user) {
    //   return 'login or register to get started'
    // }
    if (user && user.logins < 1) {
      return `welcome  ${user.name.split(' ')[0]}`
    }
    if (user && user.logins > 0) {
      return `welcome back ${user.name.split(' ')[0]}`
    }
  }

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-header-container">
          <div className="hero-head-container">
            <p>{greeting()}</p>
            <h1>creative beginnings</h1>
            <p>your blogging journey</p>
            <p>starts here</p>
            {!user && <p className="home-info-p">login or register to get started </p>}
          </div>

          <div className="hero-form-container">
            {/* THIS IS WHAT CAUSES THE ISSUE */}
            <EmailSignUpForm />
          </div>

          {/* show password on login page */}

          <div className="home-hero-content-container">{/* <p>hello</p> */}</div>
        </div>
      </section>

      <div className="page-container">
        <div className="featured-blogs-header-container">
          <h2>
            <span>FEATURED BLOG ARTICLES ON THE GO</span>
          </h2>
          <p>read some of our bloggers featured content </p>
          <p>from america to new zealand we have an array of interesting reads </p>
          <p>to inspire your next trip </p>
        </div>
        {!publicBlogs && <HomeLoader />}
        {publicBlogs && publicBlogs.length < 1 && <div className='home-no-blogs-div' ><h3>no featured blogs yet!</h3></div>}
        <section className="home-blog-posts">
          {/* loader */}
          {filtered &&
            filtered.length > 0 &&
            filtered.map((blog) => <FeaturedBlogItem key={blog._id} blog={blog} />)}
        </section>
      </div>
    </>
  )
}

export default Home
