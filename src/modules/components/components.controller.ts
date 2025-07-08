import { ComponentsModel } from "./components.model";

// Este controlador maneja las operaciones CRUD para los componentes
const getAllComponents = async (req: any, res: any) => {
  try {
    const components = await ComponentsModel.getAllComponents();
    if (!components) {
      return res.status(404).json({ ok: false, message: "Componentes no encontrados" });
    }
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de un componente por su ID
const getComponentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const component = await ComponentsModel.getComponentById(Number(id));
    if (!component) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, component });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la creación de un nuevo componente
const createComponent = async (req: any, res: any) => {
  try {
    const { bien_id, nombre, numero_serial } = req.body;
    if (!bien_id || !nombre) {
      return res.status(400).json({ ok: false, message: "Id y nombre son obligatorios" });
    }
    const newComponent = await ComponentsModel.createComponent({ bien_id, nombre, numero_serial });
    res.status(201).json({ ok: true, component: newComponent });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la actualización de un componente existente
const updateComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await ComponentsModel.updateComponent(Number(id), data);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la eliminación de un componente por su ID
const deleteComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await ComponentsModel.deleteComponent(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Este controlador maneja la obtención de componentes por el ID del bien asociado
const getComponentsByBienId = async (req: any, res: any) => {
  try {
    const { bien_id } = req.params;
    if (!bien_id) {
      return res.status(400).json({ ok: false, message: "Id es requerido" });
    }
    const components = await ComponentsModel.getComponentsByBienId(Number(bien_id));
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const ComponentsController = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsByBienId
};