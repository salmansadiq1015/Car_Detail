import express from "express";
import {
  deleteCarModel,
  getAllCarModels,
  getSingleCarModel,
  updateCarInfo,
  uploadCarModel,
} from "../controllers/carController.js";

const router = express.Router();

// Create
router.post("/upload_model", uploadCarModel);

// Update Info
router.put("/update/info/:id", updateCarInfo);

// Get All Car Models
router.get("/allCars", getAllCarModels);

// Get Single Model
router.get("/single_Model/:id", getSingleCarModel);

// Delete Model
router.delete("/delete_Model/:id", deleteCarModel);

export default router;
