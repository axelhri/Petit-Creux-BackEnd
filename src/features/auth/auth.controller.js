import { StatusCodes } from "http-status-codes";
import * as usersService from "../users/users.service.js";
import bcrypt from "bcryptjs";
import { UnauthenticatedError } from "../../errors/index.js";
import { dataUri } from "../../middlewares/multer.config.js";
import cloudinary from "../../config/cloudinary.config.js";
import mongoose from "mongoose";
import * as recipeService from "../recipes/recipes.service.js";

// register

const register = async (req, res) => {
  const { name, email, password } = req.body;

  let imageUrl =
    "https://res.cloudinary.com/dsoqmhreg/image/upload/v1734000065/avatar_whstza.png"; // Default image URL

  if (req.file) {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "L'image dépasse la taille maximale autorisée de 5 MB",
      });
    }

    const file = dataUri(req.file).content;

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(file, {
        folder: "user-profiles",
      });
      imageUrl = cloudinaryResponse.secure_url;
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'upload de l'image",
        error: error.message,
      });
    }
  }

  try {
    // Log input data for debugging
    console.log("Creating user with data:", {
      name,
      email,
      password,
      imageUrl,
    });

    const user = await usersService.create({
      name,
      email,
      password,
      imageUrl,
    });

    const token = user.createAccessToken();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    console.error("Error during user registration:", error); // Log error details
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// login

const login = async (req, res) => {
  const user = await usersService.get({ email: req.body.email });

  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { userId: user._id }, token });
};

// get user by id

const getUser = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id);

  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id);

  if (!user) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

// delete user

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id);
  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id);
  if (!user) {
    throw new NotFoundError(`Aucun utilisateur trouvé avec l'id : ${id}`);
  }

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Profil utilisateur non trouvé" });
  }

  if (user.imageUrl) {
    const publicId = user.imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
  }

  await recipeService.removeByUserId(id);

  await usersService.removeUser(id);
  res.status(StatusCodes.NO_CONTENT).send();
};

// update user

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, bio, password } = req.body;

  const isMongoId = mongoose.isValidObjectId(id);
  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id);
  if (!user) {
    throw new NotFoundError(`Aucun utilisateur trouvé avec l'id : ${id}`);
  }

  let imageUrl = user.imageUrl;
  if (req.file) {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "L'image dépasse la taille maximale autorisée de 5 MB",
      });
    }
    const file = dataUri(req.file).content;
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "user-profiles",
    });
    imageUrl = cloudinaryResponse.secure_url;
  }

  const updatedData = {
    name: name || user.name,
    email: email || user.email,
    bio: bio || user.bio,
    password: password ? await bcrypt.hash(password, 10) : user.password,
    imageUrl,
  };

  const updatedUser = await usersService.updateUser(id, updatedData);

  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export { login, register, getUser, deleteUser, updateUser };
