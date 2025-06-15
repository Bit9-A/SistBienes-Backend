import { pool } from "../../database/index";


//Obtener todos los registros de incorporación
const getAllIncorps = async () => {
  const query = `
    SELECT i.id, i.bien_id, i.fecha, i.valor, i.cantidad, i.concepto_id, i.dept_id,i.isActive,i.observaciones,
           b.nombre_descripcion AS bien_nombre,
           b.numero_identificacion AS numero_identificacion,
           c.nombre AS concepto_nombre,
           d.nombre AS dept_nombre
    FROM Incorp i
    JOIN Muebles b ON i.bien_id = b.id
    JOIN ConceptoIncorp c ON i.concepto_id = c.id
    LEFT JOIN Dept d ON i.dept_id = d.id
  `;  
  const [rows] = await pool.execute(query);
  return (rows as any[]).map(row => ({
    ...row,
    fecha: new Date(row.fecha).toISOString(), // Convertir a string ISO
    bien_nombre: row.bien_nombre || "N/A", // Manejar posibles valores nulos
    numero_identificacion: row.numero_identificacion || "N/A", // Manejar posibles valores nulos
    dept_nombre: row.dept_nombre || "N/A", // Manejar posibles valores nulos
  }));
};

const createIncorp = async ({
  bien_id,
  fecha,
  valor,
  cantidad,
  concepto_id,
  dept_id,
  isActive,
  observaciones,
}: {
  bien_id: number;
  fecha: Date; // <-- Cambiado a string
  valor: number;
  cantidad: number;
  concepto_id: number;
  dept_id?: number;
  isActive: number;
  observaciones?: string;
}) => {
  console.log("Datos recibidos para crear:", { bien_id, fecha, valor, cantidad, concepto_id, dept_id });

  const query = `
    INSERT INTO Incorp (bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    Number(bien_id),
    fecha,
    Number(valor),
    Number(cantidad),
    Number(concepto_id),
    dept_id ? Number(dept_id) : null,
    isActive,
    observaciones ? observaciones : null,
  ]);

  // Recuperar el registro recién creado
  const incorpQuery = `
    SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones,
    FROM Incorp
    WHERE id = ?
  `;
  const [rows] = await pool.execute(incorpQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};
const findIncorpById = async (id: number) => {
  const query = `
    SELECT i.id, i.bien_id, i.fecha, i.valor, i.cantidad, i.concepto_id, i.dept_id,i.isActive,i.observaciones,
           b.nombre_descripcion AS bien_nombre,
           ci.nombre AS concepto_nombre,
           d.nombre AS dept_nombre
    FROM Incorp i
    JOIN Muebles b ON i.bien_id = b.id
    JOIN Dept d ON i.dept_id = d.id
    JOIN ConceptoIncorp ci ON i.concepto_id = ci.id
    WHERE i.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const updateIncorp = async (
  id: number,
  {
    bien_id,
    fecha,
    valor,
    cantidad,
    concepto_id,
    dept_id,
    isActive,
    observaciones,
  }: {
    bien_id?: number;
    fecha?: Date | string;
    valor?: number;
    cantidad?: number;
    concepto_id?: number;
    dept_id?: number;
    isActive?: number;
    observaciones?: string;
  }
) => {
  const query = `
    UPDATE Incorp
    SET 
      bien_id = COALESCE(?, bien_id),
      fecha = COALESCE(?, fecha),
      valor = COALESCE(?, valor),
      cantidad = COALESCE(?, cantidad),
      concepto_id = COALESCE(?, concepto_id),
      dept_id = COALESCE(?, dept_id)
      isActive = COALESCE(?, isActive),
      observaciones = COALESCE(?, observaciones)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    bien_id ?? null,
    fecha ?? null,
    valor ?? null,
    cantidad ?? null,
    concepto_id ?? null,
    dept_id ?? null,
    id,
    isActive ?? null,
    observaciones ?? null,
  ]);
  return result;
};

const deleteIncorp = async (id: number) => {
  const query = `
    DELETE FROM Incorp
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

export const IncorpModel = {
  createIncorp,
  findIncorpById,
  updateIncorp,
  deleteIncorp,
  getAllIncorps,
};