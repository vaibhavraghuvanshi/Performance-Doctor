import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-500/20 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-primary-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};
