import express from "express";
const router = express.Router();
import validate from "../../middlewares/validation.middleware.js";
import { LoginUserSchema, RegisterUserSchema } from "../users/users.schema.js";
import * as authController from "./auth.controller.js";
import { multerUploads } from "../../middlewares/multer.config.js";

router.post(
  "/register",
  multerUploads.single("image"),
  validate({ bodySchema: RegisterUserSchema }),
  authController.register
);

router.post(
  "/login",
  validate({ bodySchema: LoginUserSchema }),
  authController.login
);

router.route("/:id").get(authController.getUser);

router
  .route("/:id")
  .get(authController.getUser)
  .delete(authController.deleteUser);

router.put(
  "/:id",
  multerUploads.single("image"),
  validate({ bodySchema: RegisterUserSchema }),
  authController.updateUser
);

export default router;
