import { pool } from "../database/index";

const getAllUsers = async () => {
  const query = `
    SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula
    FROM Usuarios
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getUserById = async (id: number) => {
  const query = `
    SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula
    FROM Usuarios
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const getUsersByDeptId = async (dept_id: number) => {
  const query = `
    SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula
    FROM Usuarios
    WHERE dept_id = ?
  `;
  const [rows] = await pool.execute(query, [dept_id]);
  return rows as any[];
};

const updateUser = async (
  id: number,
  {
    tipo_usuario,
    email,
    nombre,
    apellido,
    telefono,
    dept_id,
    cedula,
  }: {
    tipo_usuario?: number;
    email?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    dept_id?: number;
    cedula?: string;
  }
) => {
  const query = `
    UPDATE Usuarios
    SET 
      tipo_usuario = COALESCE(?, tipo_usuario),
      email = COALESCE(?, email),
      nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      telefono = COALESCE(?, telefono),
      dept_id = COALESCE(?, dept_id),
      cedula = COALESCE(?, cedula)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    tipo_usuario || null,
    email || null,
    nombre || null,
    apellido || null,
    telefono || null,
    dept_id || null,
    cedula || null,
    id,
  ]);
  return result;
};

const deleteUser = async (id: number) => {
  const query = `
    DELETE FROM Usuarios
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const UserModel = {
  getAllUsers,
  getUserById,
  getUsersByDeptId,
  updateUser,
  deleteUser,
};