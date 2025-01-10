"use client";

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="mt-4 text-xl font-semibold text-gray-700">Loading...</span>
    </div>
  );
};

export { LoadingSpinner };