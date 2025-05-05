import { SubGroupModel } from "../models/subgroup.model";

// Controladores para SubGrupoMuebles
const getAllSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const subgrupos = await SubGroupModel.getAllSubGrupoMuebles();
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getSubGrupoMueblesById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subgrupo = await SubGroupModel.getSubGrupoMueblesById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Name and code are required" });
    }
    const newSubGrupo = await SubGroupModel.createSubGrupoMuebles(nombre, codigo);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Name and code are required" });
    }
    const result = await SubGroupModel.updateSubGrupoMuebles(Number(id), nombre, codigo);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, message: "Subgroup updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await SubGroupModel.deleteSubGrupoMuebles(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, message: "Subgroup deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Controladores para SubGrupoInmuebles
const getAllSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const subgrupos = await SubGroupModel.getAllSubGrupoInmuebles();
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: (error instanceof Error) ? error.message : "Unknown error" });  }
};

const getSubGrupoInmueblesById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subgrupo = await SubGroupModel.getSubGrupoInmueblesById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: (error instanceof Error) ? error.message : "Unknown error" });  }
};

const createSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }
    const newSubGrupo = await SubGroupModel.createSubGrupoInmuebles(nombre);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: (error instanceof Error) ? error.message : "Unknown error" });  }
};

const updateSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Name is required" });
    }
    const result = await SubGroupModel.updateSubGrupoInmuebles(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, message: "Subgroup updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: (error instanceof Error) ? error.message : "Unknown error" });  }
};

const deleteSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await SubGroupModel.deleteSubGrupoInmuebles(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgroup not found" });
    }
    res.status(200).json({ ok: true, message: "Subgroup deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: (error instanceof Error) ? error.message : "Unknown error" });  }
};

export const SubGroupController = {
  // Controladores para SubGrupoMuebles
  getAllSubGrupoMuebles,
  getSubGrupoMueblesById,
  createSubGrupoMuebles,
  updateSubGrupoMuebles,
  deleteSubGrupoMuebles,

  // Controladores para SubGrupoInmuebles
  getAllSubGrupoInmuebles,
  getSubGrupoInmueblesById,
  createSubGrupoInmuebles,
  updateSubGrupoInmuebles,
  deleteSubGrupoInmuebles,
};