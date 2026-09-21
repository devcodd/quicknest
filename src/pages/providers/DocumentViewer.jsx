import React, { useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";

import "./DocumentViewer.css";

const DocumentViewer = ({
  images = [],
  currentIndex = 0,
  title = "Image Preview",
  onClose,
  onPrevious,
  onNext,
}) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && onPrevious) {
        onPrevious();
      }

      if (event.key === "ArrowRight" && onNext) {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onPrevious, onNext]);

  if (!currentImage) {
    return null;
  }

  return (
    <div className="document-viewer-overlay" onClick={onClose}>
      <div
        className="document-viewer"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <div className="document-viewer-header">
          <div>
            <h3>{title}</h3>

            {images.length > 1 && (
              <span>
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          <button
            type="button"
            className="document-viewer-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        {/* IMAGE AREA */}

        <div className="document-viewer-content">
          {images.length > 1 && (
            <button
              type="button"
              className="document-nav previous"
              onClick={onPrevious}
              disabled={currentIndex === 0}
            >
              <FiChevronLeft />
            </button>
          )}

          <div className="document-image-container">
            <img
              src={currentImage}
              alt={title}
              className="document-full-image"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className="document-nav next"
              onClick={onNext}
              disabled={currentIndex === images.length - 1}
            >
              <FiChevronRight />
            </button>
          )}
        </div>

        {/* FOOTER */}

        <div className="document-viewer-footer">
          <span>
            {images.length > 1
              ? `Image ${currentIndex + 1} of ${images.length}`
              : "Document Preview"}
          </span>

          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            className="document-open-btn"
          >
            <FiDownload />
            Open Image
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
