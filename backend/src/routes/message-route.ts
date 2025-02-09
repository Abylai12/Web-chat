import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message-controller";

const router = Router();

router.route("/users").get(auth, getUsersForSidebar);
router.route("/:id").get(auth, getMessages);
router.route("/send/:id").post(auth, sendMessage);

export default router;
