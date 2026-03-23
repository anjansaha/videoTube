import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  changePassword,
  getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controlers/user.controler.js";
import {
  registerUserValidator,
  loginUserValidator,
} from "../validation/user.validator.js";
import { validateRequest } from "../validation/validateRequest.js";
import { verifyAuthentication } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUserValidator,
  validateRequest,
  registerUser
);
router.route("/login").post(loginUserValidator, validateRequest, loginUser);
router.route("/refresh-access-token").post(refreshToken);
router.use(verifyAuthentication);

router.route("/logout").post(logoutUser);
router.route("/update-password").post(changePassword);
router.route("/profile/:username").get(getUserChannelProfile);

export default router;
