import React, { useEffect, useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

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
          `http://localhost:3002/api/books/${bookId}/progress`,
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
      const calculatedProgress = Math.round(
        ((lastPage + 1) / e.doc.numPages) * 100
      );
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
      axios
        .post(
          `http://localhost:3002/api/books/${bookId}/progress`,
          { progress: currentPage, totalPages:e.doc.numPages },
          { withCredentials: true }
        )
        .catch((err) => {
          console.error("Failed to save progress", err);
        });
    }, 500);

    return () => clearTimeout(saveProgress);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90vw] h-[95vh] relative flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-3 bg-gray-100">
          <div className="text-lg font-semibold flex-grow text-center">
            {title}
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 mr-4">
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
            <button
              className="text-3xl text-gray-600 hover:text-red-600"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default PDFReader;