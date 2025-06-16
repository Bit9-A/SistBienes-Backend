import { FurnitureModel } from "./furniture.model";

const getAllFurniture = async (req: any, res: any) => {
  try {
    const furniture = await FurnitureModel.getAllFurniture();
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron muebles" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    console.error("Error al obtener los muebles:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getFurnitureById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const furniture = await FurnitureModel.getFurnitureById(Number(id));
    if (!furniture) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    console.error("Error al obtener el mueble por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const createFurniture = async (req: any, res: any) => {
  try {
    const data = req.body;

    // Validar los campos requeridos
    if (!data.nombre_descripcion || !data.cantidad || !data.numero_identificacion) {
      return res.status(400).json({
        ok: false,
        message: "La descripción, la cantidad y el número de identificación son obligatorios",
      });
    }

    // Crear el mueble
    const newFurniture = await FurnitureModel.createFurniture(data);
    res.status(201).json({ ok: true, furniture: newFurniture });
  } catch (error) {
    console.error("Error al crear el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const updateFurniture = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await FurnitureModel.updateFurniture(Number(id), data);
    if (!result) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Mueble actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const deleteFurniture = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await FurnitureModel.deleteFurniture(Number(id));
    if (!result) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Mueble eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const FurnitureController = {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};
