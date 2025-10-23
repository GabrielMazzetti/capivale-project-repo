import { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory to check if a user has one of the required roles.
 * @param allowedRoles - An array of roles that are allowed to access the route.
 * @returns An Express middleware function.
 */
export const checkRole = (allowedRoles: Array<'admin' | 'merchant' | 'citizen'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not logged in' });
    }

    const { role } = req.user;

    if (allowedRoles.includes(role)) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
    }
  };
};
