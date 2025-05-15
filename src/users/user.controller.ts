import { Request, Response } from "express";
import { UserModel } from "../users/user.model";

const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUsersByDeptId = async (req: any, res: any) => {
  try {
    const { dept_id } = req.params;
    const users = await UserModel.getUsersByDeptId(Number(dept_id));
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error fetching users by department ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.updateUser(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await UserModel.deleteUser(Number(id));
    return res.status(200).json({ ok: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const UserController = {
  getAllUsers,
  getUserById,
  getUsersByDeptId,
  updateUser,
  deleteUser,
};