import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'HR', 'Staff'], default: 'Staff', required: true },
    image: { type: String },
  },
  { timestamps: true } 
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
