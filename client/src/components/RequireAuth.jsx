
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>; // ⏳ Wait before redirecting

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default RequireAuth;
