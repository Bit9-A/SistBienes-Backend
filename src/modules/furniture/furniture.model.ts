import { pool } from "../../database/index";

const getAllFurniture = async () => {
  const query = `
    SELECT m.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre
    FROM Muebles m
    JOIN SubGrupoMuebles sg ON m.subgrupo_id = sg.id
    JOIN Dept d ON m.dept_id = d.id
    JOIN Parroquia p ON m.parroquia_id = p.id
    JOIN EstadoBien e ON m.estado_id = e.id
    JOIN marca ma ON m.marca_id = ma.id
    JOIN modelo mo ON m.modelo_id = mo.id
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

//obtener los muebles por departamento
const getFurnitureByDepartment = async (deptId: number) => {
  const query = `
    SELECT m.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre
    FROM Muebles m
    JOIN SubGrupoMuebles sg ON m.subgrupo_id = sg.id
    JOIN Dept d ON m.dept_id = d.id
    JOIN Parroquia p ON m.parroquia_id = p.id
    JOIN EstadoBien e ON m.estado_id = e.id
    JOIN marca ma ON m.marca_id = ma.id
    JOIN modelo mo ON m.modelo_id = mo.id
    WHERE m.dept_id = ?
  `;
  const [rows] = await pool.execute(query, [deptId]);
  return rows as any[];
};


const getFurnitureById = async (id: number) => {
  const query = `
    SELECT m.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre
    FROM Muebles m
    JOIN SubGrupoMuebles sg ON m.subgrupo_id = sg.id
    JOIN Dept d ON m.dept_id = d.id
    JOIN Parroquia p ON m.parroquia_id = p.id
    JOIN EstadoBien e ON m.estado_id = e.id
    JOIN marca ma ON m.marca_id = ma.id
    JOIN modelo mo ON m.modelo_id = mo.id
    WHERE m.id = ?
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
  isComputer?: number;
  isActive?: number;
}) => {
  const query = `
    INSERT INTO Muebles (
      subgrupo_id, cantidad, nombre_descripcion, marca_id, modelo_id, numero_serial,
      valor_unitario, valor_total, fecha, dept_id, estado_id, parroquia_id, numero_identificacion, isComputer, isActive
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    data.isComputer ?? 0,
    data.isActive ?? 1,
  ]);
  return {
    id: (result as any).insertId,
    ...data,
  };
};

const updateFurniture = async (
  id: number,
  data: Partial<{
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
    isComputer?: number;
    isActive?: number;
  }>
) => {
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
      numero_identificacion = COALESCE(?, numero_identificacion),
      isComputer = COALESCE(?, isComputer),
      isActive = COALESCE(?, isActive)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    data.subgrupo_id ?? null,
    data.cantidad ?? null,
    data.nombre_descripcion ?? null,
    data.marca_id ?? null,
    data.modelo_id ?? null,
    data.numero_serial ?? null,
    data.valor_unitario ?? null,
    data.valor_total ?? null,
    data.fecha ?? null,
    data.dept_id ?? null,
    data.estado_id ?? null,
    data.parroquia_id ?? null,
    data.numero_identificacion ?? null,
    data.isComputer ?? null,
    data.isActive ?? null,
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
  getFurnitureByDepartment,
};