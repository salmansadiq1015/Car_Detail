"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import Carousel from "./Carousel";
import CarDetailSkelton from "../Loaders/CarDetailSkelton";

export default function CarDetailModal({ loading, carDetail, setIsDetails }) {
  return (
    <div>
      {" "}
      {loading ? (
        <CarDetailSkelton />
      ) : (
        <div className="py-4 px-4 w-full overflow-hidden rounded-lg bg-white relative">
          <span
            className="absolute top-2 right-3 cursor-pointer text-black hover:text-red-700 z-[10] hover:rotate-[180deg] p-1 rounded-full bg-gray-200/70 hover:bg-gray-300/70 transition-all duration-200 "
            onClick={() => setIsDetails(false)}
          >
            <IoClose className="h-4 w-4  cursor-pointer" />
          </span>
          <div className="flex flex-col gap-4 mt-5">
            <div className="w-full h-[45vh] sm:h-[60vh]">
              <Carousel banners={carDetail?.images} />
            </div>

            <div className="px-6 py-4 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                {carDetail?.carModel}
              </h3>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3  gap-3">
                <div className="text-sm font-medium text-gray-600">
                  <span className="block px-3 py-1 bg-sky-100 rounded-3xl w-fit text-[14px]">
                    Price
                  </span>
                  <span className="text-base text-gray-800 ml-1 mt-1">
                    ${carDetail?.price}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  <span className="block px-3 py-1 bg-green-100 rounded-3xl w-fit text-[14px]">
                    City
                  </span>
                  <span className="text-base text-gray-800 ml-1 mt-1">
                    {carDetail?.city}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  <span className="block px-3 py-1 bg-pink-100 rounded-3xl w-fit text-[14px]">
                    Contact
                  </span>
                  <span className="text-base text-gray-800 ml-1 mt-1">
                    {carDetail?.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
