import { body } from "express-validator";

const registerUserValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("username").notEmpty().withMessage("Username is required"),
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("avatar").custom((value, { req }) => {
    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
      throw new Error("Avatar is required");
    }
    return true;
  }),
];

const loginUserValidator = [
  body("emailOrUsername").notEmpty().withMessage("Email or username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
export { registerUserValidator, loginUserValidator };