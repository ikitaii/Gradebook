import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { AppDataSource } from "../database/data-source";
import { User, UserRole } from "../entities/User";

import { generateAccessToken } from "../utils/jwt";

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

      const token = generateAccessToken(
        user.id,
        user.role
      );

      return res.json({
        token,
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

      const token = generateAccessToken(
        user.id,
        user.role
      );

      return res.json({
        token,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Login error",
      });
    }
  }
}