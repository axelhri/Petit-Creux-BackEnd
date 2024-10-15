import mongoose, { model, Schema } from "mongoose";
import { INGREDIENTS_UNITS } from "../../utils/constants.js";

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: [true, "Veuillez fournir le nom de l'ingrédient"],
  },
  quantity: {
    type: Number,
    required: [true, "Veuillez fournir la quantité"],
  },
  unit: {
    type: String,
    required: [true, "Veuillez fournir une unité"],
    enum: [
      INGREDIENTS_UNITS.GRAMMES,
      INGREDIENTS_UNITS.LITRES,
      INGREDIENTS_UNITS.TBSP,
      INGREDIENTS_UNITS.KG,
      INGREDIENTS_UNITS.MG,
      INGREDIENTS_UNITS.ML,
      INGREDIENTS_UNITS.SPOON,
      INGREDIENTS_UNITS.CUP,
    ],
  },
});

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Veuillez fournir un titre"],
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, "Veuillez fournir une description"],
      maxlength: 100,
    },
    ingredients: [IngredientSchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un utilisateur"],
    },
  },
  { timestamps: true }
);

export default model("Recipe", RecipeSchema);
