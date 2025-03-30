"use client";

import React, { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  ariaLabel: string;
  tooltipText?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  ariaLabel,
  tooltipText = "Add Weight Entry"
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <>
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 md:bottom-8 md:right-8 animate-bounce-subtle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="white"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        
        {/* Tooltip - only show on desktop/tablet */}
        {showTooltip && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm py-1 px-3 rounded-lg shadow-lg whitespace-nowrap hidden md:block">
            {tooltipText}
            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-800 transform rotate-45"></div>
          </div>
        )}
      </button>
    </>
  );
};

export default FloatingActionButton;
