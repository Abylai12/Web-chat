import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const decodeToken = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    return decoded.userId; // Access the `userId` property from the decoded token
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};
