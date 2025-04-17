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
    <div className="relative w-full">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
          className="block w-full p-4 ps-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search by title or author..."
          required
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {filteredBooks.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-md max-h-60 overflow-y-auto text-sm">
          {filteredBooks.map((book) => (
            <li
              key={book._id}
              onClick={() => handleSelect(book)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            >
              <span className="font-medium">{book.title}</span>
              <span className="text-gray-500 dark:text-gray-400"> by {book.author}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;