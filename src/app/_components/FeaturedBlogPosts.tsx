// src/app/_components/FeaturedBlogPosts.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Image from 'next/image';

const blogPosts = [
  {
    title: "Hackathon là gì?",
    description:
      "Trong thế giới số hiện nay, Hackathon là một thuật ngữ phổ biến bắt nguồn từ việc kết hợp 'hack' và 'marathon'...",
    image: "/images/featuredBlogPosts/blog1.png",
    link: "/blog/hackathon-la-gi",
  },
  {
    title: "Hướng dẫn tham gia hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog2.png",
    link: "/blog/huong-dan-tham-gia-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
  {
    title: "Quy chế thi Hackathon",
    description:
      "Hackathon (còn được gọi là một ngày hack, hackfest hoặc codefest) là một sự kiện thi đấu lập trình...",
    image: "/images/featuredBlogPosts/blog3.png",
    link: "/blog/quy-che-thi-hackathon",
  },
];

const FeaturedBlogPosts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const cardWidth = slideWidth / 3; // Show 3 cards on desktop
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
      : Math.min(currentIndex + 1, blogPosts.length - 3);
    scrollTo(newIndex);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % (blogPosts.length - 2);
        scrollTo(nextIndex);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  return (
    <section className="py-4 md:py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-2 md:px-3">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 relative">
            Featured Blog Posts
            <span className="block w-6 h-0.5 bg-blue-500 mt-1"></span>
          </h2>
          <Link href="/blog" className="text-blue-500 text-[10px] md:text-xs hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-hidden gap-2 md:gap-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="min-w-[80px] md:min-w-[140px] flex-shrink-0"
              >
                <Link href={post.link}>
                  <div className="bg-white shadow-sm rounded overflow-hidden transform transition-all duration-300 hover:scale-105">
                    <div className="relative h-32 md:h-48 w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1.5 md:p-2">
                      <h3 className="text-[9px] md:text-[10px] font-bold text-gray-900 mb-0.5 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[7px] md:text-[8px] text-gray-600 line-clamp-2 leading-tight">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-6 h-6 md:w-8 md:h-8 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 md:-right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-6 h-6 md:w-8 md:h-8 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 ${currentIndex === blogPosts.length - 3 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === blogPosts.length - 3}
          >
            <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
          </button>
        </div>

        <div className="flex justify-center mt-2 md:mt-3 gap-1">
          {[...Array(blogPosts.length - 2)].map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-500 w-3 md:w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
