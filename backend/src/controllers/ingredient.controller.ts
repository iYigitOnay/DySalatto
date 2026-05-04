import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { 
  ingredientSchema, 
  updateIngredientSchema,
  ingredientStepSchema,
  updateIngredientStepSchema
} from "../schemas/ingredient.schema";
import { Brand } from "@prisma/client";

// --- INGREDIENTS (MALZEMELER) ---

export const getIngredients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand } = req.query;
    
    const ingredients = await prisma.ingredient.findMany({
      where: brand ? { brand: brand as Brand } : undefined,
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Malzemeler getirilirken hata oluştu." });
  }
};

export const createIngredient = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = ingredientSchema.parse(req.body);

    const existing = await prisma.ingredient.findFirst({
      where: {
        brand: validatedData.brand,
        name: {
          equals: validatedData.name,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      res.status(400).json({ success: false, message: "Bu isimde bir malzeme zaten mevcut." });
      return;
    }

    const ingredient = await prisma.ingredient.create({
      data: validatedData
    });

    res.status(201).json({ success: true, data: ingredient });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Malzeme oluşturulurken hata oluştu." });
  }
};

export const updateIngredient = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const validatedData = updateIngredientSchema.parse(req.body);

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({ success: true, data: ingredient });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Malzeme güncellenirken hata oluştu." });
  }
};

export const deleteIngredient = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.ingredient.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Malzeme silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Malzeme silinirken hata oluştu." });
  }
};

// --- DIY STEPS (OLUŞTURMA ADIMLARI) ---

export const getSteps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand } = req.query;
    
    const steps = await prisma.ingredientStep.findMany({
      where: brand ? { brand: brand as Brand } : undefined,
      include: {
        ingredients: {
          include: {
            ingredient: true // Adıma bağlı malzemelerin detaylarını da getir
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });

    // Veriyi frontend'de daha rahat kullanabilmek için şekillendiriyoruz
    const formattedSteps = steps.map(step => ({
      ...step,
      ingredients: step.ingredients.map(si => si.ingredient)
    }));

    res.status(200).json({ success: true, data: formattedSteps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Adımlar getirilirken hata oluştu." });
  }
};

export const createStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = ingredientStepSchema.parse(req.body);
    const { ingredientIds, ...stepData } = validatedData;

    const step = await prisma.ingredientStep.create({
      data: {
        ...stepData,
        ingredients: {
          create: ingredientIds.map(id => ({
            ingredient: { connect: { id } }
          }))
        }
      },
      include: {
        ingredients: { include: { ingredient: true } }
      }
    });

    const formattedStep = {
      ...step,
      ingredients: step.ingredients.map(si => si.ingredient)
    };

    res.status(201).json({ success: true, data: formattedStep });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Adım oluşturulurken hata oluştu." });
  }
};

export const updateStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const validatedData = updateIngredientStepSchema.parse(req.body);
    const { ingredientIds, ...stepData } = validatedData;

    // Eğer ingredientIds geldiyse, mevcut bağları silip yenilerini kurmamız lazım
    if (ingredientIds) {
      // Önce mevcutları sil
      await prisma.stepIngredient.deleteMany({
        where: { stepId: id }
      });
    }

    const step = await prisma.ingredientStep.update({
      where: { id },
      data: {
        ...stepData,
        ...(ingredientIds && {
          ingredients: {
            create: ingredientIds.map(ingId => ({
              ingredient: { connect: { id: ingId } }
            }))
          }
        })
      },
      include: {
        ingredients: { include: { ingredient: true } }
      }
    });

    const formattedStep = {
      ...step,
      ingredients: step.ingredients.map(si => si.ingredient)
    };

    res.status(200).json({ success: true, data: formattedStep });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    res.status(500).json({ success: false, message: "Adım güncellenirken hata oluştu." });
  }
};

export const deleteStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.ingredientStep.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Adım silindi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Adım silinirken hata oluştu." });
  }
};
