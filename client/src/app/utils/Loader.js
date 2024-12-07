import React from "react";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 w-full min-h-screen">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full h-full rounded-md shadow-md bg-gray-200 animate-pulse overflow-hidden"
          >
            <div className="w-full h-[15rem] bg-gray-300"></div>
            <div className="flex flex-col gap-2 px-4 py-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
    </div>
  );
}
