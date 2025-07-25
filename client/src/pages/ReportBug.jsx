import { useNavigate } from 'react-router-dom';
import BugForm from '../components/BugForm';
import { ArrowLeft } from 'lucide-react';

const ReportBug = () => {
  const navigate = useNavigate();

  const handleBugAdded = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-4 py-8 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-blue-600 hover:underline flex items-center mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </button>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🐛 Report a New Bug</h2>
        <BugForm onBugAdded={handleBugAdded} />
      </div>
    </div>
  );
};

export default ReportBug;
