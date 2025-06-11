import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User from '../models/User.js';

const secret = process.env.JWT_SECRET; // This will come from the server environment
const tokenOptions = { expiresIn: '7d' }; // We will limit the dura

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'None' : 'Lax',
  secure: isProduction
};

const signup = async (req, res) => {
  const {
    sanitizedBody: { email, password }
  } = req;

  const found = await User.findOne({ email });

  if (found) throw new Error('Email already exists', { cause: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...req.sanitizedBody, password: hashedPassword });

  const payload = { userId: user._id }; // The data we want to enclose in the JWT

  const token = jwt.sign(payload, secret, tokenOptions);

  res.cookie('token', token, cookieOptions);
  res.status(201).json({ success: 'welcome back' });
};

const signin = async (req, res) => {
  res.json({ message: 'Sign in!' });
};

const me = async (req, res) => {
  res.json({ message: 'Me!' });
};

export { me, signup, signin };
