import { pool } from "../../database/index";

// Obtener todos los registros de desincorporación
const getAllDesincorp = async () => {
    const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
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
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
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
    observaciones,
}: {
    bien_id: number;
    fecha: Date | string;
    valor: number;
    cantidad: number;
    concepto_id: number;
    dept_id?: number;
    observaciones?: string;
}) => {
    const query = `
        INSERT INTO DesincorporacionActivo (bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.execute(query, [
        Number(bien_id),
        fecha,
        Number(valor),
        Number(cantidad),
        Number(concepto_id),
        dept_id ? Number(dept_id) : null,
        observaciones || null,
    ]);
    // Recuperar el registro recién creado
    const desincorpQuery = `
        SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones
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
        observaciones: string;
    }>
) => {
    // Lista de campos válidos en la tabla DesincorporacionActivo
    const validFields = ["bien_id", "fecha", "valor", "cantidad", "concepto_id", "dept_id", "observaciones"];

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

// Obtener registros de desincorporación por mes, año y departamento
const getDesincorpsByMonthYearDept = async (mes: number, año: number, deptId: number) => {
    console.log(`[desincorp.model] getDesincorpsByMonthYearDept - Mes: ${mes}, Año: ${año}, DeptId: ${deptId}`);
    const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               cd.codigo AS concepto_codigo,
               dept.nombre AS dept_nombre,
               sg.codigo AS subgrupo_codigo,
               ma.nombre AS marca_nombre,
               mo.nombre AS modelo_nombre,
               ea.nombre AS estado_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
        LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
        LEFT JOIN Marca ma ON a.marca_id = ma.id
        LEFT JOIN Modelo mo ON a.modelo_id = mo.id
        LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
        WHERE MONTH(d.fecha) = ? AND YEAR(d.fecha) = ? AND d.dept_id = ?
    `;
    const [rows]: any = await pool.execute(query, [mes, año, deptId]);
    console.log(`[desincorp.model] getDesincorpsByMonthYearDept - Activos recuperados: ${rows.length}`);
    return (rows as any[]).map((row: any) => ({
        ...row,
        fecha: new Date(row.fecha).toISOString(),
        bien_nombre: row.bien_nombre || "N/A",
        numero_identificacion: row.numero_identificacion || "N/A",
        dept_nombre: row.dept_nombre || "N/A",
        concepto_codigo: row.concepto_codigo || "N/A", // Asegurar que el código del concepto se mapee
    }));
};

export const desincorpModel = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
    getDesincorpsByMonthYearDept,
};
