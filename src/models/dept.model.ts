import { pool } from "../database/index";

const getAllDepartments = async () => {
  const query = `
    SELECT id, nombre
    FROM Dept
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getDepartmentById = async (id: number) => {
  const query = `
    SELECT id, nombre
    FROM Dept
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createDepartment = async (nombre: string) => {
  const query = `
    INSERT INTO Dept (nombre)
    VALUES (?)
  `;
  const [result] = await pool.execute(query, [nombre]);
  return {
    id: (result as any).insertId,
    nombre,
  };
};

const updateDepartment = async (id: number, nombre: string) => {
  const query = `
    UPDATE Dept
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, id]);
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