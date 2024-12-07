import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function Carousel({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality with cleanup
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [banners]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <div
          key={banner._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner || "/placeholder-image.webp"}
            layout="intrinsic"
            width={1000} // Adjust width according to your needs
            height={450} // Adjust height according to your needs
            alt={`Banner ${index + 1}`}
            className="rounded-lg object-cover transition-transform duration-700 ease-in-out group-hover:scale-125 group-hover:opacity-90"
          />
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gray-800 hover:bg-black bg-opacity-50 transition-all duration-300 text-white rounded-full focus:outline-none focus:ring focus:ring-sky-600"
      >
        <FaAngleLeft className="h-4 w-4 hover:text-sky-600" />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-gray-800 hover:bg-black bg-opacity-50 transition-all duration-300 text-white rounded-full focus:outline-none focus:ring focus:ring-sky-600"
      >
        <FaAngleRight className="h-4 w-4 hover:text-sky-600" />
      </button>
    </div>
  );
}
