// recipes.route.js
import express from "express";
const router = express.Router();
import validate from "../../middlewares/validation.middleware.js";
import { RecipeBodySchema, RecipeParamsSchema } from "./recipes.schema.js";
import * as recipesController from "./recipes.controller.js";
import { multerUploads } from "../../middlewares/multer.config.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

router
  .route("/")
  .post(
    multerUploads.single("image"),
    validate({ bodySchema: RecipeBodySchema }),
    authenticateUser,
    recipesController.create
  );

router.route("/user").get(recipesController.getUsersRecipes);

router.route("/all").get(recipesController.getAllRecipes);

router
  .route("/:id")
  .get(validate({ paramsSchema: RecipeParamsSchema }), recipesController.get)
  .delete(
    validate({ paramsSchema: RecipeParamsSchema }),
    authenticateUser,
    recipesController.remove
  );

export default router;
