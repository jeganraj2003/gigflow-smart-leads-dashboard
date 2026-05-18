import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.loginUser(req.body);
    res.json(user);
  } catch (error: any) {
    res.status(401);
    next(error);
  }
};
