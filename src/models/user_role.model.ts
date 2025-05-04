import { pool } from "../database/index";

const createTipoUsuario = async ({
  nombre,
}: {
  nombre: string;
}) => {
  const query = `
    INSERT INTO TipoUsuario (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);

  // Recuperar el registro recién creado
  const tipoUsuarioQuery = `
    SELECT id, nombre
    FROM TipoUsuario
    WHERE id = ?
  `;
  const [rows] = await pool.execute(tipoUsuarioQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};

const findTipoUsuarioById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const updateTipoUsuario = async (id: number, updates: Partial<{
  nombre: string;
}>) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updates);
  const query = `
    UPDATE TipoUsuario
    SET ${fields}
    WHERE id = ?
  `;
  await pool.execute(query, [...values, id]);
};

const deleteTipoUsuario = async (id: number) => {
  const query = `
    DELETE FROM TipoUsuario
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

export const TipoUsuarioModel = {
  createTipoUsuario,
  findTipoUsuarioById,
  updateTipoUsuario,
  deleteTipoUsuario,
};