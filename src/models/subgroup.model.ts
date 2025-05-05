import { pool } from "../database/index";

// CRUD para SubGrupoMuebles
const getAllSubGrupoMuebles = async () => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubGrupoMuebles
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getSubGrupoMueblesById = async (id: number) => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubGrupoMuebles
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createSubGrupoMuebles = async (nombre: string, codigo: string) => {
  const query = `
    INSERT INTO SubGrupoMuebles (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [nombre, codigo]);
  return {
    id: (result as any).insertId,
    nombre,
    codigo,
  };
};

const updateSubGrupoMuebles = async (id: number, nombre: string, codigo: string) => {
  const query = `
    UPDATE SubGrupoMuebles
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, codigo, id]);
  return result;
};

const deleteSubGrupoMuebles = async (id: number) => {
  const query = `
    DELETE FROM SubGrupoMuebles
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// CRUD para SubGrupoInmuebles
const getAllSubGrupoInmuebles = async () => {
  const query = `
    SELECT id, nombre
    FROM SubGrupoInmuebles
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getSubGrupoInmueblesById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM SubGrupoInmuebles
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createSubGrupoInmuebles = async (nombre: string) => {
  const query = `
    INSERT INTO SubGrupoInmuebles (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);
  return {
    id: (result as any).insertId,
    nombre,
  };
};

const updateSubGrupoInmuebles = async (id: number, nombre: string) => {
  const query = `
    UPDATE SubGrupoInmuebles
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, id]);
  return result;
};

const deleteSubGrupoInmuebles = async (id: number) => {
  const query = `
    DELETE FROM SubGrupoInmuebles
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const SubGroupModel = {
  // Métodos para SubGrupoMuebles
  getAllSubGrupoMuebles,
  getSubGrupoMueblesById,
  createSubGrupoMuebles,
  updateSubGrupoMuebles,
  deleteSubGrupoMuebles,

  // Métodos para SubGrupoInmuebles
  getAllSubGrupoInmuebles,
  getSubGrupoInmueblesById,
  createSubGrupoInmuebles,
  updateSubGrupoInmuebles,
  deleteSubGrupoInmuebles,
};