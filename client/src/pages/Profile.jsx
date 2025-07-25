import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import API from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBugs, setMyBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      toast('You must be logged in to view your profile.', { icon: '⚠️' });
      navigate('/');
    }
  }, [user, navigate]);

  const fetchMyBugs = async () => {
    try {
      const res = await API.get('/bugs');
      const userBugs = res.data
        .filter((bug) => bug.reportedBy === user?.username)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMyBugs(userBugs);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      toast.error('Failed to load your bugs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/bugs/${id}`);
      setMyBugs((prev) => prev.filter((bug) => bug._id !== id));
      toast.success('Bug deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete bug');
    }
  };

  useEffect(() => {
    if (user) fetchMyBugs();
  }, [user]);

  const statusColors = {
    open: 'bg-red-200 text-red-800',
    'in-progress': 'bg-yellow-200 text-yellow-800',
    resolved: 'bg-green-200 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-4 py-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">👤 Profile</h2>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 space-y-2">
        <p className="text-lg">
          <span className="font-semibold">Username:</span> {user?.username}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Role:</span> {user?.role}
        </p>
      </div>

      {/* 🔙 Back Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ← Back to Bug List
        </button>
      </div>

      {/* Bugs */}
      <h3 className="text-2xl font-semibold mb-4">🐞 My Reported Bugs</h3>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading bugs...</p>
      ) : myBugs.length === 0 ? (
        <p className="text-center text-gray-500">No bugs reported yet.</p>
      ) : (
        <div className="space-y-4">
          {myBugs.map((bug) => (
            <div
              key={bug._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-start"
            >
              <div>
                <h4 className="text-lg font-bold">{bug.title}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">{bug.description}</p>
                <div className="flex gap-2 items-center mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[bug.status]}`}
                  >
                    {bug.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(bug.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                {(user?.role === 'admin' || bug.reportedBy === user?.username) && (
                  <button
                    onClick={() => handleDelete(bug._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
