import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addGarage, allGarages, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/garageController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-garage", authAdmin, upload.single('image'), addGarage)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-garages", authAdmin, allGarages)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;