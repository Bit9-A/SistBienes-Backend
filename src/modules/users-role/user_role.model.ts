import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los roles de usuario

// Este modelo maneja la obtención de todos los roles de usuario
const getAllUserRoles = async () => {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de un rol de usuario por su ID
const findUserRoleById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo rol de usuario
const createUserRole = async (name: string) => {
  const query = `
    INSERT INTO TipoUsuario (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [name]);
  return {
    id: (result as any).insertId,
    name,
  };
};

// Este modelo maneja la actualización de un rol de usuario existente
const updateUserRole = async (id: number, name: string) => {
  const query = `
    UPDATE TipoUsuario
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [name, id]);
  return result;
};

// Este modelo maneja la eliminación de un rol de usuario por su ID
const deleteUserRole = async (id: number) => {
  const query = `
    DELETE FROM TipoUsuario
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const UserRoleModel = {
  getAllUserRoles,
  findUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};