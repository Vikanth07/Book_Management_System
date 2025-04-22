import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import bookBoxImage from '../assets/sharebook1.png'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/showrecommendations`, {
        withCredentials: true,
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] p-6 relative">
      {/* Page Heading */}
      <h2 className="text-5xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent tracking-wide">
        <BookOpen className="w-8 h-8 text-purple-500 animate-pulse" />
        Recommended for You
      </h2>

      {/* Subtitle */}
      <div className="mb-8">
        <p className="text-5xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-[#845ef7] to-[#d946ef] bg-clip-text text-transparent tracking-wide">
          Books handpicked for your taste!
        </p>
      </div>

      {/* Loading / Error / Empty States */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg animate-pulse">
          Fetching your book recs...
        </p>
      ) : error ? (
        <div className="text-red-500 text-center font-semibold">{error}</div>
      ) : books.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <h1 className="text-xl font-semibold text-gray-600">😕 No Recommendations</h1>
        </div>
      ) : (
        /* Books Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-md p-4 transition-transform hover:scale-105 duration-300 relative flex flex-col justify-between animate-fadeIn"
            >
              <div>
                <h3 className="text-md font-bold text-gray-800 truncate mb-1">
                  📘 {book.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">by {book.author}</p>
              </div>
              <a
                href={`${API_BASE_URL}/api/books/${book.pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm text-center py-1.5 px-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                📖 Read Now
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Decorative Image */}
      <img
        src={bookBoxImage}
        alt="Books in a box"
        className="fixed top-16 sm:top-18 right-8 w-40 sm:w-45 h-40 sm:h-45 object-contain pointer-events-none z-10"
      />
    </div>
  );
};

export default Recommendations;
