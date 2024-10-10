import { StatusCodes } from "http-status-codes";
import * as usersService from "../users/users.service.js";
import { UnauthenticatedError } from "../../errors/index.js";

const register = async (req, res) => {
  const user = await usersService.create(req.body);
  const token = user.createAccessToken();

  //

  const productImage = req.file;

  if (!productImage) {
    throw new Error("Aucun fichier trouvé");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new Error("Veuillez fournir une image de taille inférieur à 1Mo");
  }

  const file = formatImage(productImage);
  const response = await cloudinary.uploader.upload(file, {
    folder: "products",
  });

  const image = response.secure_url;

  const newProduct = { ...req.body, image };
  const product = await productsService.create(newProduct);
  res.status(StatusCodes.CREATED).json({ user, token, product });
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

export { login, register };
