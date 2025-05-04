import { Request, Response } from "express";
import { EstadoBienModel } from "../models/goods-status.model";

const createEstadoBien = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Please provide the 'nombre' field." });
    }

    const newEstadoBien = await EstadoBienModel.createEstadoBien({ nombre });

    return res.status(201).json({
      ok: true,
      estadoBien: newEstadoBien,
    });
  } catch (error) {
    console.error("Create EstadoBien error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getEstadoBienById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const estadoBien = await EstadoBienModel.findEstadoBienById(Number(id));
    if (!estadoBien) {
      return res.status(404).json({ ok: false, message: "EstadoBien not found" });
    }

    return res.status(200).json({ ok: true, estadoBien });
  } catch (error) {
    console.error("Get EstadoBien error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateEstadoBien = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const estadoBien = await EstadoBienModel.findEstadoBienById(Number(id));
    if (!estadoBien) {
      return res.status(404).json({ ok: false, message: "EstadoBien not found" });
    }

    await EstadoBienModel.updateEstadoBien(Number(id), updates);

    return res.status(200).json({ ok: true, message: "EstadoBien updated successfully" });
  } catch (error) {
    console.error("Update EstadoBien error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteEstadoBien = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const estadoBien = await EstadoBienModel.findEstadoBienById(Number(id));
    if (!estadoBien) {
      return res.status(404).json({ ok: false, message: "EstadoBien not found" });
    }

    await EstadoBienModel.deleteEstadoBien(Number(id));

    return res.status(200).json({ ok: true, message: "EstadoBien deleted successfully" });
  } catch (error) {
    console.error("Delete EstadoBien error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const EstadoBienController = {
  createEstadoBien,
  getEstadoBienById,
  updateEstadoBien,
  deleteEstadoBien,
};