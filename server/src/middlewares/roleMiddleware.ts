import { Response, NextFunction } from "express";

import { AuthRequest } from "./authMiddleware";

export const roleMiddleware = (
  roles: string[]
) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userRole = req.user?.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
  };
};