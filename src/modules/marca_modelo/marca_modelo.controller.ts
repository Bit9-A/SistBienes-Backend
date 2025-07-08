import { MarcaModeloModel } from "./marca_modelo.model";

// Este controlador maneja las operaciones relacionadas con la marca 

// Este controlador maneja la obtención de todas las marcas
const getAllMarcas = async (req: any, res: any) => {
  try {
    const marcas = await MarcaModeloModel.getAllMarcas();
    res.status(200).json({ ok: true, marcas });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de una marca por su ID
const getMarcaById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const marca = await MarcaModeloModel.getMarcaById(Number(id));
    if (!marca) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, marca });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la creación de una nueva marca
const createMarca = async (req: any, res: any) => {
  try {
    const { nombre } = req.body; // Validación del campo 'nombre'
    // Verificar si el campo 'nombre' está vacío o no existe
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El campo 'nombre' es obligatorio." });
    }
    const newMarca = await MarcaModeloModel.createMarca(nombre);
    res.status(201).json({ ok: true, marca: newMarca });
  } catch (error: any) {
    // Error para marca que ya existe
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ ok: false, message: "La marca ya existe" });
    }
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la actualización de una marca existente
const updateMarca = async (req: any, res: any) => {
  try {
    // Validación del campo 'nombre' y obtención del ID de la marca a actualizar
    const { id } = req.params;
    const { nombre } = req.body; // Validación del campo 'nombre'
    // Verificar si el campo 'nombre' está vacío o no existe
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El campo 'nombre' es obligatorio." });
    }
    const result = await MarcaModeloModel.updateMarca(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Marca actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la eliminación de una marca existente
const deleteMarca = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await MarcaModeloModel.deleteMarca(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Marca eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Controladores para `modelo`
// Este controlador maneja la obtención de todos los modelos
const getAllModelos = async (req: any, res: any) => {
  try {
    const modelos = await MarcaModeloModel.getAllModelos();
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de un modelo por su ID
const getModeloById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const modelo = await MarcaModeloModel.getModeloById(Number(id));
    if (!modelo) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, modelo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la creación de un nuevo modelo
const createModelo = async (req: any, res: any) => {
  try {
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "Los campos 'nombre' e 'idmarca' son obligatorios." });
    }
    const newModelo = await MarcaModeloModel.createModelo(nombre, idmarca);
    res.status(201).json({ ok: true, modelo: newModelo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la actualización de un modelo existente
const updateModelo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "Los campos 'nombre' e 'idmarca' son obligatorios." });
    }
    const result = await MarcaModeloModel.updateModelo(Number(id), nombre, idmarca);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Modelo actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la eliminación de un modelo existente
const deleteModelo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await MarcaModeloModel.deleteModelo(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Modelo eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Controlador para obtener todos los modelos de una marca
const getModelsByMarca = async (req: any, res: any) => {
  try {
    const { idmarca } = req.params;
    const modelos = await MarcaModeloModel.getModelsByMarca(Number(idmarca));
    if (!modelos) {
      return res.status(404).json({ ok: false, message: "No se encontraron modelos para esta marca" });
    }
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const MarcaModeloController = {
  // Controladores para `marca`
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,

  // Controladores para `modelo`
  getAllModelos,
  getModeloById,
  createModelo,
  updateModelo,
  getModelsByMarca,
  deleteModelo,
};
