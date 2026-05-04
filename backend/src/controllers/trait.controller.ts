import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { traitGroupSchema, traitSchema } from "../schemas/trait.schema";
import { Brand } from "@prisma/client";

// --- TRAIT GROUPS ---

export const getTraitGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand } = req.query;
    
    const groups = await prisma.traitGroup.findMany({
      where: brand ? { brand: brand as Brand } : undefined,
      include: { traits: true }, // Alt etiketleri (Vegan, Glutensiz vb.) de getir
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: "Özellik grupları getirilirken hata oluştu." });
  }
};

export const createTraitGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = traitGroupSchema.parse(req.body);

    const group = await prisma.traitGroup.create({
      data: {
        brand: validatedData.brand,
        name: validatedData.name,
      }
    });

    res.status(201).json({ success: true, data: group });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Grup oluşturulurken hata oluştu." });
  }
};

export const deleteTraitGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    // Cascade onDelete sayesinde içindeki traits de silinecek
    await prisma.traitGroup.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Grup silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Grup silinirken hata oluştu." });
  }
};

// --- TRAITS (ETİKETLER) ---

export const createTrait = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = traitSchema.parse(req.body);

    // Grubun var olup olmadığını kontrol et
    const group = await prisma.traitGroup.findUnique({
      where: { id: validatedData.traitGroupId }
    });

    if (!group) {
      res.status(404).json({ success: false, message: "Bağlanmak istenen özellik grubu bulunamadı." });
      return;
    }

    const trait = await prisma.trait.create({
      data: {
        name: validatedData.name,
        traitGroupId: validatedData.traitGroupId
      }
    });

    res.status(201).json({ success: true, data: trait });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Etiket oluşturulurken hata oluştu." });
  }
};

export const deleteTrait = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.trait.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Etiket silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Etiket silinirken hata oluştu." });
  }
};
