import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los subgrupos de muebles activos

// Este modelo maneja la obtención de todos los subgrupos de muebles activos
const getAllSubGrupoActivos = async () => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de un subgrupo de muebles por su ID
const getSubGrupoActivosById = async (id: number) => {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo subgrupo de muebles activos
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

// Este modelo maneja la actualización de un subgrupo de muebles activos
const updateSubGrupoActivos = async (id: number, nombre: string, codigo: string) => {
  const query = `
    UPDATE SubgrupoActivos
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, codigo, id]);
  return result;
};

// Este modelo maneja la eliminación de un subgrupo de muebles activos por su ID
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
