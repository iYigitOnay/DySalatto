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
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { orderIndex: "asc" }
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

export const reorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orders } = req.body; // Array<{ id: string, orderIndex: number }>

    if (!Array.isArray(orders)) {
      res.status(400).json({ success: false, message: "Geçersiz sıralama verisi." });
      return;
    }

    await prisma.$transaction(
      orders.map((o) =>
        prisma.category.update({
          where: { id: o.id },
          data: { orderIndex: o.orderIndex },
        })
      )
    );

    res.status(200).json({ success: true, message: "Sıralama güncellendi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sıralama güncellenirken hata oluştu." });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // İçinde ürün var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (category && category._count.products > 0) {
      res.status(400).json({ 
        success: false, 
        message: "İçinde ürün bulunan bir kategoriyi silemezsiniz. Lütfen önce ürünleri başka bir kategoriye taşıyın." 
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Kategori silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kategori silinirken hata oluştu." });
  }
};
