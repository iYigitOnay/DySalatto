import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const getMyAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Kullanıcı bilgisi bulunamadı." });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ success: false, message: "Adresler getirilemedi." });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const { title, street, city, district, neighborhood, buildingNo, floor, apartmentNo, directions } = req.body;
    
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Kullanıcı bilgisi bulunamadı." });
    }

    const address = await prisma.address.create({
      data: {
        title,
        street,
        city: city || "İstanbul",
        district,
        neighborhood,
        buildingNo: buildingNo || "-", // buildingNo required in schema, using placeholder if consolidated
        floor: floor || null,
        apartmentNo: apartmentNo || null,
        directions: directions || null,
        userId,
      },
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ success: false, message: "Adres oluşturulamadı." });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, street, city, district, neighborhood, buildingNo, floor, apartmentNo, directions } = req.body;
    
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Kullanıcı bilgisi bulunamadı." });
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ success: false, message: "Yetkisiz işlem." });
    }

    const address = await prisma.address.update({
      where: { id },
      data: { 
        title, 
        street, 
        city: city || "İstanbul", 
        district, 
        neighborhood, 
        buildingNo: buildingNo || "-", 
        floor: floor || null, 
        apartmentNo: apartmentNo || null, 
        directions 
      },
    });
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ success: false, message: "Adres güncellenemedi." });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== (req as any).user.id) {
      return res.status(403).json({ success: false, message: "Yetkisiz işlem." });
    }

    await prisma.address.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Adres başarıyla silindi." });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ success: false, message: "Adres silinemedi." });
  }
};
