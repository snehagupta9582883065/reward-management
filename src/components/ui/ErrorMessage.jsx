import React from 'react';
import { AlertCircle } from 'lucide-react';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <span className="text-red-700">{message}</span>
    </div>
  );
}

export default ErrorMessage;