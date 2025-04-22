import React, { useEffect, useState } from "react";
import axios from "axios";
import BookLayout from "../BookLayout";
import { Heart } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LikedBooks() {
  const [likedBooks, setLikedBooks] = useState([]);

  const fetchLikedBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/test`, {
        withCredentials: true,
      });
      setLikedBooks(res.data);
    } catch (error) {
      console.error("Error fetching liked books:", error);
    }
  };

  useEffect(() => {
    fetchLikedBooks();
  }, []);

  const handleUnlike = (bookId) => {
    setLikedBooks((prev) => prev.filter((book) => book._id !== bookId));
  };

  if (likedBooks.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc]">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 animate-pulse">
          💔 No Liked Books
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] p-6">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
        <Heart className="w-6 h-6 text-pink-500 animate-ping-slow" />
        Your Liked Books
      </h1>

      {/* Subtitle */}
      <p className="text-2xl sm:text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
        Books that touched your soul✨
      </p>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fadeIn">
        {likedBooks.map((book) => (
          <BookLayout
            key={book._id}
            book={book}
            readOnly
            onUnlike={handleUnlike}
          />
        ))}
      </div>
    </div>
  );
}

export default LikedBooks;
