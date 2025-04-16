import { pool } from "../database/index";

const createUser = async ({
    tipo_usuario,
    email,
    password,
    nombre,
    apellido,
    telefono,
    dept_id,
    cedula,
  }: {
    tipo_usuario: number;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    dept_id?: number;
    cedula: string;
  }) => {
    const query = `
      INSERT INTO Usuarios (tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    ]);
  
    // Recuperar el usuario recién creado
    const userQuery = `
      SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula
      FROM Usuarios
      WHERE id = ?
    `;
    const [rows] = await pool.execute(userQuery, [(result as any).insertId]);
    return (rows as any[])[0];
  };

const findUserByEmail = async (email: string) => {
  const query = `
    SELECT id, tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula
    FROM Usuarios
    WHERE email = ?
  `;
  const [rows] = await pool.execute(query, [email]);
  return (rows as any[])[0];
};

const saveLoginToken = async (id: number, token: string, expiration: Date) => {
  const query = `
    UPDATE Usuarios
    SET login_token = ?, login_token_expiration = ?
    WHERE id = ?
  `;
  await pool.execute(query, [token, expiration, id]);
};

const findUserByLoginToken = async (token: string) => {
  const query = `
    SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula, login_token, login_token_expiration
    FROM Usuarios
    WHERE login_token = ?
  `;
  const [rows] = await pool.execute(query, [token]);
  return (rows as any[])[0];
};

const clearLoginToken = async (id: number) => {
  const query = `
    UPDATE Usuarios
    SET login_token = NULL, login_token_expiration = NULL
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

const savePasswordResetToken = async (id: number, token: string, expiration: Date) => {
  const query = `
    UPDATE Usuarios
    SET reset_token = ?, reset_token_expiration = ?
    WHERE id = ?
  `;
  await pool.execute(query, [token, expiration, id]);
};

const findUserByResetToken = async (token: string) => {
  const query = `
    SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula, reset_token, reset_token_expiration
    FROM Usuarios
    WHERE reset_token = ?
  `;
  const [rows] = await pool.execute(query, [token]);
  return (rows as any[])[0];
};

const clearPasswordResetToken = async (id: number) => {
  const query = `
    UPDATE Usuarios
    SET reset_token = NULL, reset_token_expiration = NULL
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

const updateUserPassword = async (id: number, password: string) => {
  const query = `
    UPDATE Usuarios
    SET password = ?
    WHERE id = ?
  `;
  await pool.execute(query, [password, id]);
};

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
};