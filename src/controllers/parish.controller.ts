
import { ParishModel } from "../models/parish.model";

const getAllParishes = async (req: any, res: any) => {
  try {
    const parishes = await ParishModel.getAllParishes();
    res.status(200).json({ ok: true, parishes });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getParishById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const parish = await ParishModel.getParishById(Number(id));
    if (!parish) {
      return res.status(404).json({ ok: false, message: "Parish not found" });
    }
    res.status(200).json({ ok: true, parish });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createParish = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }
    const newParish = await ParishModel.createParish(nombre);
    res.status(201).json({ ok: true, parish: newParish });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateParish = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }
    const result = await ParishModel.updateParish(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parish not found" });
    }
    res.status(200).json({ ok: true, message: "Parish updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteParish = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await ParishModel.deleteParish(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parish not found" });
    }
    res.status(200).json({ ok: true, message: "Parish deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const ParishController = {
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish,
};