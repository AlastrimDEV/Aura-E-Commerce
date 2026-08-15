import React from 'react';

const Logo = ({ isLight = false, className = "h-8" }) => {
  const fillClass = isLight ? "fill-white text-white" : "fill-neutral-900 text-neutral-900";

  return (
    <div className={`flex items-center gap-2.5 select-none ${fillClass} ${className}`}>
      <svg className="h-6 w-6 transition-colors duration-300" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L36 34H28L20 18L12 34H4L20 4Z" fill="currentColor" />
        <circle cx="20" cy="23" r="2.5" fill={isLight ? "#0F172A" : "#FFFFFF"} />
      </svg>
      <span className="font-serif font-bold text-xl tracking-tight transition-colors duration-300">
        AURA
      </span>
    </div>
  );
};

export default Logo;
