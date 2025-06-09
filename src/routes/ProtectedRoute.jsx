import { Navigate, Outlet } from 'react-router-dom';
import { getUserFromToken } from '../utils/jwtUtils';

const ProtectedRoute = ({ role }) => {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/error" />;

  return <Outlet />;
};

export default ProtectedRoute;
