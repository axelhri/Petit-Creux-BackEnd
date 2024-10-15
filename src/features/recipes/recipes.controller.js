import { StatusCodes } from "http-status-codes";
import * as recipeService from "./recipes.service.js";
import { checkPermissions } from "../../utils/checkPermissions.js";

const create = async (req, res) => {
  const createdRecipe = await recipeService.create(req.body, req.user.userId);
  res.status(StatusCodes.CREATED).json({ job: createdRecipe });
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
  res.status(StatusCodes.OK).json({ job: updateRecipe });
};

const remove = async (req, res) => {
  const recipe = await recipeService.get(req.params.id);
  checkPermissions(req.user, recipe.createdBy);
  const removedRecipe = await recipeService.remove(req.params.id);
  res.status(StatusCodes.OK).json({ job: removedRecipe });
};

export { create, get, getUsersRecipes, update, remove };
