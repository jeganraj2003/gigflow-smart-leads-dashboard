import User from '../models/User.js';
import { registerSchema } from '../validators/authValidator.js';
import generateToken from '../utils/generateToken.js';

export const createUser = async (userData: any) => {
  const validatedData = registerSchema.parse(userData);

  const userExists = await User.findOne({ email: validatedData.email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create(validatedData);
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  };
};

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  const user: any = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};
