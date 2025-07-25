import { useEffect, useState } from 'react';
import API from '../api';
import useAuth from '../context/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [bugRes, userRes] = await Promise.all([
          API.get('/bugs'),
          API.get('/auth/users'),
        ]);
        setBugs(bugRes.data);
        setUsers(userRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteBug = async (bugId) => {
    try {
      await API.delete(`/bugs/${bugId}`);
      setBugs((prev) => prev.filter((b) => b._id !== bugId));
      toast.success('Bug deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete bug');
    }
  };

  const statusColors = {
    open: 'bg-red-200 text-red-800',
    'in-progress': 'bg-yellow-200 text-yellow-800',
    resolved: 'bg-green-200 text-green-800',
  };

  const roleBadge = {
    admin: 'bg-blue-200 text-blue-800',
    user: 'bg-gray-200 text-gray-800',
  };

  if (loading) return <p className="text-center py-8">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-8 text-black dark:text-white max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🛠️ Admin Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          ⬅ Back to Home
        </button>
      </div>


      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold">{bugs.length}</h2>
          <p className="text-gray-600 dark:text-gray-400">Reported Bugs</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold">{users.length}</h2>
          <p className="text-gray-600 dark:text-gray-400">Registered Users</p>
        </div>
      </div>

      {/* Bugs List */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🐞 All Reported Bugs</h2>
        {bugs.length === 0 ? (
          <p className="text-gray-500">No bugs reported.</p>
        ) : (
          <div className="space-y-4">
            {bugs.map((bug) => (
              <div
                key={bug._id}
                className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-bold">{bug.title}</h3>
                  <p className="text-sm mb-1">{bug.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${statusColors[bug.status]}`}
                    >
                      {bug.status}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Reported by: {bug.reportedBy}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(bug.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBug(bug._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">👥 Registered Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{u.username}</p>
                  <p className={`text-xs mt-1 px-2 py-1 inline-block rounded-full ${roleBadge[u.role]}`}>
                    {u.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
