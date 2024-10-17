import { z } from "zod";
import mongoose from "mongoose";
import { INGREDIENTS_UNITS } from "../../utils/constants.js";

const RecipeParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l'ID invalide",
  }),
});

const IngredientSchema = z.object({
  name: z.string().trim().min(1, "Veuillez fournir le nom de l'ingrédient"),
  quantity: z.number().positive("Veuillez fournir une quantité valide"),
  unit: z.enum(
    [
      INGREDIENTS_UNITS.GRAMMES,
      INGREDIENTS_UNITS.LITRES,
      INGREDIENTS_UNITS.TBSP,
      INGREDIENTS_UNITS.KG,
      INGREDIENTS_UNITS.MG,
      INGREDIENTS_UNITS.ML,
      INGREDIENTS_UNITS.SPOON,
      INGREDIENTS_UNITS.CUP,
    ],
    {
      errorMap: () => ({
        message: "Unité invalide, veuillez choisir parmi les unités autorisées",
      }),
    }
  ),
});

const RecipeBodySchema = z.object({
  title: z.string().trim().min(1, "Veuillez fournir un titre"),
  description: z.string().trim().min(1, "Veuillez fournir une description"),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "Veuillez fournir au moins un ingrédient"),
  imageUrl: z.string().url({ message: "URL d'image invalide" }).optional(), // Champ optionnel pour l'URL de l'image
});

export { RecipeBodySchema, RecipeParamsSchema };
