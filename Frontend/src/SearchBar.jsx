import React, { useState } from "react";

const SearchBar = ({ books, onSelectBook }) => {
  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim()) {
      const results = books.filter(
        (book) =>
          book.title.toLowerCase().includes(val.toLowerCase()) ||
          book.author.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredBooks(results);
    } else {
      setFilteredBooks([]);
      onSelectBook(null); // Show all books
    }
  };

  const handleSelect = (book) => {
    setQuery(`${book.title} by ${book.author}`);
    setFilteredBooks([]);
    onSelectBook(book);
  };

  const handleClear = () => {
    setQuery("");
    setFilteredBooks([]);
    onSelectBook(null); // Show all books
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 sm:px-6">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-700 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-purple-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <input
          type="text"
          id="default-search"
          value={query}
          onChange={handleChange}
          className="block w-full p-4 pl-10 pr-10 text-sm sm:text-base text-gray-800 bg-purple-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          placeholder="Search by title or author..."
          required
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        )}
      </div>

      {filteredBooks.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-purple-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto text-sm sm:text-base">
          {filteredBooks.map((book) => (
            <li
              key={book._id}
              onClick={() => handleSelect(book)}
              className="p-3 hover:bg-purple-50 cursor-pointer"
            >
              <span className="font-medium text-purple-700">{book.title}</span>
              <span className="text-gray-500"> by {book.author}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
