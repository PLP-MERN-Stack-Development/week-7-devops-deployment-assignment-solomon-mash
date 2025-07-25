import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BugList from '../components/BugList';
import UserMenu from '../components/userMenu';
import { Sun, Moon, Bug, LayoutDashboard } from 'lucide-react';
import useAuth from '../context/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-4 py-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">🐞 Bug Tracker</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:opacity-90"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>

          {/* If authenticated */}
          {user ? (
            <>
              {/* Report Bug Button */}
              <button
                onClick={() => navigate('/report')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                <span>Report Bug</span>
              </button>

              {/* Admin Dashboard Button */}
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <UserMenu />
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Bug List */}
      <main className="max-w-4xl mx-auto grid gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <BugList />
        </div>
      </main>
    </div>
  );
};

export default Home;
