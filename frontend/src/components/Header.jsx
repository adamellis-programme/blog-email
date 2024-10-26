import { useRef, useState, useEffect } from 'react'
import logo from '../img/logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import HeaderAdvert from './advert components/HeaderAdvert'
import tempImg from '../img/user.png'

import { getMe, setLoggedInUser } from '../features/users/userSlice'

function Header() {
  const topNavUL = useRef(null)
  const navLinksContainer = useRef(null)
  const [isOpen, setisOpen] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const location = useLocation()
  console.log(location.pathname)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { user: loggedInUser } = useSelector((state) => state.user)
  // loggedin user is initialy null as the setUser is only activated when we change the image
  const handleLogout = () => {
    // console.log('object')
    dispatch(logout())
    navigate('/sign-in')
    const containerDIV = navLinksContainer.current
    containerDIV.style.height = 0
    console.log('object')
  }

  // useEffect(() => {
  //   if (topNavUL.current) {
  //     // setContainerHeight(topNavUL.current.clientHeight)
  //     console.log(topNavUL.current.clientHeight)
  //     console.log(navLinksContainer.current)
  //   }
  //   console.log('object', window.innerWidth)
  // }, [])

  // useEffect(() => {
  //   console.group('Resize Event')
  //   if (window.innerWidth >= 971) {
  //     console.log('changed', window.innerWidth)
  //   }
  //   console.groupEnd()
  // }, [window.innerWidth])

  const handleToggleNav = () => {
    const containerDIV = navLinksContainer.current
    const newHeight = topNavUL.current.clientHeight
    const navContainerHeight = navLinksContainer.current.clientHeight
    // console.log(navContainerHeight)

    if (navContainerHeight === 0) {
      // console.log(navContainerHeight)
      containerDIV.style.height = newHeight + 'px'
    } else {
      containerDIV.style.height = 0
    }
    // console.log(containerDIV)
    // console.log(newHeight)
    // console.log(topNavUL.current)

    setisOpen(!isOpen)
    // console.log(isOpen)

    // if (isOpen) {
    //   containerDIV.style.height = 0
    // }

    // console.log(isOpen)
  }

  const handleCloseNav = () => {
    const containerDIV = navLinksContainer.current
    containerDIV.style.height = 0
    console.log('object')
  }

  // console.log(user)

  useEffect(() => {
    const getLoggedInUser = async () => {
      const data = await dispatch(getMe()).unwrap()
      dispatch(setLoggedInUser(data))
    }

    // do not run if logged out
    if (user) getLoggedInUser()
  }, [user])

  return (
    <header>
      {/* prettier-ignore */}
      <nav className="nav">
        <div className="nav-center">
          <div className="nav-header">
            <button onClick={handleToggleNav} className="toggle-nav">
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="nav-logo-div">

            <Link onClick={handleCloseNav} to="/">
              <img  src={logo} alt="" className="nav-logo" />
            </Link>
 
            </div>
          </div>
          {location.pathname === '/sign-in' &&  !user && <div className="nav-advert"><HeaderAdvert/></div>}
          {location.pathname === '/register' &&  !user && <div className="nav-advert"><HeaderAdvert/></div>}
          {location.pathname === '/' &&  !user &&<div className="nav-advert"><HeaderAdvert/></div>}
          {user && <img  src={loggedInUser?.avatar || tempImg} alt="" className="nav-user-img" />}
          {/* TO DO welcocome user div */}
          <div className="top-nav-links-container" ref={navLinksContainer}>
            <ul className="top-nav-links" ref={topNavUL}>
              {user ? (
                <>
                  <button onClick={handleLogout} className="sign-out-btn">
                    signout
                  </button>
                  <Link
                    to="/user-blogs"
                    onClick={handleCloseNav}
                    className="top-nav-link"
                  >
                    my blogs
                  </Link>
                  <Link to="/tasks" onClick={handleCloseNav} className="top-nav-link">
                    tasks
                  </Link>
                  <Link
                    to="/new-blog"
                    onClick={handleCloseNav}
                    className="top-nav-link new-blog-link"
                  >
                    new blog
                  </Link>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/register"
                      onClick={handleCloseNav}
                      className="top-nav-link"
                    >
                      register
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign-in" onClick={handleCloseNav} className="top-nav-link">
                      login
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/" onClick={handleCloseNav} className="top-nav-link">
                  home
                </Link>
              </li>
              <li>
                <Link to="/ask" onClick={handleCloseNav} className="top-nav-link">
                  ask
                </Link>
              </li>

              <li>
                {user?.admin && (
                  <Link
                    to="/admin-dash"
                    onClick={handleCloseNav}
                    className="top-nav-link admin-header-btn"
                  >
                    admin
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

window.addEventListener('resize', () => {
  console.log(window.innerWidth)
})

export default Header
