import { pool } from "../../database/index";

// Obtener todos los registros de desincorporación
const getAllDesincorp = async () => {
    const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id,
               b.nombre_descripcion AS bien_nombre,
               b.numero_identificacion AS numero_identificacion,
               c.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM Desincorp d
        JOIN Muebles b ON d.bien_id = b.id
        JOIN ConceptoDesincorp c ON d.concepto_id = c.id
        LEFT JOIN Dept dept ON d.dept_id = dept.id
    `;
    const [rows] = await pool.execute(query);
    return (rows as any[]).map(row => ({
        ...row,
        fecha: new Date(row.fecha).toISOString(),
        bien_nombre: row.bien_nombre || "N/A",
        numero_identificacion: row.numero_identificacion || "N/A",
        dept_nombre: row.dept_nombre || "N/A",
    }));
};

// Obtener un registro de desincorporación por ID
const getDesincorpById = async (id: number) => {
    const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id,
               b.nombre_descripcion AS bien_nombre,
               b.numero_identificacion AS numero_identificacion,
               c.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM Desincorp d
        JOIN Muebles b ON d.bien_id = b.id
        JOIN ConceptoDesincorp c ON d.concepto_id = c.id
        LEFT JOIN Dept dept ON d.dept_id = dept.id
        WHERE d.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

// Crear un registro de desincorporación
const createDesincorp = async ({
    bien_id,
    fecha,
    valor,
    cantidad,
    concepto_id,
    dept_id,
}: {
    bien_id: number;
    fecha: Date | string;
    valor: number;
    cantidad: number;
    concepto_id: number;
    dept_id?: number;
}) => {
    const query = `
        INSERT INTO Desincorp (bien_id, fecha, valor, cantidad, concepto_id, dept_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.execute(query, [
        Number(bien_id),
        fecha,
        Number(valor),
        Number(cantidad),
        Number(concepto_id),
        dept_id ? Number(dept_id) : null,
    ]);
    // Recuperar el registro recién creado
    const desincorpQuery = `
        SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id
        FROM Desincorp
        WHERE id = ?
    `;
    const [rows] = await pool.execute(desincorpQuery, [result.insertId]);
    return (rows as any[])[0];
};

const updateDesincorp = async (id: number, updates: Partial<{
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
        UPDATE Desincorp
        SET ${fields}
        WHERE id = ?
    `;
    await pool.execute(query, [...values, id]);
};

const deleteDesincorp = async (id: number) => {
    const query = `
        DELETE FROM Desincorp
        WHERE id = ?
    `;
    await pool.execute(query, [id]);
};

export const desincorpModel = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
};