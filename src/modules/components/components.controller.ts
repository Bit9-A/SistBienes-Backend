import { ComponentsModel } from "./components.model";

const getAllComponents = async (req: any, res: any) => {
  try {
    const components = await ComponentsModel.getAllComponents();
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getComponentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const component = await ComponentsModel.getComponentById(Number(id));
    if (!component) {
      return res.status(404).json({ ok: false, message: "Component not found" });
    }
    res.status(200).json({ ok: true, component });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createComponent = async (req: any, res: any) => {
  try {
    const { bien_id, nombre, numero_serial } = req.body;
    if (!bien_id || !nombre) {
      return res.status(400).json({ ok: false, message: "bien_id and nombre are required" });
    }
    const newComponent = await ComponentsModel.createComponent({ bien_id, nombre, numero_serial });
    res.status(201).json({ ok: true, component: newComponent });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await ComponentsModel.updateComponent(Number(id), data);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Component not found" });
    }
    res.status(200).json({ ok: true, message: "Component updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await ComponentsModel.deleteComponent(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Component not found" });
    }
    res.status(200).json({ ok: true, message: "Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};


const getComponentsByBienId = async (req: any, res: any) => {
  try {
    const { bien_id } = req.params;
    if (!bien_id) {
      return res.status(400).json({ ok: false, message: "bien_id es requerido" });
    }
    const components = await ComponentsModel.getComponentsByBienId(Number(bien_id));
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};


export const ComponentsController = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsByBienId
};