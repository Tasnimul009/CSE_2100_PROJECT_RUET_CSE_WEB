import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const RequireAuth = ({ children }) => {
  const { isReady, isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="w-screen bg-white" style={{ padding: 'clamp(2rem, 4vw, 4rem)' }}>
        <div className="text-center text-gray-blue font-medium">Loading session...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default RequireAuth
