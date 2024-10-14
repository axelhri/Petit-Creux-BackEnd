import jobs from './jobs.model.js';

const create = (data, id) => {
  return jobs({ ...data, createdBy: id }).save();
};

const getUsersjobs = (id) => {
  return jobs.find({ createdBy: id });
};

const get = (id) => {
  return jobs.findById(id);
};

const remove = (id) => {
  return jobs.findByIdAndDelete(id);
};

const update = (id, data) => {
  return jobs.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export { create, getUsersjobs, get, remove, update };
