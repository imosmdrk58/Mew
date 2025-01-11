import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorPage = ({ errorMessage = "Manga not found" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-6 h-6" />
        <span className="text-xl font-semibold">{errorMessage}</span>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => window.location.href = '/'}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default ErrorPage;