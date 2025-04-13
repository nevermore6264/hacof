// src/app/_components/FeaturedHackathons.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Image from 'next/image';
//TODO: {lv1} maybe change react-icons/fa to another approach, to minimize bundle size
const hackathons = [
  {
    title: "HACKCOVY - Online Hackathon",
    startDate: "24/04/2024",
    endDate: "26/04/2024",
    description:
      "HACKCOVY is an online hackathon designed to foster innovation.",
    image: "/images/featuredHackathons/hackathon1.png",
  },
  {
    title: "Hackathon 2024",
    startDate: "25/04/2024",
    endDate: "27/04/2024",
    description:
      "Join the most exciting hackathon of the year with top mentors!",
    image: "/images/featuredHackathons/hackathon2.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon3.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
  {
    title: "Future Innovators Hack",
    startDate: "30/04/2024",
    endDate: "02/05/2024",
    description:
      "Innovate and solve real-world problems with creative solutions.",
    image: "/images/featuredHackathons/hackathon4.png",
  },
];

const FeaturedHackathons = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const cardWidth = slideWidth / 4; // Show 4 cards on desktop
      scrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left"
      ? Math.max(currentIndex - 1, 0)
      : Math.min(currentIndex + 1, hackathons.length - 4); // Show 4 cards
    scrollTo(newIndex);
  };

  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % (hackathons.length - 3);
        scrollTo(nextIndex);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header with "View All" Link */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
            Featured Hackathons
            <span className="block w-12 h-1 bg-blue-500 mt-2"></span>
          </h2>
          <Link
            href="/hackathon"
            className="text-blue-500 text-sm hover:underline"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-hidden gap-3 md:gap-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {hackathons.map((hack, index) => (
              <div
                key={index}
                className="min-w-[160px] md:min-w-[220px] flex-shrink-0"
              >
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="relative h-24 md:h-32 w-full">
                    <Image
                      src={hack.image}
                      alt={hack.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                      {hack.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-600 mb-1">
                      From: {hack.startDate} &nbsp;&nbsp; To: {hack.endDate}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 line-clamp-2">
                      {hack.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-6 h-6 md:w-8 md:h-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-6 h-6 md:w-8 md:h-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${currentIndex === hackathons.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === hackathons.length - 4}
          >
            <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-3 md:mt-4 gap-1 md:gap-1.5">
          {[...Array(hackathons.length - 3)].map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-500 w-3 md:w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHackathons;
