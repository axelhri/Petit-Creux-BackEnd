import { StatusCodes } from "http-status-codes";
import * as recipeService from "./recipes.service.js";
import { checkPermissions } from "../../utils/checkPermissions.js";
import cloudinary from "../../config/cloudinary.config.js";
import { dataUri } from "../../middlewares/multer.config.js";

const create = async (req, res) => {
  let imageUrl = req.body.imageUrl || "";

  if (req.file) {
    console.log(req.file);
    const file = dataUri(req.file).content;

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(file, {
        folder: "recipes-images",
      });
      imageUrl = cloudinaryResponse.secure_url;
      console.log(cloudinaryResponse);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Error uploading image to Cloudinary",
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
      msg: error.message || "Error creating recipe",
    });
  }
};

const getUsersRecipes = async (req, res) => {
  const recipes = await recipeService.getUsersrecipes(req.user.userId);
  res.status(StatusCodes.OK).json({ nbHits: recipes.length, recipes });
};

const get = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  checkPermissions(req.user, recipe.createdBy);
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
