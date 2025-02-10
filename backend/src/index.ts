import express, { Request, Response } from "express";
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
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
};

app.use(cors(corsOptions));

app.get("/", async (_: Request, res: Response) => {
  res.send("Welcome to Web Chat API Server");
  //localhost:8000/
});

connectDB(MONGO_URI);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Сервер localhost:${PORT} дээр аслаа`);
});
