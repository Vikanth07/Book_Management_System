import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/showrecommendations", {
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
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : books.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <h1 className="text-xl font-semibold text-gray-600">No Recommendations</h1>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-xl shadow-md w-40 h-40 hover:scale-105 transition-transform duration-300 relative"
            >
              <h3 className="text-sm font-semibold truncate">{book.title}</h3>
              <p className="text-xs text-gray-500 truncate mb-2">by {book.author}</p>
              <a
                href={`http://localhost:3002/api/books/${book.pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white text-xs py-1 px-2 rounded absolute bottom-2 left-2 right-2 text-center"
              >
                Read
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
