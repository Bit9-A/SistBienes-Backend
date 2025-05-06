import { ParroquiaModel } from "../models/parish.model";

const createParroquia = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Please provide the 'nombre' field." });
    }

    const newParroquia = await ParroquiaModel.createParroquia({ nombre });

    return res.status(201).json({
      ok: true,
      parroquia: newParroquia,
    });
  } catch (error) {
    console.error("Create Parroquia error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const getAllParroquias = async (req: any, res: any) => {
    try {
      const parroquias = await ParroquiaModel.findAllParroquia();
  
      return res.status(200).json({ ok: true, parroquias });
    } catch (error) {
      console.error("Get All Parroquias error:", error);
      return res.status(500).json({
        ok: false,
        msg: "Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

const getParroquiaById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const parroquia = await ParroquiaModel.findParroquiaById(Number(id));
    if (!parroquia) {
      return res.status(404).json({ ok: false, message: "Parroquia not found" });
    }

    return res.status(200).json({ ok: true, parroquia });
  } catch (error) {
    console.error("Get Parroquia error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateParroquia = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const parroquia = await ParroquiaModel.findParroquiaById(Number(id));
    if (!parroquia) {
      return res.status(404).json({ ok: false, message: "Parroquia not found" });
    }

    await ParroquiaModel.updateParroquia(Number(id), updates);

    return res.status(200).json({ ok: true, message: "Parroquia updated successfully" });
  } catch (error) {
    console.error("Update Parroquia error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteParroquia = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const parroquia = await ParroquiaModel.findParroquiaById(Number(id));
    if (!parroquia) {
      return res.status(404).json({ ok: false, message: "Parroquia not found" });
    }

    await ParroquiaModel.deleteParroquia(Number(id));

    return res.status(200).json({ ok: true, message: "Parroquia deleted successfully" });
  } catch (error) {
    console.error("Delete Parroquia error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const ParroquiaController = {
  createParroquia,
  getParroquiaById,
  updateParroquia,
  deleteParroquia,
  getAllParroquias
};