import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import useAuth from '../context/useAuth';
import { exportBugsToCSV } from '../utility/exportCSV';

const statusCycle = {
  open: 'in-progress',
  'in-progress': 'resolved',
  resolved: 'open',
};

const BugList = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const bugsPerPage = 5;

  const fetchBugs = async () => {
    try {
      const res = await API.get('/bugs');
      setBugs(res.data);
    } catch (err) {
      console.error('Failed to fetch bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = statusCycle[currentStatus];
    try {
      const res = await API.put(`/bugs/${id}`, { status: newStatus });
      toast.success('Bug status updated!');
      setBugs((prev) =>
        prev.map((bug) =>
          bug._id === id ? { ...bug, status: res.data.status } : bug
        )
      );
    } catch (err) {
      toast.error('Error: An error occurred, try again later');
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/bugs/${id}`);
      toast.success('Bug deleted!');
      setBugs((prev) => prev.filter((bug) => bug._id !== id));
    } catch (err) {
      console.error('Failed to delete bug:', err);
      toast.error('Failed to delete bug');
    }
  };

  // Filtering Logic
  let filteredBugs = [...bugs];

  // Filter by status
  if (statusFilter !== 'all') {
    filteredBugs = filteredBugs.filter((bug) => bug.status === statusFilter);
  }

  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredBugs = filteredBugs.filter(
      (bug) =>
        bug.title.toLowerCase().includes(term) ||
        bug.description.toLowerCase().includes(term)
    );
  }

  // Filter by "My Bugs Only"
  if (showMineOnly && user?.username) {
    filteredBugs = filteredBugs.filter((bug) => bug.reportedBy === user.username);
  }

  // Sorting logic
  filteredBugs.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  // Pagination logic
  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = filteredBugs.slice(indexOfFirstBug, indexOfLastBug);
  const totalPages = Math.ceil(filteredBugs.length / bugsPerPage);

  if (loading) return <p className="text-center">Loading bugs...</p>;
  if (!bugs.length) return <p className="text-center text-gray-500">No bugs reported.</p>;

  return (
    <div className="space-y-4 mt-6 dark:text-white">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Reported Bugs</h2>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search bugs..."
            className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
          />
            <button
              onClick={() => {exportBugsToCSV(filteredBugs)
                  toast.success('Exported bug list as CSV');

              }}
              
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Export CSV
            </button>

          {/* My Bugs Only */}
          {user && (
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showMineOnly}
                onChange={() => {
                  setShowMineOnly((prev) => !prev);
                  setCurrentPage(1);
                }}
              />
              My Bugs Only
            </label>
          )}

          {/* Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Bug List */}
      {currentBugs.map((bug) => (
        <div
          key={bug._id}
          className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow flex justify-between items-start"
        >
          <div>
            <h3 className="text-lg font-bold">{bug.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{bug.description}</p>
            <p className="text-sm mt-1">
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{bug.status}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reported: {new Date(bug.createdAt).toLocaleString()}
            </p>
            {bug.reportedBy && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Reported by: {bug.reportedBy}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleStatusUpdate(bug._id, bug.status)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Mark as {statusCycle[bug.status]}
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleDelete(bug._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
