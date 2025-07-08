import { pool } from "../../database/index";
// Este modelo maneja las operaciones relacionadas con los usuarios

// Este modelo maneja la obtención de todos los usuarios
const getAllUsers = async () => {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de un usuario por su ID
const getUserById = async (id: number) => {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la obtención de usuarios por ID de departamento
const getUsersByDeptId = async (dept_id: number) => {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.dept_id = ?
  `;
  const [rows] = await pool.execute(query, [dept_id]);
  return rows as any[];
};

// Este modelo maneja la actualización de un usuario existente
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
    username,
    isActive,
  }: {
    tipo_usuario?: number;
    email?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    dept_id?: number;
    cedula?: string;
    username?: string;
    isActive?: number;
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
      cedula = COALESCE(?, cedula),
      username = COALESCE(?, username),
      isActive = COALESCE(?, isActive)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    tipo_usuario ?? null,
    email ?? null,
    nombre ?? null,
    apellido ?? null,
    telefono ?? null,
    dept_id ?? null,
    cedula ?? null,
    username ?? null,
    isActive !== undefined ? isActive : null,
    id,
  ]);
  return result;
};

// Este modelo maneja la eliminación de un usuario por su ID
const deleteUser = async (id: number) => {
  const query = `
    DELETE FROM Usuarios
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const UserModel = {
  getAllUsers,
  getUserById,
  getUsersByDeptId,
  updateUser,
  deleteUser,
};