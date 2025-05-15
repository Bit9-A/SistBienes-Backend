import { pool } from "../database/index";

const getAllDepartments = async () => {
  const query = `
    SELECT id, nombre, codigo
    FROM Dept
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getDepartmentById = async (id: number) => {
  const query = `
    SELECT id, nombre, codigo
    FROM Dept
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createDepartment = async (nombre: string, codigo: string) => {
  const query = `
    INSERT INTO Dept (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [nombre, codigo]);
  return {
    id: (result as any).insertId,
    nombre,
    codigo,
  };
};

const updateDepartment = async (id: number, nombre: string, codigo: string) => {
  const query = `
    UPDATE Dept
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, codigo, id]);
  return result;
};

const deleteDepartment = async (id: number) => {
  const query = `
    DELETE FROM Dept
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const DeptModel = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};