import React, { useState } from 'react';

interface AptusLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'colored';
  glowing?: boolean;
}

export const AptusLogo: React.FC<AptusLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'colored',
  glowing = true
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState('https://lh3.googleusercontent.com/d/1OcFttaO3UODA4mCXnfCOonaJ8QXPBmaM');

  const dimensions = {
    sm: { icon: 'w-8 h-8', title: 'text-xs', subtitle: 'text-[9px]' },
    md: { icon: 'w-10 h-10', title: 'text-sm', subtitle: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', title: 'text-lg', subtitle: 'text-xs' },
    xl: { icon: 'w-20 h-20', title: 'text-2xl', subtitle: 'text-sm' }
  }[size];

  const handleImageError = () => {
    if (imgSrc.includes('lh3.googleusercontent.com')) {
      // Fallback to Drive thumbnail API URL
      setImgSrc('https://drive.google.com/thumbnail?id=1OcFttaO3UODA4mCXnfCOonaJ8QXPBmaM&sz=w1000');
    } else {
      setImgError(true);
    }
  };

  const isDarkOrColored = variant === 'dark' || variant === 'colored';

  return (
    <div className={`flex items-center gap-3 font-sans select-none relative ${className}`}>
      {/* Radiant Glowing Background Pulse Aura */}
      {glowing && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f05a24]/50 via-[#0284c7]/40 to-[#f05a24]/50 blur-lg opacity-90 animate-pulse pointer-events-none scale-125" />
      )}

      {/* Official Aptus Logo Image Container */}
      <div className={`relative shrink-0 ${dimensions.icon} flex items-center justify-center p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl border border-orange-500/40 dark:border-orange-400/50 backdrop-blur-md overflow-hidden group transition-all duration-300 ${
        glowing ? 'shadow-[0_0_25px_rgba(240,90,36,0.6)] ring-2 ring-[#f05a24]/50' : ''
      }`}>
        {!imgError ? (
          <img
            src={imgSrc}
            alt="لوگو شرکت ساختمانی آپتوس ایران"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={handleImageError}
            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(240,90,36,0.7)] group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="20" y="10" width="60" height="80" rx="4" fill="#032b75" stroke="#0f3b8e" strokeWidth="3" />
            <rect x="32" y="22" width="36" height="56" rx="2" fill={variant === 'dark' ? '#0a192f' : '#ffffff'} />
            <path d="M 12 75 L 50 25 L 88 75 L 75 80 L 50 43 L 25 80 Z" fill="url(#aptusOrangeGradient)" />
            <defs>
              <linearGradient id="aptusOrangeGradient" x1="12" y1="25" x2="88" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f05a24" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-right z-10">
          <div className={`font-black tracking-tight ${dimensions.title} flex items-center gap-1.5`}>
            {/* Aptu S (آپتوس) - Bright Radiant Sky Cyan Blue */}
            <span className={
              isDarkOrColored
                ? "text-[#38bdf8] dark:text-[#38bdf8] drop-shadow-[0_0_14px_rgba(56,189,248,0.85)] font-black tracking-wide"
                : "text-[#032b75] dark:text-[#38bdf8] font-black"
            }>
              آپتـوس
            </span>

            {/* Iran (ایران) - Vivid Radiant Glowing Orange */}
            <span className={
              isDarkOrColored
                ? "text-[#f05a24] text-[0.85em] font-extrabold drop-shadow-[0_0_12px_rgba(240,90,36,0.85)]"
                : "text-[#f05a24] text-[0.8em] font-bold"
            }>
              ایـران
            </span>
          </div>

          <span className={`font-bold ${dimensions.subtitle} leading-none mt-1 ${
            isDarkOrColored ? 'text-slate-200 dark:text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-slate-600 dark:text-slate-300'
          }`}>
            شرکت ساختمانی آپتوس ایران
          </span>
        </div>
      )}
    </div>
  );
};

