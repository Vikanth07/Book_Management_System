import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import PDFReader from "./PDFReader";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookLayout = ({
  book,
  onDelete,
  onUpdate,
  readOnly = false,
  onUnlike,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(book.title);
  const [newAuthor, setNewAuthor] = useState(book.author || "");
  const [newPdf, setNewPdf] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isLiked, setIsLiked] = useState(book.isLiked || false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userEmails, setUserEmails] = useState([]);

  const handleSave = async () => {
    const success = await onUpdate(book._id, newTitle, newAuthor, newPdf);
    if (success) setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(book._id);
  };

  const handleLikeToggle = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/books/${book._id}/like`,
        {},
        { withCredentials: true }
      );
      setIsLiked(res.data.isLiked);
      toast.success(res.data.isLiked ? "Book liked!" : "Book unliked!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      if (onUnlike && !res.data.isLiked) {
        onUnlike(book._id);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const fetchEmails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/emails`, {
        withCredentials: true,
      });
      setUserEmails(res.data);
    } catch (err) {
      console.error("Failed to fetch user emails:", err);
    }
  };

  const handleShareClick = async () => {
    setShowShareModal(true);
    if (!userEmails.length) {
      await fetchEmails();
    }
  };

  const handleShareWithUser = async (email) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/books/${book._id}/share`,
        { email },
        { withCredentials: true }
      );
      toast.success(`Book shared with ${email}`, {
        position: "bottom-right",
        autoClose: 2000,
      });
      setShowShareModal(false);
    } catch (err) {
      console.error("Failed to share book:", err);
      toast.error("Share failed. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#ffe9d6] via-[#ffd5ba] to-[#ffc3a3] p-3 rounded-lg shadow-lg w-40 h-55 hover:scale-105 transition-transform duration-200 group mt-4 border border-orange-200 hover:border-orange-400">
        {isEditing && !readOnly ? (
          <div className="absolute inset-0 bg-white z-50 p-3 rounded-xl flex flex-col justify-center text-black">
            <label className="text-xs font-semibold mb-1">Title:</label>
            <input
              className="border px-2 py-1 mb-2 text-sm rounded-lg focus:outline-none"
              value={newTitle}
              placeholder="Book Title"
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <label className="text-xs font-semibold mb-1">Author:</label>
            <input
              className="border px-2 py-1 mb-2 text-sm rounded-lg focus:outline-none"
              value={newAuthor}
              placeholder="Author Name"
              onChange={(e) => setNewAuthor(e.target.value)}
            />

            <label className="text-xs font-semibold mb-1">Replace PDF:</label>
            <input
              type="file"
              className="mb-3 text-xs"
              onChange={(e) => setNewPdf(e.target.files[0])}
            />

            <div className="flex justify-between gap-2 text-xs">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-lg w-full"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg w-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between relative">
              <div className="w-[65%]">
                <h3 className="text-lg font-semibold text-black truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-black-100 truncate">
                  by {book.author}
                </p>
              </div>
              <div className="flex items-center gap-3 text-lg relative">
                <button
                  onClick={handleLikeToggle}
                  className="focus:outline-none"
                  title={isLiked ? "Unlike" : "Like"}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-200 hover:text-red-500" />
                  )}
                </button>
                <button onClick={handleShareClick}>
                  <FaShare
                    title="Share"
                    className="text-white cursor-pointer hover:text-gray-300"
                  />
                </button>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 hidden group-hover:flex flex-col gap-2 z-10">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-full text-xs font-semibold shadow-md hover:bg-blue-600"
                onClick={() => setIsReading(true)}
              >
                Read
              </button>
              {!readOnly && (
                <>
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-full text-xs font-semibold shadow-md hover:bg-yellow-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-full text-xs font-semibold shadow-md hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {isReading && (
        <PDFReader
          fileUrl={`${API_BASE_URL}/api/books/${book.pdfFile}`}
          title={book.title}
          bookId={book._id}
          onClose={() => setIsReading(false)}
        />
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Share Book</h2>
            <div className="max-h-48 overflow-y-auto mb-4">
              <p className="font-semibold text-sm mb-2">
                Select a user to share with:
              </p>
              {userEmails.map((email) => (
                <div
                  key={email}
                  className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleShareWithUser(email)}
                >
                  {email}
                </div>
              ))}
            </div>
            <button
              className="bg-gray-300 text-white py-1 px-4 rounded-full w-full"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookLayout;
