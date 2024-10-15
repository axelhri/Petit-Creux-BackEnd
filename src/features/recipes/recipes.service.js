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

const remove = (id) => {
  return recipes.findByIdAndDelete(id);
};

const update = (id, data) => {
  return recipes.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export { create, getUsersrecipes, get, remove, update };
