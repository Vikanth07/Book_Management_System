import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const BookLayout = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3002/books").then((res) => {
      setBooks(res.data);
    });
  }, []);

  const handleCardClick = (id) => {
    setSelectedBookId(selectedBookId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/books/${id}`);
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const handleUpdate = (id) => {
    // Navigate or show update form for the book
    console.log("Update book with id:", id);
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div
          key={book._id}
          onClick={() => handleCardClick(book._id)}
          className="bg-white shadow-lg rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {book.title}
          </h3>
          {selectedBookId === book._id && (
            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(book._id);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Pencil size={16} />
                Update
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(book._id);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookLayout;
