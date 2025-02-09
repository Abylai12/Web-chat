import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generate-token";
import cloudinary from "../config/cloudinary";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    await User.create({
      userName: username,
      email,
      password,
    });

    res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.userName,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profileImg } = req.body;

    const userId = req.user._id;

    if (!profileImg) {
      res.status(400).json({ message: "Profile pic is required" });
      return;
    }
    const uploadResponse = await cloudinary.uploader.upload(profileImg);
    console.log(uploadResponse);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    const user = {
      userName: req.user.userName,
      image: req.user.image,
      email: req.user.email,
      _id: req.user._id,
      created_at: req.user.created_at,
    };

    res.status(200).json({ user });
  } catch (error: any) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
