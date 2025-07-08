import { FurnitureModel } from "./furniture.model";

// Este controlador maneja las operaciones CRUD para los muebles

// Este controlador maneja la obtención de todos los muebles
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

// Este controlador maneja la obtención de un mueble por su ID
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

// Este controlador maneja la creación de un nuevo mueble
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

    // Si no viene isComputer o isActive, asignar valores por defecto
    if (typeof data.isComputer === "undefined") data.isComputer = 0;
    if (typeof data.isActive === "undefined") data.isActive = 1;

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

// Este controlador maneja la actualización de un mueble existente
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

// Este controlador maneja la eliminación de un mueble por su ID
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

// Este controlador maneja la obtención de muebles por departamento
const getFurnitureByDepartment = async (req: any, res: any) => {
  try {
    const { deptId } = req.params;
    const furniture = await FurnitureModel.getFurnitureByDepartment(Number(deptId));
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ ok: false, message: "No furniture found for this department" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const FurnitureController = {
  getFurnitureByDepartment,
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};
