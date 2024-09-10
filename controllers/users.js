import { prisma } from "../prisma/prisma-client.js";
import bcrypt from "bcrypt";
import { json } from "express";
import jwt from "jsonwebtoken";

/*
 * @route POST:/api/user/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "пожалуста заполните поля" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));
    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res.status(400).json({
        message: "неверно введен логин нили пароль",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "ошибка при авторизации",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.send(400).json({
        message: "Пожалуйста, заполните обязательные поля",
      });
    }

    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res.status(400).json({
        message: "Пользователь, с таким email уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    // ? Секретный ключ, с помощь юкоторого подписываем токен
    const secret = process.env.JWT_SECRET;

    if (user && secret) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res.status(400).json({
        message: "Не удалось создать пользователя",
      });
    }
  } catch {
    b;
    res.status(400).json({
      message: "Ошибка при регистрации",
    });
  }
};

export const poster = (req, res) => {
  return res.status(200).json(req.user);
};

export const getMe = async (req, res) => {
  const bod = req.user;
  try {
    // // const user = await UserModel.findById(req.userId);
    // const registeredUser = await prisma.user.findFirst({
    //   where: {
    //     id,
    //   },
    // });

    const { password, ...userData } = bod;

    res.json(userData);
  } catch (err) {
    res.json({
      message: "не получилось",
    });
  }
};
