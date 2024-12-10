import { StatusCodes } from "http-status-codes";
import * as recipeService from "./recipes.service.js";
import { checkPermissions } from "../../utils/checkPermissions.js";
import cloudinary from "../../config/cloudinary.config.js";
import { dataUri } from "../../middlewares/multer.config.js";

// create

const create = async (req, res) => {
  let imageUrl = req.body.imageUrl || "";

  if (req.file) {
    console.log(req.file);

    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "L'image dépasse la taille maximale autorisée de 5 MB",
      });
    }

    const file = dataUri(req.file).content;

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(file, {
        folder: "recipes-images",
      });
      imageUrl = cloudinaryResponse.secure_url;
      console.log(cloudinaryResponse);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Erreur lors du téléchargement de l'image sur Cloudinary",
        error: error.message,
      });
    }
  }

  try {
    const createdRecipe = await recipeService.create(
      { ...req.body, imageUrl },
      req.user.userId
    );
    res.status(StatusCodes.CREATED).json({ recipe: createdRecipe });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message || "Erreur lors de la création de la recette",
    });
  }
};

// get all the recipes from a user

const getUsersRecipes = async (req, res) => {
  try {
    const userId = req.query.createdBy;
    const recipes = await recipeService.getUsersrecipes(userId);
    res.status(StatusCodes.OK).json({ nbHits: recipes.length, recipes });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// get a recipe

const get = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  res.status(StatusCodes.OK).json({ recipe });
};

// get all the recipes from all users

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getAll();
    res.status(StatusCodes.OK).json({ nbHits: recipes.length, recipes });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Erreur lors de la récupération des recettes",
      error: error.message,
    });
  }
};

// delete a recipe

const remove = async (req, res) => {
  try {
    const recipe = await recipeService.get(req.params.id);
    if (!recipe) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Recette introuvable" });
    }

    if (!recipe) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Recette introuvable" });
    }

    if (recipe.imageUrl) {
      const publicId = recipe.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`recipes-images/${publicId}`);
    }

    checkPermissions(req.user, recipe.createdBy);

    await recipeService.remove(req.params.id);
    res.status(StatusCodes.OK).json({ msg: "Recette supprimée avec succès" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Erreur lors de la suppression de la recette",
      error: error.message,
    });
  }
};

export { create, get, getUsersRecipes, getAllRecipes, remove };
