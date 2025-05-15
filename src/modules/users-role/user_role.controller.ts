import { Request, Response } from "express";
import { UserRoleModel } from "./user_role.model";

const getAllUserRoles = async (req: any, res: any) => {
  try {
    const roles = await UserRoleModel.getAllUserRoles();
    res.status(200).json({ ok: true, roles });
  } catch (error) {
    console.error("Get All UserRoles error:", error);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserRoleById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "UserRole not found" });
    }
    res.status(200).json({ ok: true, userRole });
  } catch (error) {
    console.error("Get UserRole error:", error);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const createUserRole = async (req: any, res: any) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "The 'name' field is required." });
    }

    const newUserRole = await UserRoleModel.createUserRole(name);
    res.status(201).json({ ok: true, userRole: newUserRole });
  } catch (error) {
    console.error("Create UserRole error:", error);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateUserRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "The 'name' field is required." });
    }

    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "UserRole not found" });
    }

    await UserRoleModel.updateUserRole(Number(id), name);
    res.status(200).json({ ok: true, message: "UserRole updated successfully" });
  } catch (error) {
    console.error("Update UserRole error:", error);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteUserRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "UserRole not found" });
    }

    await UserRoleModel.deleteUserRole(Number(id));
    res.status(200).json({ ok: true, message: "UserRole deleted successfully" });
  } catch (error) {
    console.error("Delete UserRole error:", error);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const UserRoleController = {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};