import { Request, Response } from "express";
import { TipoUsuarioModel } from "../models/user_role.model";

const createTipoUsuario = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Please provide the 'nombre' field." });
    }

    const newTipoUsuario = await TipoUsuarioModel.createTipoUsuario({ nombre });

    return res.status(201).json({
      ok: true,
      tipoUsuario: newTipoUsuario,
    });
  } catch (error) {
    console.error("Create TipoUsuario error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getTipoUsuarioById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const tipoUsuario = await TipoUsuarioModel.findTipoUsuarioById(Number(id));
    if (!tipoUsuario) {
      return res.status(404).json({ ok: false, message: "TipoUsuario not found" });
    }

    return res.status(200).json({ ok: true, tipoUsuario });
  } catch (error) {
    console.error("Get TipoUsuario error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateTipoUsuario = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tipoUsuario = await TipoUsuarioModel.findTipoUsuarioById(Number(id));
    if (!tipoUsuario) {
      return res.status(404).json({ ok: false, message: "TipoUsuario not found" });
    }

    await TipoUsuarioModel.updateTipoUsuario(Number(id), updates);

    return res.status(200).json({ ok: true, message: "TipoUsuario updated successfully" });
  } catch (error) {
    console.error("Update TipoUsuario error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteTipoUsuario = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const tipoUsuario = await TipoUsuarioModel.findTipoUsuarioById(Number(id));
    if (!tipoUsuario) {
      return res.status(404).json({ ok: false, message: "TipoUsuario not found" });
    }

    await TipoUsuarioModel.deleteTipoUsuario(Number(id));

    return res.status(200).json({ ok: true, message: "TipoUsuario deleted successfully" });
  } catch (error) {
    console.error("Delete TipoUsuario error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const TipoUsuarioController = {
  createTipoUsuario,
  getTipoUsuarioById,
  updateTipoUsuario,
  deleteTipoUsuario,
};