import { Request, Response } from "express";
import { FurnitureModel } from "./furniture.model";

const getAllFurniture = async (req: any, res: any) => {
  try {
    const furniture = await FurnitureModel.getAllFurniture();
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getFurnitureById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const furniture = await FurnitureModel.getFurnitureById(Number(id));
    if (!furniture) {
      return res.status(404).json({ ok: false, message: "Furniture not found" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};


const createFurniture = async (req: any, res: any) => {
  try {
    const data = req.body;

    // Validar los campos requeridos
    if (!data.nombre_descripcion || !data.cantidad || !data.numero_identificacion) {
      return res.status(400).json({
        ok: false,
        message: "Description, quantity, and identification number are required",
      });
    }

    // Crear el mueble
    const newFurniture = await FurnitureModel.createFurniture(data);
    res.status(201).json({ ok: true, furniture: newFurniture });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


const updateFurniture = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await FurnitureModel.updateFurniture(Number(id), data);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Furniture not found" });
    }
    res.status(200).json({ ok: true, message: "Furniture updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteFurniture = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await FurnitureModel.deleteFurniture(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Furniture not found" });
    }
    res.status(200).json({ ok: true, message: "Furniture deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const FurnitureController = {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};