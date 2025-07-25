import { useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import useAuth from '../context/useAuth';

const BugForm = ({ onBugAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Current user from context:', user);
    if (!user) {
      toast.error('You must be logged in to report bugs.');
      return;
    }

    if (!title || !description) {
      toast.error('Please provide both title and description.');
      return;
    }

    try {
      const res = await API.post('/bugs', {
        title,
        description,
        reportedBy:user?.username,
      });

      onBugAdded?.(res.data);
      toast.success('Bug reported!');
      setTitle('');
      setDescription('');
    } catch (err) {
      toast.error('Error: Please try again later');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow ">
      <h2 className="text-xl font-semibold dark:text-black">Report a Bug</h2>
      <input
        type="text"
        placeholder="Bug Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default BugForm;
