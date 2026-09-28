import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 20 }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Sleek executive apex compass / geometric prism vector */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-out group-hover:scale-110"
      >
        <defs>
          <linearGradient id="brandLogoGradPrimary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2997ff" />
            <stop offset="50%" stopColor="#0071e3" />
            <stop offset="100%" stopColor="#004fc4" />
          </linearGradient>
          <linearGradient id="brandLogoGradSecondary" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d2d2d7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer faceted diamond / precision hex crest */}
        <path
          d="M16 2.5L28.5 9.7V22.3L16 29.5L3.5 22.3V9.7L16 2.5Z"
          stroke="url(#brandLogoGradSecondary)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        {/* Central dynamic interlocking chevron / trajectory arrow */}
        <path
          d="M16 7L23.5 13.5L16 20L8.5 13.5L16 7Z"
          fill="url(#brandLogoGradPrimary)"
          className="transition-opacity duration-300 group-hover:opacity-90"
        />

        {/* Ascending focus core apex */}
        <path
          d="M16 14L20 18.5L16 25L12 18.5L16 14Z"
          fill="#ffffff"
          fillOpacity="0.9"
        />

        {/* Ambient center point */}
        <circle cx="16" cy="16" r="1.5" fill="#0071e3" />
      </svg>
    </div>
  );
};
