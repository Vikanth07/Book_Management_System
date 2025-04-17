import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import PDFReader from "./PDFReader";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookLayout = ({ book, onDelete, onUpdate, readOnly = false, onUnlike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(book.title);
  const [newPdf, setNewPdf] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isLiked, setIsLiked] = useState(book.isLiked || false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userEmails, setUserEmails] = useState([]);

  const handleSave = async () => {
    const success = await onUpdate(book._id, newTitle, newPdf);
    if (success) setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(book._id);
  };

  const handleLikeToggle = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/api/books/${book._id}/like`,
        {},
        { withCredentials: true }
      );
      setIsLiked(res.data.isLiked);
      toast.success(res.data.isLiked ? "Book liked!" : "Book unliked!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      if (onUnlike && !res.data.isLiked) {
        onUnlike(book._id); // Notify parent to remove it
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
      const res = await axios.get("http://localhost:3002/api/users/emails", {
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
        `http://localhost:3002/api/books/${book._id}/share`,
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
      <div className="relative bg-white p-4 rounded-xl shadow-md w-40 h-40 hover:scale-105 transition-transform duration-300 group mt-4">
        {isEditing && !readOnly ? (
          <div className="absolute inset-0 bg-white z-20 p-2 rounded-xl flex flex-col justify-between">
            <input
              className="border px-2 py-1 mb-2 text-sm rounded"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="file"
              className="mb-2 text-xs"
              onChange={(e) => setNewPdf(e.target.files[0])}
            />
            <div className="flex justify-between gap-2 text-xs">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded w-full"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-300 px-2 py-1 rounded w-full"
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
                <h3 className="text-sm font-semibold truncate">{book.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  by {book.author}
                </p>
              </div>
              <div className="flex items-center gap-2 text-lg relative">
                <button
                  onClick={handleLikeToggle}
                  className="focus:outline-none"
                  title={isLiked ? "Unlike" : "Like"}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </button>
                <button onClick={handleShareClick}>
                  <FaShare
                    title="Share"
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                  />
                </button>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 hidden group-hover:flex flex-col gap-1 z-10">
              <button
                className="bg-blue-500 text-white text-xs py-1 rounded"
                onClick={() => setIsReading(true)}
              >
                Read
              </button>
              {!readOnly && (
                <>
                  <button
                    className="bg-yellow-500 text-white text-xs py-1 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white text-xs py-1 rounded"
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
          fileUrl={`http://localhost:3002/api/books/${book.pdfFile}`}
          title={book.title}
          bookId={book._id}
          onClose={() => setIsReading(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Share Book</h2>
            <div className="max-h-48 overflow-y-auto mb-4">
              <p className="font-semibold text-sm mb-2">Select a user to share with:</p>
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
