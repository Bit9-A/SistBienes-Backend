import { SubGroupModel } from "./subgroup.model";

// Controladores para SubGrupoActivos

// Este controlador maneja la obtención de todos los subgrupos de muebles activos
const getAllSubGrupoActivos = async (req: any, res: any) => {
  try {
    const subgrupos = await SubGroupModel.getAllSubGrupoActivos();
    if (!subgrupos || subgrupos.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron subgrupos de muebles" });
    }
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    console.error("Error al obtener los subgrupos de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de un subgrupo de muebles por su ID
const getSubGrupoActivosById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subgrupo = await SubGroupModel.getSubGrupoActivosById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    console.error("Error al obtener el subgrupo de muebles por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la creación de un nuevo subgrupo de muebles activos
const createSubGrupoActivos = async (req: any, res: any) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el código son obligatorios" });
    }
    const newSubGrupo = await SubGroupModel.createSubGrupoActivos(nombre, codigo);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    console.error("Error al crear el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la actualización de un subgrupo de muebles activos
const updateSubGrupoActivos = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el código son obligatorios" });
    }
    const result = await SubGroupModel.updateSubGrupoActivos(Number(id), nombre, codigo);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la eliminación de un subgrupo de muebles activos
const deleteSubGrupoActivos = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await SubGroupModel.deleteSubGrupoActivos(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const SubGroupController = {
  // Controladores para SubGrupoActivos
  getAllSubGrupoActivos,
  getSubGrupoActivosById,
  createSubGrupoActivos,
  updateSubGrupoActivos,
  deleteSubGrupoActivos,
};
