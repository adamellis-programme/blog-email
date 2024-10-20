import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const PrivateRoute = ({ children }) => {
  // console.log(children)

  const { user } = useSelector((state) => state.auth)
  // console.log(user)
  // admin ??
  if (user) return children

  return <Navigate to="/sign-in" />
}

export default PrivateRoute
