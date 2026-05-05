import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: (req as any).user.id },
      include: {
        subOrders: {
          include: {
            items: {
              include: {
                product: true,
                selectedIngredients: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Siparişler getirilemedi." });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id, userId: (req as any).user.id },
      include: {
        subOrders: {
          include: {
            items: {
              include: {
                product: true,
                selectedIngredients: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Sipariş bulunamadı." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sipariş detayları getirilemedi." });
  }
};
