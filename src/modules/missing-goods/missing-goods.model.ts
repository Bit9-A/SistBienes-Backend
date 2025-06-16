import { pool } from "../../database/index";

const getAllMissingGoods = async () => {
    const query = `
    SELECT bf.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           m.numero_identificacion AS numero_identificacion
    FROM BienesFaltantes bf
    JOIN Usuarios u ON bf.funcionario_id = u.id
    JOIN Usuarios j ON bf.jefe_id = j.id
    LEFT JOIN Dept d ON bf.unidad = d.id
    LEFT JOIN Muebles m ON bf.bien_id = m.id
  `;
    const [rows] = await pool.query(query);
    return rows as any[];
};

const getMissingGoodsById = async (id: number) => {
    const query = `
    SELECT bf.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           m.numero_identificacion AS numero_identificacion
    FROM BienesFaltantes bf
    JOIN Usuarios u ON bf.funcionario_id = u.id
    JOIN Usuarios j ON bf.jefe_id = j.id
    LEFT JOIN Dept d ON bf.unidad = d.id
    LEFT JOIN Muebles m ON bf.bien_id = m.id
    WHERE bf.id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

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
        INSERT INTO BienesFaltantes (unidad, existencias, diferencia_cantidad, diferencia_valor, funcionario_id, jefe_id, observaciones, fecha, bien_id) 
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
        UPDATE BienesFaltantes 
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

const deleteMissingGoods = async (id: number) => {
    const query = `
        DELETE FROM BienesFaltantes WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const missingGoodsModel = {
    getAllMissingGoods,
    getMissingGoodsById,
    createMissingGoods,
    updateMissingGoods,
    deleteMissingGoods,
};