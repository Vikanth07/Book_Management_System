import React, { useEffect, useState } from "react";
import axios from "axios";
import BookLayout from "../BookLayout";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar";
import bookBoxImage from "../assets/reading1.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/books`, { withCredentials: true })
      .then((res) => setBooks(res.data.books))
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/books/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setBooks((prev) => prev.filter((book) => book._id !== id));
        if (selectedBook && selectedBook._id === id) setSelectedBook(null);
        toast.success("Book deleted successfully");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete book");
    }
  };

  const handleUpdate = async (id, newTitle, newAuthor, newPdf) => {
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("author", newAuthor);
    if (newPdf) formData.append("pdfFile", newPdf);

    try {
      const res = await axios.put(`${API_BASE_URL}/api/books/${id}`, formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setBooks((prev) =>
          prev.map((book) =>
            book._id === id
              ? { ...book, title: newTitle, author: newAuthor }
              : book
          )
        );

        if (selectedBook && selectedBook._id === id) {
          setSelectedBook({
            ...selectedBook,
            title: newTitle,
            author: newAuthor,
          });
        }

        toast.success("Book updated successfully");
        return true;
      }
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update book");
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e5dbff] to-[#f8f0fc] p-6">
      <Toaster position="bottom-right" />
      <div className="mb-6 w-full">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-700 mb-6 text-center">
          📚 Step Into Your Book World
        </h2>
        <div className="w-full max-w-5xl mx-auto px-4">
          <SearchBar books={books} onSelectBook={setSelectedBook} />
        </div>
      </div>

      {/* Decorative Image */}
      <img
        src={bookBoxImage}
        alt="Books in a box"
        className="absolute bottom-5 right-6 w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 max-w-[150px] object-contain pointer-events-none"
      />

      {/* Selected Book Details */}
      {selectedBook && (
        <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
          <BookLayout
            book={selectedBook}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      )}

      {/* Book Grid Layout */}
      <div
        className={`grid gap-6 ${
          selectedBook
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        }`}
      >
        {!selectedBook &&
          books.map((book) => (
            <BookLayout
              key={book._id}
              book={book}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
