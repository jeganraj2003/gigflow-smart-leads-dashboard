import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                return next();
            }
            else {
                res.status(401);
                return next(new Error('User not found'));
            }
        }
        catch (error) {
            res.status(401);
            return next(new Error('Not authorized, token failed'));
        }
    }
    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        }
        else {
            res.status(403);
            next(new Error(`User role ${req.user?.role} is not authorized to access this route`));
        }
    };
};
