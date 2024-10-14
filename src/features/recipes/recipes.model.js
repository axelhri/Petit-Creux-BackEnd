import mongoose, { model, Schema } from "mongoose";

const RecipeSchema = new Schema(
  {
    recipeImage: {
      type: String, // Ajout de l'URL de l'image
      required: true,
    },
    recipeTitle: {
      type: String,
      required: [true, "Veuillez fournir un titre"],
      maxlength: 15,
    },
    recipeDescription: {
      type: String,
      maxlength: 200,
    },
    ingredients: {
      type: [String],
      required: [true, "Veuillez fournir les ingredients"],
      maxlength: 30,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un utilisateur"],
    },
  },
  { timestamps: true }
);

export default model("Recipe", RecipeSchema);
