import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from "../config/cloudinary.js";
import 'dotenv/config'

export const registerUser = async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.file', req.file);

  const { firstName, lastName, phone, email, password, role } = req.body;

  if (!firstName || !lastName || !phone || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      role: role || "Staff", 
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Successfully registered" });

  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


   export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        });
    } catch (error) {
        console.error("Error while logging in", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateUser = async (req, res) => {
  console.log("Incoming req.body:", req.body);
  console.log("Incoming req.file:", req.file);
  try {
    const userId = req.params.id;

    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { firstName, lastName, phone, email, password } = req.body;
    let updateData = { firstName, lastName, phone, email };

    if (email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: "Email already in use by another user." });
      }
    }


    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "User" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Error while updating user", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: {
                id: deletedUser._id,
                firstName: deletedUser.firstName,
                lastName: deletedUser.lastName,
                email: deletedUser.email,
                role: deletedUser.role,
                image: deletedUser.image,
            }
        });
    } catch (error) {
        console.error("Error while deleting user", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error while logging out", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getUser = async (req, res) => {
        try{
            const userId = req.params.id;
            const user = await userModel.findById(userId).select('-password');
            if(!user) {
                return res.status(404).json({ success: false, message: "User not found"});
            
            }
            return res.status(200).json({
                success: true,
                user:{
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                }
            })
        }
        catch(error){
            console.error("Error while fetching user", error);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
}

    export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Error while fetching users", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAllStaff = async (req, res) => {
  try {
    const staffUsers = await userModel.find({ role: "Staff" }).select('-password');
    return res.status(200).json({
      success: true,
      users: staffUsers
    });
  } catch (error) {
    console.error("Error while fetching staff users", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
   try {
    const userId = req.user?.id || req.params.id || req.body.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const user = await userModel.findById(userId).select('firstName lastName image');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      }
    });
  } catch (error) {
    console.error("Error fetching user profile", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTotalStaff = async (req, res) => {
    try{
        const totalStaff = await userModel.countDocuments({ role: "Staff" });
        if(!totalStaff){
          return res.status(404).json({ success: false, message:"No staff found"});
        }
        return res.status(200).json({
           success: true,
           totalStaff,
        })

    }catch(error){
        console.warn("Error while fetching total staff", error);
        return res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

 

export default {
     registerUser,
     loginUser,
     updateUser,
     deleteUser,
     logoutUser,
     getUser,
     getAllUsers,
     getAllStaff,
     getUserProfile,
     getTotalStaff,
     
}