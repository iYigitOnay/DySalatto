import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, addressId, paymentType, note } = req.body;
    const userId = (req as any).user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Sepetiniz boş." });
    }

    // 1. Adres doğrulaması
    const address = await prisma.address.findUnique({
      where: { id: addressId, userId },
    });

    if (!address) {
      return res.status(400).json({ success: false, message: "Geçersiz adres seçimi." });
    }

    // 2. Sepetteki ürünleri markalarına göre grupla
    const itemsByBrand: Record<string, any[]> = {};
    let totalAmount = 0;

    items.forEach((item: any) => {
      const brand = item.brand.toUpperCase(); // Ensure it matches enum Brand
      if (!itemsByBrand[brand]) {
        itemsByBrand[brand] = [];
      }
      itemsByBrand[brand].push(item);
      totalAmount += Number(item.price) * item.quantity;
    });

    // 3. Prisma Transaction ile Siparişi Oluştur
    const result = await prisma.$transaction(async (tx) => {
      // Ana Order kaydı
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          paymentType,
          status: "PENDING",
        },
      });

      // Her marka için SubOrder ve Item'ları oluştur
      for (const [brand, brandItems] of Object.entries(itemsByBrand)) {
        const subOrderTotal = brandItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
        
        const subOrder = await tx.subOrder.create({
          data: {
            orderId: order.id,
            brand: brand as any,
            totalAmount: subOrderTotal,
            status: "PENDING",
          },
        });

        // Her bir ürünü ekle
        for (const item of brandItems) {
          const orderItem = await tx.orderItem.create({
            data: {
              subOrderId: subOrder.id,
              productId: item.isCustom ? null : item.id,
              isCustom: item.isCustom || false,
              quantity: item.quantity,
              priceAtTime: Number(item.price),
            },
          });

          // Eğer özel malzemeler (DIY) varsa onları ekle
          if (item.ingredients && item.ingredients.length > 0) {
            await tx.orderItemIngredient.createMany({
              data: item.ingredients.map((ing: any) => ({
                orderItemId: orderItem.id,
                ingredientId: ing.id,
                priceAtTime: Number(ing.price),
                quantity: 1, // DIY'da şimdilik 1 adet
              })),
            });
          }
        }
      }

      return order;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Sipariş oluşturma hatası:", error);
    res.status(500).json({ success: false, message: "Sipariş oluşturulurken bir hata oluştu." });
  }
};

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
