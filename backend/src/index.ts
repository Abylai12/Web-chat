import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth-route";
import messageRoutes from "./routes/message-route";
import { connectDB } from "./config/db";
import { server, app } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

connectDB(MONGO_URI);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Сервер localhost:${PORT} дээр аслаа`);
});
