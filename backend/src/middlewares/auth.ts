import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/decode-token";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: string | any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
