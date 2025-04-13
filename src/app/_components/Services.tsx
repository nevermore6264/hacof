// src/app/_components/Services.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import Image from 'next/image';

const services = [
  {
    illustration: "/images/service/manage.png", // Replace with actual icons
    title: "Manage Registrations",
    subtitle: "Easy registration and progress tracking",
  },
  {
    illustration: "/images/service/organization.png",
    title: "Efficient Organization",
    subtitle: "Tools for scheduling and notifications",
  },
  {
    illustration: "/images/service/collaboration.png",
    title: "Team Collaboration",
    subtitle: "Seamless communication for teams",
  },
  {
    illustration: "/images/service/insights.png",
    title: "Real-time Insights",
    subtitle: "Track hackathon progress with analytics",
  },
];

const Services = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        scrollRight();
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(currentSlide - 1, 0);
    scrollTo(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(currentSlide + 1, services.length - 1);
    scrollTo(newIndex);
  };

  // Handle scroll end to update current slide
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const slideWidth = scrollRef.current.offsetWidth;
        const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
        setCurrentSlide(newIndex);
      }
    };

    scrollRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-8 md:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10">
          {/* Left Content */}
          <div className="w-full lg:w-1/3 text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-sm font-semibold text-pink-500 tracking-wide uppercase">
              SERVICES
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              A platform for managing hackathon competitions exclusively for FPTU
              students.
            </p>
          </div>

          {/* Right Slideshow */}
          <div className="w-full lg:w-2/3 relative">
            {/* Slider Container */}
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory overflow-hidden scroll-smooth"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="min-w-full flex-shrink-0 px-2 md:px-4"
                  >
                    <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex justify-center items-center mb-4 md:mb-6 bg-pink-50 rounded-full">
                          <Image
                            src={service.illustration}
                            alt={service.title}
                            width={48}
                            height={48}
                            className="w-8 h-8 md:w-12 md:h-12 object-contain"
                          />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={scrollLeft}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  }`}
                disabled={currentSlide === 0}
              >
                <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${currentSlide === services.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                  }`}
                disabled={currentSlide === services.length - 1}
              >
                <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-pink-500 w-4 md:w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
