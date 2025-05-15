import { pool } from "../../database/index";

const createIncorp = async ({
  bien_id,
  fecha,
  valor,
  cantidad,
  concepto_id,
  dept_id,
}: {
  bien_id: number;
  fecha: Date;
  valor: number;
  cantidad: number;
  concepto_id: number;
  dept_id?: number;
}) => {
  const query = `
    INSERT INTO Incorp (bien_id, fecha, valor, cantidad, concepto_id, dept_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    bien_id,
    fecha,
    valor,
    cantidad,
    concepto_id,
    dept_id || null,
  ]);

  // Recuperar el registro recién creado
  const incorpQuery = `
    SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id
    FROM Incorp
    WHERE id = ?
  `;
  const [rows] = await pool.execute(incorpQuery, [(result as any).insertId]);
  return (rows as any[])[0];
};

const findIncorpById = async (id: number) => {
  const query = `
    SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id
    FROM Incorp
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const updateIncorp = async (id: number, updates: Partial<{
  bien_id: number;
  fecha: Date;
  valor: number;
  cantidad: number;
  concepto_id: number;
  dept_id: number;
}>) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updates);
  const query = `
    UPDATE Incorp
    SET ${fields}
    WHERE id = ?
  `;
  await pool.execute(query, [...values, id]);
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
};