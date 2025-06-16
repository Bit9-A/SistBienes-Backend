import { SubGroupModel } from "./subgroup.model";

// Controladores para SubGrupoMuebles
const getAllSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const subgrupos = await SubGroupModel.getAllSubGrupoMuebles();
    if (!subgrupos || subgrupos.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron subgrupos de muebles" });
    }
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    console.error("Error al obtener los subgrupos de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const getSubGrupoMueblesById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subgrupo = await SubGroupModel.getSubGrupoMueblesById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    console.error("Error al obtener el subgrupo de muebles por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const createSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el código son obligatorios" });
    }
    const newSubGrupo = await SubGroupModel.createSubGrupoMuebles(nombre, codigo);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    console.error("Error al crear el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const updateSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el código son obligatorios" });
    }
    const result = await SubGroupModel.updateSubGrupoMuebles(Number(id), nombre, codigo);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const deleteSubGrupoMuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await SubGroupModel.deleteSubGrupoMuebles(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Controladores para SubGrupoInmuebles
const getAllSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const subgrupos = await SubGroupModel.getAllSubGrupoInmuebles();
    if (!subgrupos || subgrupos.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron subgrupos de inmuebles" });
    }
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    console.error("Error al obtener los subgrupos de inmuebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const getSubGrupoInmueblesById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subgrupo = await SubGroupModel.getSubGrupoInmueblesById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    console.error("Error al obtener el subgrupo de inmuebles por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const createSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const newSubGrupo = await SubGroupModel.createSubGrupoInmuebles(nombre);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    console.error("Error al crear el subgrupo de inmuebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const updateSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const result = await SubGroupModel.updateSubGrupoInmuebles(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el subgrupo de inmuebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const deleteSubGrupoInmuebles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await SubGroupModel.deleteSubGrupoInmuebles(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el subgrupo de inmuebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
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
