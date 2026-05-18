import * as userService from '../services/userService.js';
export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400);
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const user = await userService.loginUser(req.body);
        res.json(user);
    }
    catch (error) {
        res.status(401);
        next(error);
    }
};
