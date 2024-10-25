import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
// import Register from './pages/Register'
import Register2 from './pages/Register2'
// import SignIn from './pages/SignIn'
import SignIn2 from './pages/SignIn2'
import Header from './components/Header'
import NewBlog from './pages/NewBlog'
import PrivateRoute from './components/PrivateRoute'
import UserBlogs from './pages/UserBlogs'
import UserBlogPage from './pages/UserBlogPage'
import Tasks from './pages/Tasks'
import Footer from './components/Footer'
import PublicBlogPage from './pages/PublicBlogPage'
import Admin from './pages/AdminBlogs'
import AdminDash from './pages/AdminDash'
import AdminUsers from './pages/AdminUsers'
import ViewEmails from './pages/ViewEmails'
import CreateBlogAdmin from './pages/CreateBlogAdmin'
import FAQS from './pages/FAQS'
import Ask from './pages/Ask'
import NotFound from './pages/NotFound'
import MessagesPage from './pages/MessagesPage'
import MyAccount from './pages/MyAccount'
import Terms from './pages/Terms'
import ManageImages from './pages/ManageImages'
import ViewSentEmailsPage from './pages/ViewSentEmailsPage'
import ViewSentEmailDataPage from './pages/ViewSentEmailDataPage'

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register2 />} />
            <Route path="/sign-in" element={<SignIn2 />} />
            <Route
              path="/new-blog"
              element={
                <PrivateRoute>
                  <NewBlog />
                </PrivateRoute>
              }
            />

            <Route
              path="/user-blogs"
              element={
                <PrivateRoute>
                  <UserBlogs />
                </PrivateRoute>
              }
            />

            <Route
              path="/user-blog/:blogID"
              element={
                <PrivateRoute>
                  <UserBlogPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-images/:blogID"
              element={
                <PrivateRoute>
                  <ManageImages />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-account"
              element={
                <PrivateRoute>
                  <MyAccount />
                </PrivateRoute>
              }
            />

            <Route path="public-blog/:blogID" element={<PublicBlogPage />} />

            <Route path="/admin-dash" element={<AdminDash />} />
            <Route path="/admin-blogs" element={<Admin />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/email-page" element={<ViewEmails />} />
            {/* PROTECT MORE ROUTES  AND CHECK IF ADMIN IS TRUE  */}
            <Route path="/view-sent-emails" element={<ViewSentEmailsPage />} />
            <Route
              path="/view-sent-email-data-page/:id"
              element={<ViewSentEmailDataPage />}
            />
            <Route path="/admin-new-blog" element={<CreateBlogAdmin />} />
            <Route path="/faqs" element={<FAQS />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/msg-page" element={<MessagesPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
