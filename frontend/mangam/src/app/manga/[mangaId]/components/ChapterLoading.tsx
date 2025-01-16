import React from "react";
import { Clock, BookOpen } from "lucide-react";

const ChapterLoading = ({ message = "New Chapter is Coming Soon..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-8 rounded-2xl bg-white shadow-xl max-w-md w-full mx-4">
        {/* Ana animasyon container */}
        <div className="relative flex justify-center mb-6">
          <BookOpen className="w-16 h-16 text-indigo-500 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <Clock className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        </div>

        {/* Mesaj bölümü */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
          {message}
        </h2>

        {/* Alt mesaj */}
        <p className="text-center text-gray-600 mb-6">
          Please be patient while we prepare the next exciting chapter for you!
        </p>

        {/* Loading bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-indigo-500 h-2 rounded-full animate-loading"></div>
        </div>

        {/* İpucu mesajı */}
        <p className="text-sm text-center text-gray-500 italic">
          Why not grab a coffee while waiting? ☕
        </p>
      </div>
    </div>
  );
};

// Loading animasyonu için gereken CSS
const styles = `
  @keyframes loading {
    0% { width: 0% }
    50% { width: 70% }
    100% { width: 100% }
  }

  .animate-loading {
    animation: loading 2s ease-in-out infinite;
  }
`;

// Style tag'ini head'e ekle
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ChapterLoading;
