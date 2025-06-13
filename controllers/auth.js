import { isValidObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User from '../models/User.js';

const secret = process.env.JWT_SECRET; // This will come from the server environment
const tokenOptions = { expiresIn: '7d' }; // We will limit the duration

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'None' : 'Lax',
  secure: isProduction
};

const signup = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const found = await User.findOne({ email });

  if (found) throw new Error('Email already exists', { cause: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...req.sanitizedBody, password: hashedPassword });

  const payload = { userId: user._id }; // The data we want to enclose in the JWT

  const token = jwt.sign(payload, secret, tokenOptions);

  res.cookie('token', token, cookieOptions);
  res.status(201).json({ message: 'welcome' });
};

const signin = async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('User not found', { cause: 404 });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) throw new Error('Invalid email or password', { cause: 401 });

  const payload = { userId: user._id };

  const token = jwt.sign(payload, secret, tokenOptions);

  res.cookie('token', token, cookieOptions);
  res.status(201).json({ message: 'welcome back' });
};

const me = async (req, res) => {
  const { userId } = req;

  if (!isValidObjectId(userId)) throw new Error('Invalid id', { cause: 400 });

  //find user with that id
  const user = await User.findById(userId).lean();

  if (!user) throw new Error('User not found', { cause: 404 });

  res.json(user);
};

const signout = async (req, res) => {
  res.clearCookie('token');

  res.json({ message: 'You have signed out.' });
};

export { me, signup, signin, signout };
