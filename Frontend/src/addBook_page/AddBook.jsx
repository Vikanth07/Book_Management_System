import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const AddBook = () => {
    const [bookTitle, setBookTitle] = useState('');
    const [file, setFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const handleConfirm = () => {
        setShowPopup(false);
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add a New Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Book Title</label>
                        <input
                            type="text"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Upload PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >
                            OK
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80 relative">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            <X />
                        </button>
                        <h3 className="text-lg font-bold mb-2">Adding Book</h3>
                        <p className="mb-4">The title <strong>{bookTitle}</strong> is being added...</p>
                        <button
                            onClick={handleConfirm}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddBook;
