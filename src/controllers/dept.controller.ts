
import { DeptModel } from "../models/dept.model";

const getAllDepartments = async (req: any, res: any) => {
  try {
    const departments = await DeptModel.getAllDepartments();
    res.status(200).json({ ok: true, departments });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getDepartmentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const department = await DeptModel.getDepartmentById(Number(id));
    if (!department) {
      return res.status(404).json({ ok: false, message: "Department not found" });
    }
    res.status(200).json({ ok: true, department });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createDepartment = async (req: any, res: any) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Department name is required" });
    }
    const newDepartment = await DeptModel.createDepartment(nombre);
    res.status(201).json({ ok: true, department: newDepartment });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateDepartment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "Department name is required" });
    }
    const result = await DeptModel.updateDepartment(Number(id), nombre);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Department not found" });
    }
    res.status(200).json({ ok: true, message: "Department updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteDepartment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await DeptModel.deleteDepartment(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Department not found" });
    }
    res.status(200).json({ ok: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const DeptController = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};