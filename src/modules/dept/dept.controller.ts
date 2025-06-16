import { DeptModel } from "../dept/dept.model";

const getAllDepartments = async (req: any, res: any) => {
  try {
    const departments = await DeptModel.getAllDepartments();
    res.status(200).json({ ok: true, departments });
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getDepartmentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const department = await DeptModel.getDepartmentById(Number(id));
    if (!department) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, department });
  } catch (error) {
    console.error("Error al obtener departamento por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const createDepartment = async (req: any, res: any) => {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Se requieren tanto el nombre como el código" });
    }
    const newDepartment = await DeptModel.createDepartment(nombre, codigo);
    res.status(201).json({ ok: true, department: newDepartment });
  } catch (error) {
    console.error("Error al crear departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const updateDepartment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Se requieren tanto el nombre como el código" });
    }
    const result = await DeptModel.updateDepartment(Number(id), nombre, codigo);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Departamento actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const deleteDepartment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await DeptModel.deleteDepartment(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Departamento eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const DeptController = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
