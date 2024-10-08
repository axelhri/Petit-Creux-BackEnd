import { StatusCodes } from 'http-status-codes';
import * as usersService from '../users/users.service.js';
import { UnauthenticatedError } from '../../errors/index.js';

const register = async (req, res) => {
  const user = await usersService.create(req.body);
  const token = user.createAccessToken();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const user = await usersService.get({ email: req.body.email });

  if (!user) throw new UnauthenticatedError('Identifiants invalides');

  const isPasswordCorrect = await user.comparePasswords(
    req.body.password
  );

  if (!isPasswordCorrect)
    throw new UnauthenticatedError('Identifiants invalides');

  const token = user.createAccessToken();

  res
    .status(StatusCodes.OK)
    .json({ user: { userId: user._id }, token });
};

export { login, register };
