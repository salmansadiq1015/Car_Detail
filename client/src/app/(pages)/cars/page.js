"use client";
import { useAuth } from "@/app/utils/authContext";
import Loader from "@/app/utils/Loader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import Image from "next/image";
import CarDetailModal from "@/app/components/Car/CarDetailModal";

export default function Cars() {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState([]);
  const [isDetail, setIsDetails] = useState(false);
  const [carDetail, setCarDetail] = useState([]);

  useEffect(() => {
    if (!auth.token) {
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 400);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line
  }, [auth.token, router]);

  // ALl Car Models

  const getCarModels = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/cars/allCars`
      );
      console.log("data:", data);
      setCarData(data.cars);
      console.log("cars:", data.cars);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCarModels();
  }, []);

  // Get Single Car
  const getCarDetail = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/cars/single_Model/${id}`
      );
      setCarDetail(data.car);
      console.log("cars:", data);
      console.log("carsD:", carDetail);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    router.push("/");
    setAuth({ ...auth, user: "", token: "" });
    localStorage.clear("auth");
    toast.success("Logout successfully!");
  };

  return (
    <div className="w-full min-h-screen py-4 px-4 relative">
      {/* Logout */}
      <span
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleLogout}
        title="Logout"
      >
        <RiLogoutCircleRLine className="h-6 w-6 text-sky-600 hover:text-red-600 transition-all duration-150" />
      </span>
      {/* Main */}
      <div className="w-full h-full flex flex-col justify-center items-start">
        <h1 className="tgradient text-3xl font-bold text-start">Cars Models</h1>
        <div className="w-full flex items-center justify-end  mr-2 sm:mr-8">
          <button
            className="py-[.4rem] px-4 rounded-full text-[14px] cursor-pointer shadow-lg shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-600/40 transition-all duration-300 flex items-center justify-center text-white bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-700 hover:to-indigo-600 transform hover:scale-105"
            onClick={() => router.push("/handleCar")}
          >
            <FiPlus className="h-4 w-4 text-white mr-1" />
            Add New
          </button>
        </div>
        <hr className="w-full h-[1px] my-3 bg-gray-300" />
        {/* ----------------Car Details----------- */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-4 w-full min-h-screen">
            {/* All Car Models */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {carData &&
                carData?.map((car) => (
                  <div
                    className="w-full h-full rounded-lg shadow-lg border bg-white border-gray-200 overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    key={car?._id}
                    onClick={() => {
                      getCarDetail(car?._id), setIsDetails(true);
                    }}
                  >
                    <div className="w-full h-[15rem] relative overflow-hidden group">
                      <Image
                        src={car?.images[0]}
                        fill
                        alt="Banner"
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-125 group-hover:opacity-90"
                      />
                    </div>

                    <div className="flex flex-col gap-2 px-4 py-4">
                      <h3 className="font-semibold text-lg text-gray-800 hover:text-sky-600 transition-all duration-200">
                        {car?.carModel}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[14px] font-medium  text-gray-700">
                          ${car?.price}
                        </span>
                        <span className="text-sm font-medium text-gray-500 py-1 px-4 bg-green-200 rounded-3xl">
                          {car?.city || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>{" "}
      {/* --------------------Details------------- */}
      {isDetail && (
        <div className="fixed top-0 right-0 py-4 px-2 sm:px-4 w-full h-full z-[9] bg-black/70 flex items-center justify-center">
          <div className="w-[37rem]">
            <CarDetailModal
              loading={loading}
              carDetail={carDetail}
              setIsDetails={setIsDetails}
              getCarModels={getCarModels}
            />
          </div>
        </div>
      )}
    </div>
  );
}
