
import { MarcaModeloModel } from "../marca_modelo/marca_modelo.model";

// Controladores para `marca`
const getAllMarcas = async (req: any, res: any) => {
  try {
    const marcas = await MarcaModeloModel.getAllMarcas();
    res.status(200).json({ ok: true, marcas });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getMarcaById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const marca = await MarcaModeloModel.getMarcaById(Number(id));
    if (!marca) {
      return res.status(404).json({ ok: false, message: "Marca not found" });
    }
    res.status(200).json({ ok: true, marca });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createMarca = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "The 'nombre' field is required." });
    }
    const newMarca = await MarcaModeloModel.createMarca(nombre);
    res.status(201).json({ ok: true, marca: newMarca });
  } catch (error:any) {
    //error para marca que ya existe
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ ok: false, message: "Marca already exists" });
    }
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateMarca = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "The 'nombre' field is required." });
    }
    const result = await MarcaModeloModel.updateMarca(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca not found" });
    }
    res.status(200).json({ ok: true, message: "Marca updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteMarca = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await MarcaModeloModel.deleteMarca(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca not found" });
    }
    res.status(200).json({ ok: true, message: "Marca deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// Controladores para `modelo`
const getAllModelos = async (req: any, res: any) => {
  try {
    const modelos = await MarcaModeloModel.getAllModelos();
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getModeloById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const modelo = await MarcaModeloModel.getModeloById(Number(id));
    if (!modelo) {
      return res.status(404).json({ ok: false, message: "Modelo not found" });
    }
    res.status(200).json({ ok: true, modelo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createModelo = async (req: any, res: any) => {
  try {
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "The 'nombre' and 'idmarca' fields are required." });
    }
    const newModelo = await MarcaModeloModel.createModelo(nombre, idmarca);
    res.status(201).json({ ok: true, modelo: newModelo });
  } catch (error) {
    
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateModelo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "The 'nombre' and 'idmarca' fields are required." });
    }
    const result = await MarcaModeloModel.updateModelo(Number(id), nombre, idmarca);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo not found" });
    }
    res.status(200).json({ ok: true, message: "Modelo updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteModelo = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await MarcaModeloModel.deleteModelo(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo not found" });
    }
    res.status(200).json({ ok: true, message: "Modelo deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};
// Controlador para obtener todos los modelos de una marca
const getModelsByMarca = async (req: any, res: any) => {
  try {
    const { idmarca } = req.params;
    const modelos = await MarcaModeloModel.getModelsByMarca(Number(idmarca));
    if (!modelos) {
      return res.status(404).json({ ok: false, message: "No models found for this brand" });
    }
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
}
;

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