import { ParishModel } from "./parish.model";

// Este controlador maneja las operaciones relacionadas con las parroquias

// Este controlador maneja la obtención de todas las parroquias
const getAllParishes = async (req: any, res: any) => {
  try {
    const parishes = await ParishModel.getAllParishes();
    if (!parishes || parishes.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron parroquias" });
    }
    res.status(200).json({ ok: true, parishes });
  } catch (error) {
    console.error("Error al obtener las parroquias:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de una parroquia por su ID
const getParishById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const parish = await ParishModel.getParishById(Number(id));
    if (!parish) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, parish });
  } catch (error) {
    console.error("Error al obtener la parroquia por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la creación de una nueva parroquia
const createParish = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const newParish = await ParishModel.createParish(nombre);
    res.status(201).json({ ok: true, parish: newParish });
  } catch (error) {
    console.error("Error al crear la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la actualización de una parroquia existente
const updateParish = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const result = await ParishModel.updateParish(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Parroquia actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la eliminación de una parroquia por su ID
const deleteParish = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await ParishModel.deleteParish(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Parroquia eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Exportamos el controlador para que pueda ser utilizado en las rutas
export const ParishController = {
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish,
};
