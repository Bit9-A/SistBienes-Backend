import { pool } from "../database/index";

const createParroquia = async ({
  nombre,
}: {
  nombre: string;
}) => {
  const query = `
    INSERT INTO Parroquia (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);

  // Recuperar el registro recién creado
  const parroquiaQuery = `
    SELECT id, nombre
    FROM Parroquia
    WHERE id = ?
  `;
  const [rows] = await pool.execute(parroquiaQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};

const findParroquiaById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const findAllParroquia = async () => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const updateParroquia = async (id: number, updates: Partial<{
  nombre: string;
}>) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updates);
  const query = `
    UPDATE Parroquia
    SET ${fields}
    WHERE id = ?
  `;
  await pool.execute(query, [...values, id]);
};

const deleteParroquia = async (id: number) => {
  const query = `
    DELETE FROM Parroquia
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

export const ParroquiaModel = {
  createParroquia,
  findParroquiaById,
  updateParroquia,
  deleteParroquia,
  findAllParroquia
};