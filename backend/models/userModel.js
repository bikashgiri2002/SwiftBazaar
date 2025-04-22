import mongoose from "mongoose";
import Address from "./addressModel.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
     // For email verification
     isVerified: { type: Boolean, default: false },
     otp: String,
     otpExpires: Date,

     // For password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

export default user;