import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los bienes perdidos

// Este modelo maneja la obtención de todos los bienes perdidos
const getAllMissingGoods = async () => {
    const query = `
    SELECT af.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           a.numero_identificacion AS numero_identificacion
    FROM ActivosFaltantes af
    JOIN Usuarios u ON af.funcionario_id = u.id
    JOIN Usuarios j ON af.jefe_id = j.id
    LEFT JOIN Departamento d ON af.unidad = d.id
    LEFT JOIN Activos a ON af.bien_id = a.id
  `;
    const [rows] = await pool.query(query);
    return rows as any[];
};

// Este modelo maneja la obtención de un bien perdido por su ID
const getMissingGoodsById = async (id: number) => {
    const query = `
    SELECT af.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           a.numero_identificacion AS numero_identificacion
    FROM ActivosFaltantes af
    JOIN Usuarios u ON af.funcionario_id = u.id
    JOIN Usuarios j ON af.jefe_id = j.id
    LEFT JOIN Departamento d ON af.unidad = d.id
    LEFT JOIN Activos a ON af.bien_id = a.id
    WHERE af.id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo bien perdido
const createMissingGoods = async ({
    unidad,
    existencias,
    diferencia_cantidad,
    diferencia_valor,
    funcionario_id,
    jefe_id,
    observaciones,
    fecha,
    bien_id
}: {
    unidad: number,
    existencias: number,
    diferencia_cantidad: number,
    diferencia_valor: number,
    funcionario_id: number,
    jefe_id: number,
    observaciones: string,
    fecha: string,
    bien_id: number
}) => {
    const query = `
        INSERT INTO ActivosFaltantes (unidad, existencias, diferencia_cantidad, diferencia_valor, funcionario_id, jefe_id, observaciones, fecha, bien_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
        unidad,
        existencias,
        diferencia_cantidad,
        diferencia_valor,
        funcionario_id,
        jefe_id,
        observaciones,
        fecha,
        bien_id,
    ]);
    return {
        id: (result as any).insertId,
        unidad,
        existencias,
        diferencia_cantidad,
        diferencia_valor,
        funcionario_id,
        jefe_id,
        observaciones,
        fecha,
        bien_id,
    };
};

// Este modelo maneja la actualización de un bien perdido existente
const updateMissingGoods = async (
    id: number,
    unidad: number,
    existencias: number,
    diferencia_cantidad: number,
    diferencia_valor: number,
    funcionario_id: number,
    jefe_id: number,
    observaciones: string,
    fecha: string,
    bien_id: number
) => {
    const query = `
        UPDATE ActivosFaltantes 
        SET unidad = ?, existencias = ?, diferencia_cantidad = ?, diferencia_valor = ?, funcionario_id = ?, jefe_id = ?, observaciones = ?, fecha = ?, bien_id = ? 
        WHERE id = ?`;
    const [result] = await pool.execute(query, [
        unidad,
        existencias,
        diferencia_cantidad,
        diferencia_valor,
        funcionario_id,
        jefe_id,
        observaciones,
        fecha,
        bien_id,
        id,
    ]);
    return result;
};

// Este modelo maneja la eliminación de un bien perdido por su ID
const deleteMissingGoods = async (id: number) => {
    const query = `
        DELETE FROM ActivosFaltantes WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const missingGoodsModel = {
    getAllMissingGoods,
    getMissingGoodsById,
    createMissingGoods,
    updateMissingGoods,
    deleteMissingGoods,
};
