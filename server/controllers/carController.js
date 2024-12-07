import userModel from "../models/userModel.js";
import carModels from "../models/carModel.js";

// Create
export const uploadCarModel = async (req, res) => {
  try {
    const { userId, carModel, price, phone, images, city } = req.body;

    // Validate
    const requiredFields = [
      { field: carModel, message: "Car Model is Required!" },
      { field: price, message: "Price is Required!" },
      { field: phone, message: "Phone is Required!" },
      { field: images, message: "At least one is Required!" },
    ];

    for (let { field, message } of requiredFields) {
      if (!field) {
        return res.status(400).send({
          success: false,
          message,
        });
      }
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const car = await carModels.create({
      user: userId,
      carModel,
      price,
      phone,
      images,
      city,
    });

    res.status(200).send({
      success: true,
      message: "Car model added successfully!",
      data: car,
    });
  } catch (error) {
    console.error("Error in uploading car model:", error);
    res.status(500).send({
      success: false,
      message: "Error in upload car model!",
      error,
    });
  }
};
// Update Car Detail
export const updateCarInfo = async (req, res) => {
  try {
    const carId = req.params.id;
    const { carModel, price, phone, images, city } = req.body;

    const existingCar = await carModel.findById(carId);

    if (!existingCar) {
      return res.status(404).send({
        success: false,
        message: "Car not found!",
      });
    }

    const updateCarInfo = await carModels.findByIdAndUpdate(
      { _id: existingCar._id },
      {
        carModel,
        price,
        phone,
        images,
        city,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Car info update successfully!",
      carInfo: updateCarInfo,
    });
  } catch (error) {
    console.error("Error in update car info:", error);
    res.status(500).send({
      success: false,
      message: "Error in update car info!",
      error,
    });
  }
};

// Get All Cars Models
export const getAllCarModels = async (req, res) => {
  try {
    const cars = await carModels
      .find({})
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All Car Models",
      cars: cars,
    });
  } catch (error) {
    console.error("Error fetching car models:", error);
    res.status(500).send({
      success: false,
      message: "Error in get all car models!",
      error,
    });
  }
};

// Get car detail
export const getSingleCarModel = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Car id is required!",
      });
    }

    const car = await carModels.findById(id).populate("user");

    if (!car) {
      return res.status(400).send({
        success: false,
        message: "Car model not found!",
      });
    }

    res.status(200).send({
      success: true,
      car: car,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single car model!",
      error,
    });
  }
};

// Delete Car Model
export const deleteCarModel = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Car id is required!",
    });
  }

  try {
    const car = await carModels.findById(id).lean().exec();

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car model not found!",
      });
    }

    await carModels.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Car model deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting car model:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting car model!",
      error: error.message,
    });
  }
};
