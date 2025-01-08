import mongoose from "mongoose";

const garageRegisterschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // image: { type: String, required: true },
    // speciality: { type: String, required: true },
    // // degree: { type: String, required: true },
    // experience: { type: String, required: true },
    // about: { type: String, required: true },
    // available: { type: Boolean, default: true },
    // charges: { type: Number, required: true },
    // slots_booked: { type: Object, default: {} },
    // address: { type: Object, required: true },
    // date: { type: Number, required: true },
}, { minimize: false })

const garageRegister = mongoose.models.garage || mongoose.model("garage", garageRegisterschema);
export default garageRegister;