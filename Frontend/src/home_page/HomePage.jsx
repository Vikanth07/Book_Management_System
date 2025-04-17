import React, { useEffect, useState } from "react";
import axios from "axios";
import BookLayout from "../BookLayout";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/books", { withCredentials: true })
      .then((res) => setBooks(res.data.books))
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3002/api/books/${id}`, {
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

  const handleUpdate = async (id, newTitle, newPdf) => {
    const formData = new FormData();
    formData.append("title", newTitle);
    if (newPdf) formData.append("pdfFile", newPdf);

    try {
      const res = await axios.put(
        `http://localhost:3002/api/books/${id}`,
        formData,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setBooks((prev) =>
          prev.map((book) =>
            book._id === id ? { ...book, title: newTitle } : book
          )
        );
        if (selectedBook && selectedBook._id === id) {
          setSelectedBook({ ...selectedBook, title: newTitle });
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
    <div className="p-4">
      <Toaster position="bottom-right" />
      <div className="mb-4">
        <SearchBar books={books} onSelectBook={setSelectedBook} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {selectedBook ? (
          <BookLayout
            book={selectedBook}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ) : (
          books.map((book) => (
            <BookLayout
              key={book._id}
              book={book}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
