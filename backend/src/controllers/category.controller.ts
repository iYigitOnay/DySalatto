import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { categorySchema } from "../schemas/category.schema";
import { Brand } from "@prisma/client";

// Slug oluşturma fonksiyonu (Örn: "Taze Kaseler" -> "taze-kaseler")
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .trim();
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand } = req.query;
    
    const categories = await prisma.category.findMany({
      where: brand ? { brand: brand as Brand } : undefined,
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kategoriler getirilirken hata oluştu." });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const slug = generateSlug(validatedData.name);

    // Aynı marka altında aynı slug'a sahip kategori var mı kontrolü
    const existing = await prisma.category.findUnique({
      where: {
        brand_slug: {
          brand: validatedData.brand,
          slug: slug
        }
      }
    });

    if (existing) {
      res.status(400).json({ success: false, message: "Bu isimde bir kategori zaten mevcut." });
      return;
    }

    const category = await prisma.category.create({
      data: {
        brand: validatedData.brand,
        name: validatedData.name,
        slug: slug
      }
    });

    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Kategori oluşturulurken hata oluştu." });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Kategori silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kategori silinirken hata oluştu." });
  }
};
