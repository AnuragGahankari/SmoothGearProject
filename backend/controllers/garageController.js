import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"
import garageRegister from "../models/garageRegister.js"
import garageModel from "../models/garageModel.js";
import appointmentModel from "../models/appointmentModel.js";


const registerGarage = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register garage
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing garage password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const garageData = {
            name,
            email,
            password: hashedPassword,
        }

        const newGarage = new garageRegister(garageData)
        const garage = await newGarage.save()
        const token = jwt.sign({ id: garage._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API for doctor Login 
const loginGarage = async (req, res) => {

    try {

        const { email, password } = req.body
        const garage = await garageRegister.findOne({ email })

        if (!garage) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, garage.password)

        if (isMatch) {
            const token = jwt.sign({ id: garage._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsGarage = async (req, res) => {
    try {

        const { garId } = req.body
        const appointments = await appointmentModel.find({ garId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { garId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.garId === garId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { garId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.garId === garId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const garageList = async (req, res) => {
    try {

        const garages = await garageModel.find({}).select(['-password', '-email'])
        res.json({ success: true, garages })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { garId } = req.body

        const docData = await garageModel.findById(garId)
        await garageModel.findByIdAndUpdate(garId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const garageProfile = async (req, res) => {
    try {

        const { garId } = req.body
        const profileData = await garageModel.findById(garId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateGarageProfile = async (req, res) => {
    try {

        const { garId, fees, address, available } = req.body

        await garageModel.findByIdAndUpdate(garId, { charges, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const garageDashboard = async (req, res) => {
    try {

        const { garId } = req.body

        const appointments = await appointmentModel.find({ garId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!customers.includes(item.garageId)) {
                customers.push(item.garageId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginGarage,
    appointmentsGarage,
    appointmentCancel,
    garageList,
    changeAvailablity,
    appointmentComplete,
    garageDashboard,
    garageProfile,
    updateGarageProfile,
    registerGarage
}