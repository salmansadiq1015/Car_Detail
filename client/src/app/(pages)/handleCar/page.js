"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FiUploadCloud } from "react-icons/fi";
import { TbLoader3 } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/authContext";
import { IoArrowBackOutline } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";

export default function AddNewRecord() {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCopies, setSelectedCopies] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { auth } = useAuth();
  const userId = auth?.user?.id;
  const router = useRouter();
  const [load, setLoad] = useState(false);

  //   <----------Validate User---------->
  useEffect(() => {
    if (!auth.token) {
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 400);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line
  }, [auth.token, router]);

  //   <-------------Field Data--------->
  const cities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Fasilabad",
    "Multan",
    "Vehari",
    "Murree",
  ];
  const numbers = ["Select", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  // Upload Images in Cloudinary

  const postDetails = (fileArray) => {
    setLoad(true);

    if (!fileArray || fileArray.length === 0) {
      toast.error("Please select at least one Image!");
      setLoad(false);
      return;
    }

    const formDataArray = fileArray?.map((image) => {
      if (image.size <= 20 * 1024 * 1024) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Robbito pic");
        formData.append("cloud_name", "dbdbfg1qw");
        return formData;
      } else {
        toast.error(
          "One or more selected files exceed the maximum size of 4MB!",
          {
            duration: 3000,
          }
        );
        setLoad(false);
        throw new Error("File size exceeded.");
      }
    });

    Promise.all(
      formDataArray.map(async (formData) => {
        return fetch("https://api.cloudinary.com/v1_1/dbdbfg1qw/image/upload", {
          method: "post",
          body: formData,
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error("Error uploading image:", err);
            toast.error("Error uploading image");
            throw err;
          });
      })
    )
      .then((uploadedImages) => {
        const imageUrls = uploadedImages.map((data) => data.url.toString());
        console.log("Files:", imageUrls);
        setImages((prevImages) => {
          const newImages = [...prevImages, ...imageUrls];
          return newImages.slice(0, selectedCopies);
        });
        // setImages((prevImages) => [...prevImages, ...imageUrls]);
        setLoad(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setLoad(false);
      });
  };

  //   <-----------------Validation Schema---------------->

  const validationSchema = Yup.object().shape({
    carModel: Yup.string()
      .required("Car model is required!")
      .min(3, "Car mondel must be at least 3 characters"),
    price: Yup.number()
      .required("Price is required!")
      .positive("Price must be positive"),
    phone: Yup.string()
      .required("Phone number is required!")
      .min(11, "Phone number must be at least 11 characters!")
      .max(11, "Phone number must be 11 characters"),
    selectedCity: Yup.string().required("City is required!"),
    selectedCopies: Yup.number().required("Number of copies is required!"),
    images: Yup.array().min(1, "At least one image is required!"),
  });

  //   <------------------Handle Create Record------------------>
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      return toast.error("User Id is required!");
    }
    try {
      setLoading(true);
      await validationSchema.validate(
        { carModel, price, phone, selectedCity, selectedCopies, images },
        { abortEarly: false }
      );

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/cars/upload_model`,
        {
          carModel,
          price,
          phone,
          images,
          userId: auth.user.id,
          city: selectedCity,
        }
      );

      if (data?.success) {
        toast.success("Car data added successfully!");
        router.push("/cars");
        setLoading(false);
        setCarModel("");
        setImages([]);
        setPhone("");
        setPrice("");
        setSelectedCity("");
        setSelectedCopies("");
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const yupErrors = {};
        error.inner.forEach((err) => {
          yupErrors[err.path] = err.message;
        });
        setErrors(yupErrors);
        setLoading(false);
      } else {
        console.log(error);
        toast.error(error?.response?.data?.message, { duration: 2000 });
        setLoading(false);
      }
    }
  };

  //   Handle Drop Image
  const handleDrop = (url) => {
    const newImages = images.filter((img) => img !== url);
    setImages(newImages);
  };

  return (
    <div className="w-full  py-8 px-2 sm:px-5 flex items-center justify-center bg-gray-100">
      <div className="absolute top-3 left-3 cursor-pointer">
        <span
          title="back"
          className="flex items-center gap-6 p-1 rounded-full bg-gray-200 hover:bg-sky-300/50 transition-all duration-300"
        >
          <IoArrowBackOutline
            className="w-5 h-5 text-gray-700 hover:text-sky-600 cursor-pointer"
            onClick={() => router.push("/cars")}
          />
        </span>
      </div>
      <div className="w-[98%] sm:w-[60%] mt-4 sm:mt-0 py-4 px-2 sm:px-4 rounded-md border hover:shadow-md bg-white flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-center ">
          Add <span className="tgradient"> New Car</span> Model
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full mt-4 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[14px] font-normal text-gray-700">
                Car Model <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Enter Car Model"
                autoFocus
                required
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-500 focus:border-sky-500"
              />
              {errors.carModel && (
                <span className="text-red-500">{errors.carModel}</span>
              )}
            </div>
            {/* Price */}
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[14px] font-normal text-gray-700">
                Price <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                placeholder="Enter Car Price"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-500 focus:border-sky-500"
              />
              {errors.price && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </div>
          </div>
          {/* City */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[14px] font-normal text-gray-700">
              City <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center flex-wrap gap-3  sm:gap-4 ml-3">
              {cities.map((city) => (
                <div key={city} className="flex items-center gap-2 ">
                  <input
                    type="radio"
                    id={city}
                    name="city"
                    required
                    value={city}
                    checked={selectedCity === city}
                    onChange={() => handleCityChange(city)}
                  />
                  <label htmlFor={city} className="text-[15px]">
                    {city}
                  </label>
                </div>
              ))}
            </div>
            {errors.selectedCity && (
              <span className="text-red-500">{errors.selectedCity}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[14px] font-normal text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </span>
              <input
                type="number"
                placeholder="Phone Number"
                value={phone}
                required
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, "");
                  if (inputValue.length <= 11) {
                    setPhone(inputValue);
                  }
                }}
                className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-500 focus:border-sky-500"
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone}</span>
              )}
            </div>

            {/*  */}
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[14px] font-normal text-gray-700">
                No. of Copies <span className="text-red-500">*</span>
              </span>
              <select
                value={selectedCopies}
                onChange={(e) => setSelectedCopies(e.target.value)}
                className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-500 focus:border-sky-500"
              >
                {numbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              {errors.selectedCopies && (
                <span className="text-red-500">{errors.selectedCopies}</span>
              )}
            </div>
          </div>

          {/* Upload Image */}

          <div className="flex items-center flex-wrap gap-4">
            <input
              type="file"
              id="selectImage"
              accept="image/*"
              multiple
              onChange={(e) => postDetails([...e.target.files])}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-[14px] font-normal text-gray-700">
                Upload Images <span className="text-red-500">*</span>
              </span>
              <label
                htmlFor="selectImage"
                title="Upload Images"
                className="w-[3rem] h-[3rem] rounded-full border-2 border-dashed border-sky-500 hover:shadow-md shadow-gray-300 hover:drop-shadow-md cursor-pointer flex items-center justify-center flex-col gap-2"
              >
                {load ? (
                  <ImSpinner9 className="w-5 h-5 animate-spin text-sky-500" />
                ) : (
                  <span className="flex flex-col items-center justify-center gap-2">
                    <FiUploadCloud className="w-8 h-8 text-sky-500" />
                  </span>
                )}
              </label>
            </div>

            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-[5rem] h-[5rem] overflow-hidden border shadow-gray-300 filter hover:drop-shadow-md rounded-md hover:shadow-md transition-all duration-500 hover:scale-110 object-fill"
              >
                <div className="absolute top-[.1rem] right-[.1rem] z-40 cursor-pointer">
                  <IoMdCloseCircleOutline
                    className="h-5 w-5  hover:text-red-500  transition-all duration-300 "
                    onClick={() => handleDrop(img)}
                  />
                </div>
                <Image
                  src={img}
                  alt={`Image ${index + 1}`}
                  fill
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-5">
            <button
              className={`w-[5rem] flex items-center justify-center gap-1 text-[14px] rounded-sm mt-4 h-[2rem] cursor-pointer shadow-md hover:shadow-gray-300  border-2 border-red-500 hover:border-red-600 text-red-500 hover:text-red-600 outline-none hover:scale-105 transition-all duration-300
             `}
            >
              Cancel
            </button>
            <button
              className={`w-[5.5rem] flex items-center justify-center gap-1 text-[14px] rounded-sm mt-4 h-[2rem] cursor-pointer shadow-md shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-600/40 transition-all duration-300  bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-700 hover:to-indigo-600 transform hover:scale-105 text-white hover:text outline-none ${
                loading && "animate-pulse pointer-events-none"
              }`}
            >
              {loading ? (
                <TbLoader3 className="h-5 w-5 text-white animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
