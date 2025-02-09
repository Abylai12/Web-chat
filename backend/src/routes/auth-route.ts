import { Router } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth-controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").post(logout);
router.route("/update-profile").put(auth, updateProfile);
router.route("/check").get(auth, checkAuth);

export default router;
