import { UserModel } from "./user.model";

const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await UserModel.getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron usuarios" });
    }
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getUserById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getUsersByDeptId = async (req: any, res: any) => {
  try {
    const { dept_id } = req.params;
    const users = await UserModel.getUsersByDeptId(Number(dept_id));
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron usuarios para este departamento" });
    }
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error al obtener los usuarios por ID de departamento:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const updateUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    // Attempt to find the existing user first
    const existingUser = await UserModel.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    const updatedUser = await UserModel.updateUser(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "Usuario actualizado con éxito",
      updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    // Check if the user exists first
    const existingUser = await UserModel.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    await UserModel.deleteUser(Number(id));
    return res.status(200).json({ ok: true, message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
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
