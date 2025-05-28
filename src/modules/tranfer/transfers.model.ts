import { pool } from "../../database/index";

// Obtener todos los traslados con sus bienes asociados
const getAllTransfers = async () => {
    const query = `
        SELECT t.*, bt.id as bien_traslado_id, bt.mueble_id
        FROM Traslado t
        LEFT JOIN bien_traslado bt ON t.id = bt.traslado_id
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

// Obtener un traslado por ID con sus bienes asociados
const getTransferById = async (id: number) => {
    const trasladoQuery = `SELECT * FROM Traslado WHERE id = ?`;
    const bienesQuery = `
        SELECT bt.*, m.nombre, m.numero_identificacion
        FROM bien_traslado bt
        JOIN Muebles m ON bt.mueble_id = m.id
        WHERE bt.traslado_id = ?
    `;
    const [trasladoRows] = await pool.execute(trasladoQuery, [id]) as [any[], any];
    if (trasladoRows.length === 0) return null;
    const [bienesRows] = await pool.execute(bienesQuery, [id]) as [any[], any];
    return { ...trasladoRows[0], bienes: bienesRows };
};

// Crear un traslado y asociar bienes
const createTransfer = async ({
    fecha,
    cantidad,
    origen_id,
    destino_id,
    bienes, // array de IDs de bienes
}: {
    fecha: Date;
    cantidad: number;
    origen_id: number;
    destino_id: number;
    bienes: number[];
}) => {
    // 1. Crear el traslado
    const query = `
        INSERT INTO Traslado (fecha, cantidad, origen_id, destino_id)
        VALUES (?, ?, ?, ?)
    `;
    const [result]: any = await pool.execute(query, [
        fecha,
        cantidad,
        origen_id,
        destino_id,
    ]);
    const trasladoId = result.insertId;

    // 2. Asociar los bienes al traslado
    for (const mueble_id of bienes) {
        await pool.execute(
            `INSERT INTO bien_traslado (traslado_id, mueble_id) VALUES (?, ?)`,
            [trasladoId, mueble_id]
        );
    }

    return trasladoId;
};

// Actualizar traslado
const updateTransfer = async (
    id: number,
    {
        fecha,
        cantidad,
        origen_id,
        destino_id,
    }: {
        fecha?: Date;
        cantidad?: number;
        origen_id?: number;
        destino_id?: number;
    }
) => {
    const query = `
        UPDATE Traslado
        SET 
            fecha = COALESCE(?, fecha),
            cantidad = COALESCE(?, cantidad),
            origen_id = COALESCE(?, origen_id),
            destino_id = COALESCE(?, destino_id)
        WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
        fecha || null,
        cantidad || null,
        origen_id || null,
        destino_id || null,
        id,
    ]);
    return result;
};

// Eliminar traslado y sus bienes asociados
const deleteTransfer = async (id: number) => {
    await pool.execute(`DELETE FROM bien_traslado WHERE traslado_id = ?`, [id]);
    const [result] = await pool.execute(`DELETE FROM Traslado WHERE id = ?`, [id]);
    return result;
};

export const transfersModel = {
    getAllTransfers,
    getTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer,
};