import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { AppDataSource } from "../database/data-source";

import { User } from "../entities/User";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

import { AuthRequest } from "../middlewares/authMiddleware";

export class AuthController {
  static async register(
    req: Request,
    res: Response
  ) {
    try {
      const {
        fullName,
        login,
        password,
        role,
      } = req.body;

      const userRepository =
        AppDataSource.getRepository(User);

      const candidate = await userRepository.findOne({
        where: {
          login,
        },
      });

      if (candidate) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 5);

      const user = userRepository.create({
        fullName,
        login,
        password: hashedPassword,
        role,
      });

      await userRepository.save(user);

      const accessToken =
        generateAccessToken(
          user.id,
          user.role
        );

      const refreshToken =
        generateRefreshToken(
          user.id,
          user.role
        );

      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000,
        }
      );

      return res.json({
        accessToken,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Register error",
      });
    }
  }

  static async login(
    req: Request,
    res: Response
  ) {
    try {
      const { login, password } = req.body;

      const userRepository =
        AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          login,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const accessToken =
        generateAccessToken(
          user.id,
          user.role
        );

      const refreshToken =
        generateRefreshToken(
          user.id,
          user.role
        );

      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000,
        }
      );

      return res.json({
        accessToken,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Login error",
      });
    }
  }

  static async refresh(
    req: Request,
    res: Response
  ) {
    try {
      const refreshToken =
        req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: "No refresh token",
        });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env
          .JWT_REFRESH_SECRET as string
      ) as any;

      const accessToken =
        generateAccessToken(
          decoded.id,
          decoded.role
        );

      return res.json({
        accessToken,
      });
    } catch (error) {
      return res.status(401).json({
        message:
          "Invalid refresh token",
      });
    }
  }

  static async logout(
    req: Request,
    res: Response
  ) {
    res.clearCookie("refreshToken");

    return res.json({
      message: "Logged out",
    });
  }

  static async me(
    req: AuthRequest,
    res: Response
  ) {
    try {
      return res.json(req.user);
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}