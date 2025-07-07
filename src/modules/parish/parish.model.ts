import { pool } from "../../database/index";

const getAllParishes = async () => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getParishById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createParish = async (nombre: string) => {
  const query = `
    INSERT INTO Parroquia (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);
  return {
    id: (result as any).insertId,
    nombre,
  };
};

const updateParish = async (id: number, nombre: string) => {
  const query = `
    UPDATE Parroquia
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, id]);
  return result;
};

const deleteParish = async (id: number) => {
  const query = `
    DELETE FROM Parroquia
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const ParishModel = {
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish,
};
