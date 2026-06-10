import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest
  extends Request {
  user?: any;
}

export const authMiddleware =
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader =
        req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message:
            "Нет токена",
        });
      }

      const token =
        authHeader.split(
          " "
        )[1];

      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET ||
            "secret"
        );

      req.user =
        decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message:
          "Не авторизован",
      });
    }
  };