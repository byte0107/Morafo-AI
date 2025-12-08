import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', invert?: boolean }> = ({ size = 'md', invert = false }) => {
  const dims = {
    sm: { w: 32, h: 32 },
    md: { w: 48, h: 48 },
    lg: { w: 64, h: 64 }
  };
  
  const { w, h } = dims[size];
  const colorPrimary = invert ? '#ffffff' : '#16a34a'; // green-600
  const colorSecondary = invert ? '#f0fdf4' : '#15803d'; // green-700
  const colorAccent = '#eab308'; // yellow-500 for sun/crop

  return (
    <div style={{ width: w, height: h }} className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Leaf/Roof Concept */}
        <path d="M50 10C30 10 15 25 10 40C10 40 25 35 50 35C75 35 90 40 90 40C85 25 70 10 50 10Z" fill={colorAccent} opacity="0.9" />
        
        {/* The M Shape formed by fields/hills */}
        <path d="M20 90V45L50 65L80 45V90" stroke={colorPrimary} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Central Leaf/Crop Sprout */}
        <path d="M50 65V35" stroke={colorPrimary} strokeWidth="6" strokeLinecap="round" />
        <path d="M50 45C50 45 60 40 60 30" stroke={colorPrimary} strokeWidth="4" strokeLinecap="round" />
        <path d="M50 50C50 50 40 45 40 35" stroke={colorPrimary} strokeWidth="4" strokeLinecap="round" />
        
        {/* Base / Earth */}
        <path d="M15 90H85" stroke={colorSecondary} strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Logo;