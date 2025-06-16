import { UserRoleModel } from "./user_role.model";

const getAllUserRoles = async (req: any, res: any) => {
  try {
    const roles = await UserRoleModel.getAllUserRoles();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron roles de usuario" });
    }
    res.status(200).json({ ok: true, roles });
  } catch (error) {
    console.error("Error al obtener todos los roles de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getUserRoleById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }
    res.status(200).json({ ok: true, userRole });
  } catch (error) {
    console.error("Error al obtener el rol de usuario por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const createUserRole = async (req: any, res: any) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "El campo 'name' es obligatorio." });
    }

    const newUserRole = await UserRoleModel.createUserRole(name);
    res.status(201).json({ ok: true, userRole: newUserRole });
  } catch (error) {
    console.error("Error al crear el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const updateUserRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ ok: false, message: "El campo 'name' es obligatorio." });
    }

    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }

    await UserRoleModel.updateUserRole(Number(id), name);
    res.status(200).json({ ok: true, message: "Rol de usuario actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const deleteUserRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userRole = await UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }

    await UserRoleModel.deleteUserRole(Number(id));
    res.status(200).json({ ok: true, message: "Rol de usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
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
