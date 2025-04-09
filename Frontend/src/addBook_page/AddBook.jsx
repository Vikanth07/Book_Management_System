import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AddBook = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success(`Book "${bookTitle}" added successfully!`, {
      position: 'top-right',
      autoClose: 2000,
      onClose: () => navigate('/dashboard'),
    });

    setBookTitle('');
    setFile(null);
  };

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          📚 Add a New Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter book title"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              required
            />
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-md"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-400 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-500 shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBook;
