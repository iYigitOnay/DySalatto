import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { productSchema } from "../schemas/product.schema";
import { Brand } from "@prisma/client";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, categoryId } = req.query;

    const products = await prisma.product.findMany({
      where: {
        AND: [
          brand ? { brand: brand as Brand } : {},
          categoryId ? { categoryId: categoryId as string } : {},
        ],
      },
      include: {
        category: true,
        traits: {
          include: {
            trait: true,
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ success: false, message: "Ürünler getirilirken hata oluştu." });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Multer'dan gelen dosya varsa URL'i ayarla
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : req.body.image;
    
    // Body parse: Multipart form-data string olarak gelebilir, düzelt
    const body = {
      ...req.body,
      price: parseFloat(req.body.price),
      traitIds: typeof req.body.traitIds === 'string' ? JSON.parse(req.body.traitIds) : req.body.traitIds,
      ingredientIds: typeof req.body.ingredientIds === 'string' ? JSON.parse(req.body.ingredientIds) : req.body.ingredientIds,
      image: imagePath
    };

    const validatedData = productSchema.parse(body);
    const { traitIds, ingredientIds, ...rest } = validatedData;

    const product = await prisma.product.create({
      data: {
        ...rest,
        traits: traitIds
          ? {
              create: traitIds.map((id) => ({
                trait: { connect: { id } },
              })),
            }
          : undefined,
        ingredients: ingredientIds
          ? {
              create: ingredientIds.map((id) => ({
                ingredient: { connect: { id } },
              })),
            }
          : undefined,
      },
      include: {
        traits: true,
        ingredients: true,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Ürün oluşturulurken hata oluştu." });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Multer'dan gelen dosya varsa URL'i ayarla
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : req.body.image;
    
    const body = {
      ...req.body,
      price: parseFloat(req.body.price),
      traitIds: typeof req.body.traitIds === 'string' ? JSON.parse(req.body.traitIds) : req.body.traitIds,
      ingredientIds: typeof req.body.ingredientIds === 'string' ? JSON.parse(req.body.ingredientIds) : req.body.ingredientIds,
      image: imagePath
    };

    const validatedData = productSchema.parse(body);
    const { traitIds, ingredientIds, ...rest } = validatedData;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        traits: {
          deleteMany: {},
          create: traitIds?.map((tId) => ({
            trait: { connect: { id: tId } },
          })),
        },
        ingredients: {
          deleteMany: {},
          create: ingredientIds?.map((iId) => ({
            ingredient: { connect: { id: iId } },
          })),
        },
      },
      include: {
        traits: true,
        ingredients: true,
      },
    });

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Ürün güncellenirken hata oluştu." });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Ürün silindi." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Ürün silinirken hata oluştu." });
  }
};
