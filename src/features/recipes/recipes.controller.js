import { StatusCodes } from "http-status-codes";
import * as recipeService from "./recipes.service.js";
// import { checkPermissions } from "../../utils/checkPermissions.js";
import cloudinary from "../../config/cloudinary.config.js";
import { dataUri } from "../../middlewares/multer.config.js";

const create = async (req, res) => {
  let imageUrl = req.body.imageUrl || "";

  // Si un fichier est présent, vérifier sa taille et uploader sur Cloudinary
  if (req.file) {
    console.log(req.file);

    // Vérifier la taille de l'image (max 5MB = 5 * 1024 * 1024 octets)
    const maxSize = 5 * 1024 * 1024; // 5 MB en octets
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
    // Créer la recette avec l'image URL (ou une URL par défaut)
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

const getUsersRecipes = async (req, res) => {
  const recipes = await recipeService.getUsersrecipes(req.user.userId);
  res.status(StatusCodes.OK).json({ nbHits: recipes.length, recipes });
};

const get = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  // checkPermissions(req.user, recipe.createdBy);
  res.status(StatusCodes.OK).json({ recipe });
};

const update = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  checkPermissions(req.user, recipe.createdBy);
  const updateRecipe = await recipeService.update(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ recipe: updateRecipe });
};

const remove = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  checkPermissions(req.user, recipe.createdBy);
  const removedRecipe = await recipeService.remove(req.params.id);
  res.status(StatusCodes.OK).json({ recipe: removedRecipe });
};

export { create, get, getUsersRecipes, update, remove };
