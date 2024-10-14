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
    ingredients: [
      {
        name: {
          type: String,
          required: [true, "Veuillez fournir le nom de l'ingrédient"],
          maxlength: 30,
        },
        quantity: {
          type: Number,
          required: [true, "Veuillez fournir une quantité"],
        },
        unit: {
          type: String,
          enum: [
            "grammes",
            "litres",
            "cuillères",
            "pièces",
            "millilitres",
            "tasses",
          ], // Enum for allowed units
          required: [true, "Veuillez fournir une unité de mesure"],
        },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un utilisateur"],
    },
  },
  { timestamps: true }
);

export default model("Recipe", RecipeSchema);
