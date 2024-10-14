import express from "express";
const router = express.Router();
import validate from "../../middlewares/validation.middleware.js";
import { RecipeBodySchema, RecipeParamsSchema } from "./recipes.schema.js";

import * as recipesController from "./recipes.controller.js";

router
  .route("/")
  .get(recipesController.getUsersRecipes)
  .post(validate({ bodySchema: RecipeBodySchema }), recipesController.create);

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
