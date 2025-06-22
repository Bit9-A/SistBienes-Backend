import { pool } from "../../database/index";

// Obtener todos los registros de desincorporación
const getAllDesincorp = async () => {
    const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
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
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
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
        INSERT INTO DesincorporacionActivo (bien_id, fecha, valor, cantidad, concepto_id, dept_id)
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
        FROM DesincorporacionActivo
        WHERE id = ?
    `;
    const [rows] = await pool.execute(desincorpQuery, [result.insertId]);
    return (rows as any[])[0];
};

const updateDesincorp = async (
    id: number,
    updates: Partial<{
        bien_id: number;
        fecha: Date | string;
        valor: number;
        cantidad: number;
        concepto_id: number;
        dept_id: number;
    }>
) => {
    // Lista de campos válidos en la tabla DesincorporacionActivo
    const validFields = ["bien_id", "fecha", "valor", "cantidad", "concepto_id", "dept_id"];

    // Filtrar solo los campos válidos presentes en updates
    const fieldsToUpdate = Object.keys(updates).filter(key => validFields.includes(key));
    if (fieldsToUpdate.length === 0) return; // Nada que actualizar

    const fields = fieldsToUpdate.map(key => `${key} = ?`).join(", ");
    const values = fieldsToUpdate.map(key => (updates as any)[key]);

    const query = `
        UPDATE DesincorporacionActivo
        SET ${fields}
        WHERE id = ?
    `;
    await pool.execute(query, [...values, id]);
};

const deleteDesincorp = async (id: number) => {
    const query = `
        DELETE FROM DesincorporacionActivo
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
