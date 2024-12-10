import recipes from "./recipes.model.js";

const create = (data, id) => {
  return recipes({ ...data, createdBy: id }).save();
};

const getUsersrecipes = (id) => {
  return recipes.find({ createdBy: id });
};

const get = (id) => {
  return recipes.findById(id);
};

const getAll = () => {
  return recipes.find();
};

const remove = (id) => {
  return recipes.findByIdAndDelete(id);
};

const removeByUserId = (userId) => {
  return recipes.deleteMany({ createdBy: userId });
};

export { create, getUsersrecipes, get, getAll, remove, removeByUserId };
