import { pool } from "../../database/index";
// Este modelo maneja las operaciones relacionadas con los usuarios en la base de datos
const createUser = async ({
  tipo_usuario,
  email,
  password,
  nombre,
  apellido,
  telefono,
  dept_id,
  cedula,
  username,
  isActive,
}: {
  tipo_usuario: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  dept_id?: number;
  cedula: string;
  username: string;
  isActive?: boolean;
}) => {
  const query = `
      INSERT INTO Usuarios (tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const [result] = await pool.execute(query, [
    tipo_usuario,
    email,
    password,
    nombre,
    apellido,
    telefono || null,
    dept_id || null,
    cedula,
    username,
    isActive !== undefined ? isActive : true,
  ]);

  // Recuperar el usuario recién creado
  const userQuery = `
      SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula, username, isActive
      FROM Usuarios
      WHERE id = ?
    `;
  const [rows] = await pool.execute(userQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};
// Funciones para manejar la autenticación de usuarios
const findUserByEmail = async (email: string) => {
  const query = `
    SELECT id, tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive
    FROM Usuarios
    WHERE email = ?
  `;
  const [rows] = await pool.execute(query, [email]);
  return (rows as any[])[0];
};
const findUserPasswordById = async (id: number) => {
  const query = `
    SELECT *
    FROM Usuarios
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};
// Funciones para manejar los tokens de autenticación y restablecimiento de contraseña
const saveLoginToken = async (id: number, token: string, expiration: Date) => {
  const query = `
    UPDATE Usuarios
    SET login_token = ?, login_token_expiration = ?
    WHERE id = ?
  `;
  await pool.execute(query, [token, expiration, id]);
};
// Busca un usuario por su token de inicio de sesión
const findUserByLoginToken = async (token: string) => {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.login_token, u.login_token_expiration, 
           ts.nombre as nombre_tipo_usuario, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    LEFT JOIN TipoUsuario ts ON u.tipo_usuario = ts.id
    WHERE u.login_token = ?
  `;
  const [rows] = await pool.execute(query, [token]);
  return (rows as any[])[0];
};
// Limpia el token de inicio de sesión del usuario
const clearLoginToken = async (id: number) => {
  const query = `
    UPDATE Usuarios
    SET login_token = NULL, login_token_expiration = NULL
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};
// Guarda el token de restablecimiento de contraseña y su expiración
const savePasswordResetToken = async (id: number, token: string, expiration: Date) => {
  const query = `
    UPDATE Usuarios
    SET reset_token = ?, reset_token_expiration = ?
    WHERE id = ?
  `;
  await pool.execute(query, [token, expiration, id]);
};
// Busca un usuario por su token de restablecimiento de contraseña
const findUserByResetToken = async (token: string) => {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.reset_token, u.reset_token_expiration,
           u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.reset_token = ?
  `;
  const [rows] = await pool.execute(query, [token]);
  return (rows as any[])[0];
};
// Limpia el token de restablecimiento de contraseña del usuario
const clearPasswordResetToken = async (id: number) => {
  const query = `
    UPDATE Usuarios
    SET reset_token = NULL, reset_token_expiration = NULL
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};
// Actualiza la contraseña del usuario
const updateUserPassword = async (id: number, password: string) => {
  const query = `
    UPDATE Usuarios
    SET password = ?
    WHERE id = ?
  `;
  await pool.execute(query, [password, id]);
};
// Busca un usuario por su nombre de usuario
const findUserByUsername = async (username: string) => {
  const query = `SELECT * FROM Usuarios WHERE username = ?`;
  const [rows] = await pool.execute(query, [username]);
  return (rows as any[])[0];
};
// Busca un usuario por su cédula
const findUserByCedula = async (cedula: string) => {
  const query = `SELECT * FROM Usuarios WHERE cedula = ?`;
  const [rows] = await pool.execute(query, [cedula]);
  return (rows as any[])[0];
};
// Exporta las funciones del modelo de autenticación
export const AuthModel = {
  createUser,
  findUserByEmail,
  saveLoginToken,
  findUserByLoginToken,
  clearLoginToken,
  savePasswordResetToken,
  findUserByResetToken,
  clearPasswordResetToken,
  updateUserPassword,
  findUserByUsername,
  findUserByCedula,
  findUserPasswordById,
};
