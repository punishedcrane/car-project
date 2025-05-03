// src/components/Slider.jsx
import React, { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    
    image: 'https://res.cloudinary.com/dysu1piy1/image/upload/v1745739203/Rent-A-Car-Facebook-Cover-21_qh6aow.jpg',
  },
  {
    id: 2,
    
    image: 'https://res.cloudinary.com/dysu1piy1/image/upload/v1745739134/Rent-A-Car-Facebook-Cover-13_sh34vi.jpg',
  },
  {
    id: 3,
    
    image: 'https://res.cloudinary.com/dysu1piy1/image/upload/v1745738523/e0b060ca-4c83-4669-9d21-a4f813114738_kyzet4.jpg',
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[400px] overflow-hidden relative">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-[400px] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <h2 className="text-white text-3xl md:text-5xl font-bold  px-4 py-2 rounded">
              {slide.text}
            </h2>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
