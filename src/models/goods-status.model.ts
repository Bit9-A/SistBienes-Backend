import { pool } from "../database/index";

const createEstadoBien = async ({
  nombre,
}: {
  nombre: string;
}) => {
  const query = `
    INSERT INTO EstadoBien (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);

  // Recuperar el registro recién creado
  const estadoBienQuery = `
    SELECT id, nombre
    FROM EstadoBien
    WHERE id = ?
  `;
  const [rows] = await pool.execute(estadoBienQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};

const findEstadoBienById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM EstadoBien
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const updateEstadoBien = async (id: number, updates: Partial<{
  nombre: string;
}>) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updates);
  const query = `
    UPDATE EstadoBien
    SET ${fields}
    WHERE id = ?
  `;
  await pool.execute(query, [...values, id]);
};

const deleteEstadoBien = async (id: number) => {
  const query = `
    DELETE FROM EstadoBien
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

export const EstadoBienModel = {
  createEstadoBien,
  findEstadoBienById,
  updateEstadoBien,
  deleteEstadoBien,
};