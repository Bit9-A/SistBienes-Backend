import { pool } from "../../database/index";

// CRUD para la tabla `Marca`
const getAllMarcas = async () => {
  const query = `
    SELECT id, nombre
    FROM Marca
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getMarcaById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM Marca
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createMarca = async (nombre: string) => {
  const query = `
    INSERT INTO Marca (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);
  return {
    id: (result as any).insertId,
    nombre,
  };
};

const updateMarca = async (id: number, nombre: string) => {
  const query = `
    UPDATE Marca
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, id]);
  return result;
};

const deleteMarca = async (id: number) => {
  const query = `
    DELETE FROM Marca
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// CRUD para la tabla `Modelo`
const getAllModelos = async () => {
  const query = `
    SELECT id, nombre, idmarca
    FROM Modelo
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getModeloById = async (id: number) => {
  const query = `
    SELECT id, nombre, idmarca
    FROM Modelo
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createModelo = async (nombre: string, idmarca: number) => {
  const query = `
    INSERT INTO Modelo (nombre, idmarca)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [nombre, idmarca]);
  return {
    id: (result as any).insertId,
    nombre,
    idmarca,
  };
};

const updateModelo = async (id: number, nombre: string, idmarca: number) => {
  const query = `
    UPDATE Modelo
    SET nombre = ?, idmarca = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, idmarca, id]);
  return result;
};

const deleteModelo = async (id: number) => {
  const query = `
    DELETE FROM Modelo
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Obtener todos los modelos de una marca
const getModelsByMarca = async (idmarca: number) => {
  const query = `
    SELECT id, nombre
    FROM Modelo
    WHERE idmarca = ?
  `;
  const [rows] = await pool.execute(query, [idmarca]);
  return rows as any[];
};

export const MarcaModeloModel = {
  // Métodos para `Marca`
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,

  // Métodos para `Modelo`
  getAllModelos,
  getModeloById,
  createModelo,
  updateModelo,
  getModelsByMarca,
  deleteModelo,
};
