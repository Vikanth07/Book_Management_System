import React, { useEffect, useState } from "react";
import axios from "axios";
import BookLayout from "../BookLayout";

function LikedBooks() {
  const [likedBooks, setLikedBooks] = useState([]);

  const fetchLikedBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/test", {
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">No Liked Books</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Liked Books</h1>
      <div className="flex flex-wrap gap-4">
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
