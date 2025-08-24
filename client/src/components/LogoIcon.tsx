import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main book shape */}
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H38C39.1046 10 40 10.8954 40 12V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V12Z"
        fill="#1E40AF"
        stroke="#1E3A8A"
        strokeWidth="2"
      />
      
      {/* Book pages */}
      <path
        d="M12 14H36V34H12V14Z"
        fill="#F8FAFC"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      
      {/* Book spine */}
      <path
        d="M38 12L42 14V34L38 36V12Z"
        fill="#1E3A8A"
        stroke="#1E3A8A"
        strokeWidth="1"
      />
      
      {/* Graduation cap */}
      <path
        d="M20 18L24 16L28 18L24 20L20 18Z"
        fill="#7C3AED"
        stroke="#6D28D9"
        strokeWidth="1"
      />
      
      {/* Tassel */}
      <path
        d="M24 20V22M22 22L24 24L26 22"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Knowledge dots */}
      <circle cx="18" cy="26" r="1.5" fill="#3B82F6" />
      <circle cx="24" cy="26" r="1.5" fill="#3B82F6" />
      <circle cx="30" cy="26" r="1.5" fill="#3B82F6" />
      
      {/* Learning path */}
      <path
        d="M16 30L20 32L24 30L28 32L32 30"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Sparkle elements */}
      <path
        d="M14 16L15 17L14 18L13 17L14 16Z"
        fill="#F59E0B"
      />
      <path
        d="M34 28L35 29L34 30L33 29L34 28Z"
        fill="#F59E0B"
      />
    </svg>
  );
};

export default LogoIcon;
