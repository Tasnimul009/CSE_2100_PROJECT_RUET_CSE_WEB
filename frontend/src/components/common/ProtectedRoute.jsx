import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '../../services/api';

export default function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
