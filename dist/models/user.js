import mongoose from "mongoose";
import Validator from "validator";
import { UserRole } from "../metadata/enum.js";
const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Please enter Name"],
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "Please enter email"],
        validate: Validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.USER
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of birth"],
    },
}, {
    timestamps: true,
});
UserSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", UserSchema);
