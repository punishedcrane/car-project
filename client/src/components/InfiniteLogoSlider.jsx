import React from 'react';
import brandLogos from '../data/brandLogos';

const InfiniteLogoSlider = ({ logos = brandLogos, speed = 20, className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-50 py-8 ${className}`}>
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 font-goldman">
        Our Popular Brands
      </h1>

      {/* Scrolling logos */}
      <div className="inline-flex whitespace-nowrap">
        <div
          className="inline-flex items-center justify-center animate-infinite-scroll"
          style={{ '--speed': `${speed}s` }}
        >
          {logos.map((logo, index) => (
            <LogoItem key={`original-${index}`} logo={logo} />
          ))}
        </div>

        <div
          className="inline-flex items-center justify-center animate-infinite-scroll"
          aria-hidden="true"
          style={{ '--speed': `${speed}s` }}
        >
          {logos.map((logo, index) => (
            <LogoItem key={`duplicate-${index}`} logo={logo} />
          ))}
        </div>
      </div>

      {/* Inline animation style */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll var(--speed) linear infinite;
        }
      `}</style>
    </div>
  );
};

const LogoItem = ({ logo }) => (
  <div className="mx-8 w-32 flex-shrink-0">
    <img
      src={logo.src}
      alt={logo.alt}
      className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
      loading="lazy"
    />
  </div>
);

export default InfiniteLogoSlider;
