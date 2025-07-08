import { pool } from "../../database/index";

// Este modelo maneja las operaciones CRUD para los departamentos
const getAllDepartments = async () => {
  const query = `
    SELECT id, nombre, codigo
    FROM Departamento
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de un departamento por su ID
const getDepartmentById = async (id: number) => {
  const query = `
    SELECT id, nombre, codigo
    FROM Departamento
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo departamento
const createDepartment = async (nombre: string, codigo: string) => {
  const query = `
    INSERT INTO Departamento (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [nombre, codigo]);
  return {
    id: (result as any).insertId,
    nombre,
    codigo,
  };
};

// Este modelo maneja la actualización de un departamento existente
const updateDepartment = async (id: number, nombre: string, codigo: string) => {
  const query = `
    UPDATE Departamento
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [nombre, codigo, id]);
  return result;
};

//  Este modelo maneja la eliminación de un departamento por su ID
const deleteDepartment = async (id: number) => {
  const query = `
    DELETE FROM Departamento
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const DeptModel = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
