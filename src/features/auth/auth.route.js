import express from "express";
const router = express.Router();
import validate from "../../middlewares/validation.middleware.js";
import { LoginUserSchema, RegisterUserSchema } from "../users/users.schema.js";
import * as authController from "./auth.controller.js";
import { multerUploads } from "../../middlewares/multer.config.js"; // Multer middleware

router.post(
  "/register",
  multerUploads.single("image"), // Middleware Multer pour gérer l'upload d'une seule image
  validate({ bodySchema: RegisterUserSchema }),
  authController.register
);

router.post(
  "/login",
  validate({ bodySchema: LoginUserSchema }),
  authController.login
);

router.route("/:id").get(authController.getUser);

export default router;
