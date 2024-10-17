import { StatusCodes } from "http-status-codes";
import * as usersService from "../users/users.service.js";
import { UnauthenticatedError } from "../../errors/index.js";
import { dataUri } from "../../middlewares/multer.config.js"; // importer la configuration multer/datauri
import cloudinary from "../../config/cloudinary.config.js"; // importer la configuration Cloudinary
import mongoose from "mongoose";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifie si une image est fournie
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Veuillez fournir une image de profil" });
  }

  // Convertir l'image en DataURI
  const file = dataUri(req.file).content;

  try {
    // Uploader l'image sur Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "user-profiles", // Dossier optionnel dans Cloudinary
    });

    // Créer un nouvel utilisateur avec l'URL de l'image
    const user = await usersService.create({
      name,
      email,
      password,
      imageUrl: cloudinaryResponse.secure_url, // URL de l'image uploadée
    });

    // Créer un token JWT
    const token = user.createAccessToken();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    throw new UnauthenticatedError("Erreur lors de l'inscription");
  }
};

const login = async (req, res) => {
  const user = await usersService.get({ email: req.body.email });

  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { userId: user._id }, token });
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id); // Vérifie si l'ID est valide

  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id); // Récupère la tâche

  if (!user) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ user }); // Renvoie la tâche
};

export { login, register, getUser };
