import { pool } from "../../database/index";

// CRUD para SubgrupoActivos
const getAllSubGrupoActivos = async () => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getSubGrupoActivosById = async (id: number) => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createSubGrupoActivos = async (nombre: string, codigo: string) => {
  const query = `
    INSERT INTO SubgrupoActivos (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [nombre, codigo]);
  return {
    id: (result as any).insertId,
    nombre,
    codigo,
  };
};

const updateSubGrupoActivos = async (id: number, nombre: string, codigo: string) => {
  const query = `
    UPDATE SubgrupoActivos
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, codigo, id]);
  return result;
};

const deleteSubGrupoActivos = async (id: number) => {
  const query = `
    DELETE FROM SubgrupoActivos
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportar el modelo
export const SubGroupModel = {
  // Métodos para SubgrupoActivos
  getAllSubGrupoActivos,
  getSubGrupoActivosById,
  createSubGrupoActivos,
  updateSubGrupoActivos,
  deleteSubGrupoActivos,
};
