import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa";

const BookLayout = ({ book, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(book.title);
  const [newPdf, setNewPdf] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleSave = async () => {
    const success = await onUpdate(book._id, newTitle, newPdf);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(book._id);
  };

  return (
    <>
      <div className="relative bg-white p-4 rounded-xl shadow-md w-40 h-40 hover:scale-105 transition-transform duration-300 group">
        {isEditing ? (
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold truncate w-[65%]">{book.title}</h3>
              <div className="flex items-center gap-2 text-lg">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="focus:outline-none"
                  title={isLiked ? "Unlike" : "Like"}
                >
                  {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                </button>
                <FaShare title="Share" className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 hidden group-hover:flex flex-col gap-1 z-10">
              <button
                className="bg-blue-500 text-white text-xs py-1 rounded"
                onClick={() => setIsReading(true)}
              >
                Read
              </button>
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
            </div>
          </>
        )}
      </div>

      {isReading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[80vw] h-[90vh] shadow-lg relative">
            <button
              onClick={() => setIsReading(false)}
              className="absolute top-2 right-4 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">{book.title}</h2>
            <iframe
              src={`http://localhost:3002/api/books/${book.pdfFile}`}
              className="w-full h-[80vh] border"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BookLayout;
