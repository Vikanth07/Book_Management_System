import React, { useEffect, useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PDFReader = ({ fileUrl, title, bookId, onClose, onProgress }) => {
  const [lastPage, setLastPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [initialPageSet, setInitialPageSet] = useState(false);
  const viewerRef = useRef(null);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/books/${bookId}/progress`,
          { withCredentials: true }
        );
        const savedPage = res.data?.progress || 0;
        setLastPage(savedPage);
        setInitialPageSet(true);
      } catch (err) {
        console.error("Failed to load progress", err);
        setInitialPageSet(true);
      }
    };

    fetchProgress();
  }, [bookId]);

  const handleDocumentLoad = (e) => {
    setNumPages(e.doc.numPages);
    if (lastPage > 0 && e.doc.numPages > 0) {
      const calculatedProgress = Math.round(((lastPage + 1) / e.doc.numPages) * 100);
      setProgress(calculatedProgress);
      if (onProgress) onProgress(calculatedProgress);
    }

    if (lastPage > 0 && jumpToPage) {
      setTimeout(() => {
        jumpToPage(lastPage);
      }, 300);
    }
  };

  const handlePageChange = (e) => {
    const currentPage = e.currentPage;
    const totalPages = e.doc.numPages;

    setLastPage(currentPage);
    const calculated = Math.round(((currentPage + 1) / totalPages) * 100);
    setProgress(calculated);
    if (onProgress) onProgress(calculated);

    const saveProgress = setTimeout(() => {
      axios.post(
        `${API_BASE_URL}/api/books/${bookId}/progress`,
        { progress: currentPage, totalPages: e.doc.numPages },
        { withCredentials: true }
      ).catch((err) => {
        console.error("Failed to save progress", err);
      });
    }, 500);

    return () => clearTimeout(saveProgress);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[95vw] h-[90vh] md:max-w-[80vw] md:h-[85vh] relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 relative">
          <div className="text-md sm:text-lg font-semibold flex-grow text-center truncate">
            {title}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Circular Progress */}
            <div className="hidden sm:block w-10 h-10">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textSize: "28px",
                  pathColor: "#4CAF50",
                  textColor: "#333",
                })}
              />
            </div>

            {/* Close Button */}
            <button
              className="text-2xl sm:text-3xl text-gray-600 hover:text-red-600"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-grow overflow-hidden" ref={viewerRef}>
          {initialPageSet && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={fileUrl}
                onPageChange={handlePageChange}
                onDocumentLoad={handleDocumentLoad}
                plugins={[pageNavigationPluginInstance]}
                initialPage={lastPage}
              />
            </Worker>
          )}
        </div>

        {/* Mobile Circular Progress Bar */}
        <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white p-2 rounded-full shadow-lg">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "22px",
              pathColor: "#4CAF50",
              textColor: "#333",
              trailColor: "#eee",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
