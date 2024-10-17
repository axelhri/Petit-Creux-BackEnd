// recipes.route.js
import express from "express";
const router = express.Router();
import validate from "../../middlewares/validation.middleware.js";
import { RecipeBodySchema, RecipeParamsSchema } from "./recipes.schema.js";
import * as recipesController from "./recipes.controller.js";
import { multerUploads } from "../../middlewares/multer.config.js"; // Importez la configuration Multer

router
  .route("/")
  .get(recipesController.getUsersRecipes)
  .post(
    multerUploads.single("image"), // Middleware pour gérer le téléchargement d'une image
    validate({ bodySchema: RecipeBodySchema }),
    recipesController.create
  );

router
  .route("/:id")
  .get(validate({ paramsSchema: RecipeParamsSchema }), recipesController.get)
  .put(
    validate({
      paramsSchema: RecipeParamsSchema,
      bodySchema: RecipeBodySchema,
    }),
    recipesController.update
  )
  .delete(
    validate({ paramsSchema: RecipeParamsSchema }),
    recipesController.remove
  );

export default router;
