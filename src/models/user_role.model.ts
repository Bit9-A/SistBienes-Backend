import { pool } from "../database/index";

const getAllUserRoles = async () => {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const findUserRoleById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

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

const updateUserRole = async (id: number, name: string) => {
  const query = `
    UPDATE TipoUsuario
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [name, id]);
  return result;
};

const deleteUserRole = async (id: number) => {
  const query = `
    DELETE FROM UserRole
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const UserRoleModel = {
  getAllUserRoles,
  findUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};