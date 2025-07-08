import { Request, Response } from "express";
import { IncorpModel } from "./incorp.model";

// Obtener una lista de incorporaciones
const getAllIncorps = async (req: any, res: any) => {
  try {
    const incorps = await IncorpModel.getAllIncorps();
    if (!incorps || incorps.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron incorporaciones" });
    }
    return res.status(200).json({
      ok: true,
      incorps,
    });
  } catch (error) {
    console.error("Error al obtener todas las incorporaciones:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

// Este controlador maneja la creación de una nueva incorporación
const createIncorp = async (req: any, res: any) => {
  try {
    const { bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones } = req.body;
    console.log("Datos recibidos en backend:", req.body);

    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
      return res.status(400).json({ ok: false, message: "Por favor, complete todos los campos requeridos." });
    }

    const newIncorp = await IncorpModel.createIncorp({
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
      isActive: isActive !== undefined ? isActive : 1, // Default to active if not provided
      observaciones: observaciones || "", // Default to empty string if not provided
    });

    return res.status(201).json({
      ok: true,
      incorp: newIncorp,
    });
  } catch (error) {
    console.error("Error al crear la incorporación:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja la obtención de una incorporación por su ID
const getIncorpById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporación no encontrada" });
    }

    return res.status(200).json({ ok: true, incorp });
  } catch (error) {
    console.error("Error al obtener la incorporación:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja la actualización de una incorporación existente
const updateIncorp = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporación no encontrada" });
    }

    await IncorpModel.updateIncorp(Number(id), updates);

    return res.status(200).json({ ok: true, incorp, message: "Incorporación actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la incorporación:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja la eliminación de una incorporación por su ID
const deleteIncorp = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporación no encontrada" });
    }

    await IncorpModel.deleteIncorp(Number(id));

    return res.status(200).json({ ok: true, message: "Incorporación eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la incorporación:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const IncorpController = {
  createIncorp,
  getIncorpById,
  updateIncorp,
  deleteIncorp,
  getAllIncorps,
};
