import express from 'express';
import { registerGarage,loginGarage, appointmentsGarage, appointmentCancel, garageList, changeAvailablity, appointmentComplete, garageDashboard, garageProfile, updateGarageProfile } from '../controllers/garageController.js';
import authGarage from '../middleware/authGarage.js';
const garageRouter = express.Router();

garageRouter.post("/register", registerGarage)
garageRouter.post("/login", loginGarage)
garageRouter.post("/cancel-appointment", authGarage, appointmentCancel)
garageRouter.get("/appointments", authGarage, appointmentsGarage)
garageRouter.get("/list", garageList)
garageRouter.post("/change-availability", authGarage, changeAvailablity)
garageRouter.post("/complete-appointment", authGarage, appointmentComplete)
garageRouter.get("/dashboard", authGarage, garageDashboard)
garageRouter.get("/profile", authGarage, garageProfile)
garageRouter.post("/update-profile", authGarage, updateGarageProfile)

export default garageRouter;