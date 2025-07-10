import React, { useEffect } from "react";

const ImagePreviewModal = ({ src, onClose }) => {
  if (!src) return null;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Optional: prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
      />

      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-red-400 transition"
      >
        &times;
      </button>
    </div>
  );
};

export default ImagePreviewModal;
