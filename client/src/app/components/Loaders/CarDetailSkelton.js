import React from "react";

export default function CarDetailSkelton() {
  return (
    <div className="py-4 px-4 w-[22rem] sm:w-[37rem] overflow-hidden rounded-lg bg-white relative animate-pulse">
      {/* Close Button Skeleton */}
      <span className="absolute top-2 right-3 h-6 w-6 bg-gray-300 rounded-full"></span>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Carousel Skeleton */}
        <div className="w-full h-[15rem] bg-gray-200 rounded-lg"></div>

        {/* Details Skeleton */}
        <div className="flex flex-col gap-4 px-4 py-4">
          {/* Title Skeleton */}
          <div className="h-6 w-3/4 bg-gray-300 rounded-md"></div>

          {/* Price Skeleton */}
          <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>

          {/* Info Row Skeleton */}
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 w-1/4 bg-gray-300 rounded-md"></div>
            <div className="h-5 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
