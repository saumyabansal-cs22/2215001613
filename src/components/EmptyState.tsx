import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {subMessage && <p className="text-gray-500">{subMessage}</p>}
    </div>
  );
};

export default EmptyState;