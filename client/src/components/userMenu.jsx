import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b dark:border-gray-700 dark:text-white">
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{user.username}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role}</span>
      </div>
      <Link to="/profile" className="text-sm underline text-blue-500">
        View Profile
        </Link>

      <button
        onClick={handleLogout}
        className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
