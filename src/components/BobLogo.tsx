import React from 'react';

/**
 * Bank of Baroda Dual Triangle Logo
 * Matches the logo present in the user's uploaded Baroda Pay UPI QR image
 */
export const BobLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="18" fill="white" />
      {/* Orange left/main triangle */}
      <path
        d="M 46 20 L 46 80 L 18 80 Z"
        fill="#F37021"
      />
      {/* Green right dynamic triangle */}
      <path
        d="M 52 28 L 82 52 L 52 76 Z"
        fill="#009640"
      />
    </svg>
  );
};
