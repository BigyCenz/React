import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // o uno spinner se vuoi

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
