import { pool } from "../../database/index";
// Este modelo maneja las operaciones relacionadas con las parroquias

// Este modelo maneja la obtención de todas las parroquias
const getAllParishes = async () => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de una parroquia por su ID
const getParishById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM Parroquia
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la creación de una nueva parroquia
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

// Este modelo maneja la actualización de una parroquia existente
const updateParish = async (id: number, nombre: string) => {
  const query = `
    UPDATE Parroquia
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, id]);
  return result;
};

// Este modelo maneja la eliminación de una parroquia por su ID
const deleteParish = async (id: number) => {
  const query = `
    DELETE FROM Parroquia
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const ParishModel = {
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish,
};
