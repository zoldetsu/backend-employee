import { prisma } from "../prisma/prisma-client.js";

export const getAll = async (req, res) => {
  try {
    const ListEmployeers = await prisma.employee.findMany();
    res.status(200).json(ListEmployeers);
  } catch {
    res.status(400).json({
      message: "Не удалось получить сотрудников",
    });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({
        message: "Все поля обязательные",
      });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch {
    res.status(400).json({
      message: "Ошибка в добавлении сотрудника",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(204).json("OK");
  } catch {
    return res.status(500).json({
      message: "Не удалось удалить сотрудника",
    });
  }
};

export const edit = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  try {
    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });
    res.status(204).json("OK");
  } catch {
    res.status(500).json({
      message: "Не удалось изменить сотрудника",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};
