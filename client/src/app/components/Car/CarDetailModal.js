"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Carousel from "./Carousel";
import CarDetailSkelton from "../Loaders/CarDetailSkelton";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function CarDetailModal({
  loading,
  carDetail,
  setIsDetails,
  getCarModels,
}) {
  const [show, setShow] = useState(false);
  // /:id

  // ------Delete User------>
  const handleDeleteConfirmation = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(carId);
        Swal.fire("Deleted!", "Car has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (carId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/cars/delete_Model/${carId}`
      );
      if (data) {
        getCarModels();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsDetails(false);
    }
  };

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
            <div className="w-full h-[42vh] sm:h-[60vh]">
              <Carousel banners={carDetail?.images} />
            </div>

            <div className="px-3 sm:px-6 py-4 bg-white ">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {carDetail?.carModel}
                </h3>
                <div className="relative">
                  <div
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="bg-gray-100 hover:bg-red-200 p-1 rounded-full hover:shadow-md text-black hover:text-red-600 transition-all duration-200 cursor-pointer"
                  >
                    <BsThreeDotsVertical className="text-[20px]" />
                  </div>
                  {show && (
                    <div className="absolute top-2 right-7 w-[11rem] border bg-gray-50 border-gray-200 z-20 px-2 py-2 rounded-sm flex flex-col gap-2 ">
                      {/* <button className="w-full cursor-pointer text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-yellow-100 transition-all duration-200 rounded-sm p-1">
                        <span className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]">
                          <MdModeEditOutline className="text-[16px] text-white" />
                        </span>
                        <div className="flex flex-col items-start w-full ">
                          <span className="text-[13px] text-gray-800 font-medium">
                            Edit
                          </span>
                          <span className="text-gray-500 text-[12px]">
                            Edit Blog
                          </span>
                        </div>
                      </button> */}

                      <button
                        onClick={() => handleDeleteConfirmation(carDetail._id)}
                        className="w-full cursor-pointer text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-red-100 transition-all duration-200 rounded-sm p-1"
                      >
                        <span className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]">
                          <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
                        </span>
                        <div className="flex flex-col items-start w-full ">
                          <span className="text-[13px] text-gray-800 font-medium">
                            Delete
                          </span>
                          <span className="text-gray-500 text-[12px]">
                            Delete blog
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
