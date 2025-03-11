// src/components/Hero/index.tsx
const Hero = () => {
  return (
    <section className="relative bg-white py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 md:gap-12 lg:gap-16">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          {/* Explore Hackathon Button */}
          <span className="bg-gray-900 text-yellow font-bold px-6 py-2 rounded-full text-sm inline-block mb-4">
            Explore Hackathon
          </span>

          <h1 className="text-4xl md:text-5xl font-bold">
            Discover Breakthrough Ideas at FPTU Hackathon
          </h1>
          <p className="mt-4 text-gray-600">
            Join FPTU students on a journey of creativity and innovation.
          </p>
          <button className="mt-6 px-6 py-3 bg-purple-600 text-white text-sm rounded-full font-medium hover:bg-purple-700 transition">
            Get Started
          </button>
        </div>

        {/* Right Images & Background SVG */}
        <div className="md:w-1/2 flex justify-center relative mt-8 md:mt-0">
          {/* Background World SVG */}
          <div className="absolute inset-0 flex justify-center items-center -z-10">
            <img
              src="/images/hero/world-map.svg"
              className="w-80 opacity-20"
              alt="World Background"
            />
          </div>

          {/* Image Layout: 2-Column Grid */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Left Column (6/12 width) */}
            <div className="col-span-6 flex flex-col gap-4">
              <img
                src="/images/hero/hackathon1.png"
                className="w-full rounded-lg shadow-lg"
                alt="Hackathon 1"
              />
              <img
                src="/images/hero/hackathon2.png"
                className="w-full rounded-lg shadow-lg"
                alt="Hackathon 2"
              />
            </div>

            {/* Right Column (6/12 width, Centered Image) */}
            <div className="col-span-6 flex justify-center">
              <img
                src="/images/hero/hackathon3.png"
                className="w-full rounded-lg shadow-lg"
                alt="Hackathon 3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
