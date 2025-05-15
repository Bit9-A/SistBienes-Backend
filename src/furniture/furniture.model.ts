import { pool } from "../database/index";

const getAllFurniture = async () => {
  const query = `
    SELECT *
    FROM Muebles
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getFurnitureById = async (id: number) => {
  const query = `
    SELECT *
    FROM Muebles
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createFurniture = async (data: {
  subgrupo_id: number;
  cantidad: number;
  nombre_descripcion: string;
  marca_id?: number;
  modelo_id?: number;
  numero_serial?: string;
  valor_unitario?: number;
  valor_total?: number;
  fecha?: string;
  dept_id?: number;
  estado_id?: number;
  parroquia_id?: number;
  numero_identificacion: string;
}) => {
  const query = `
    INSERT INTO Muebles (
      subgrupo_id, cantidad, nombre_descripcion, marca_id, modelo_id, numero_serial,
      valor_unitario, valor_total, fecha, dept_id, estado_id, parroquia_id, numero_identificacion
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    data.subgrupo_id,
    data.cantidad,
    data.nombre_descripcion,
    data.marca_id || null,
    data.modelo_id || null,
    data.numero_serial || null,
    data.valor_unitario || null,
    data.valor_total || null,
    data.fecha || null,
    data.dept_id || null,
    data.estado_id || null,
    data.parroquia_id || null,
    data.numero_identificacion,
  ]);
  return {
    id: (result as any).insertId,
    ...data,
  };
};

const updateFurniture = async (id: number, data: Partial<{
  subgrupo_id: number;
  cantidad: number;
  nombre_descripcion: string;
  marca_id?: number;
  modelo_id?: number;
  numero_serial?: string;
  valor_unitario?: number;
  valor_total?: number;
  fecha?: string;
  dept_id?: number;
  estado_id?: number;
  parroquia_id?: number;
  numero_identificacion: string;
}>) => {
  const query = `
    UPDATE Muebles
    SET 
      subgrupo_id = COALESCE(?, subgrupo_id),
      cantidad = COALESCE(?, cantidad),
      nombre_descripcion = COALESCE(?, nombre_descripcion),
      marca_id = COALESCE(?, marca_id),
      modelo_id = COALESCE(?, modelo_id),
      numero_serial = COALESCE(?, numero_serial),
      valor_unitario = COALESCE(?, valor_unitario),
      valor_total = COALESCE(?, valor_total),
      fecha = COALESCE(?, fecha),
      dept_id = COALESCE(?, dept_id),
      estado_id = COALESCE(?, estado_id),
      parroquia_id = COALESCE(?, parroquia_id),
      numero_identificacion = COALESCE(?, numero_identificacion)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    data.subgrupo_id || null,
    data.cantidad || null,
    data.nombre_descripcion || null,
    data.marca_id || null,
    data.modelo_id || null,
    data.numero_serial || null,
    data.valor_unitario || null,
    data.valor_total || null,
    data.fecha || null,
    data.dept_id || null,
    data.estado_id || null,
    data.parroquia_id || null,
    data.numero_identificacion || null,
    id,
  ]);
  return result;
};

const deleteFurniture = async (id: number) => {
  const query = `
    DELETE FROM Muebles
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const FurnitureModel = {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};