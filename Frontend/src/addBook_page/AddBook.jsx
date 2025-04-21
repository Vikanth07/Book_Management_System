import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { BookOpen } from 'lucide-react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import bookBoxImage from '../assets/addbook1.png'; 

const AddBook = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a PDF file');
      return;
    }
    const formData = new FormData();
    formData.append('title', bookTitle);
    formData.append('author', authorName);
    formData.append('pdfFile', file);
    try {
      const res = await axios.post(
        'http://localhost:3002/api/books',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(`Book "${bookTitle}" added successfully!`, {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => navigate('/dashboard'),
        });
        setBookTitle('');
        setAuthorName('');
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload book');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] flex flex-col items-center justify-center px-4">
      
      {/* Top Heading */}
      <p className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
        Stack the Shelf with a new Gem
      </p>

      {/* Form Container */}
      <div className="relative w-full max-w-lg bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-8 animate-fadeIn">
        
        {/* Book Icon */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm">
          <BookOpen className="text-[#845ef7] w-6 h-6" />
        </div>

        {/* Book Box Image */}
        <img
          src={bookBoxImage}
          alt="Books in a box"
          className="absolute -bottom-14 -right-10 w-40 h-40 object-contain pointer-events-none"
        />

        {/* Form Title */}
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent">
          Add a New Book
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-xl bg-purple-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Give your book a title that lasts"
              required
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-xl bg-purple-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Enter the name that tells the tale"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-700 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-gradient-to-r file:from-[#845ef7] file:to-[#d946ef] hover:file:opacity-90 transition"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#845ef7] to-[#d946ef] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 shadow-md transition"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-300 text-gray-800 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-400 shadow-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </section>
  );
};

export default AddBook;
