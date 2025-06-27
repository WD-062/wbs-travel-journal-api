import { isValidObjectId } from 'mongoose';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  // get the user's role
  // const userRole = req.userRole;
  // const { userRole } = req;
  // find out if user is an admin
  // if (userRole !== 'admin') {
  //   throw new Error('Not authorized', { cause: 403 });
  // }
  // only get users if verified as admin
  const users = await User.find().lean();
  res.json(users);
};

export const createUser = async (req, res) => {
  const {
    sanitizedBody: { email }
  } = req;

  const found = await User.findOne({ email });

  if (found) throw new Error('Email already exists', { cause: 400 });
  const user = await User.create(req.sanitizedBody);
  res.json(user);
};

export const getUserById = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const user = await User.findById(id).lean();
  if (!user) throw new Error('User not found', { cause: 404 });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const {
    sanitizedBody,
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const user = await User.findByIdAndUpdate(id, sanitizedBody, { new: true });

  if (!user) throw new Error('User not found', { cause: 404 });

  res.json(user);
};

export const deleteUser = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const user = await User.findByIdAndDelete(id);

  if (!user) throw new Error('User not found', { cause: 404 });

  res.json({ message: 'User deleted' });
};
