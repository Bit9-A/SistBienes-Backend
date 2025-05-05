import { pool } from "../database/index";

const getAllTranfers = async () => {
    const query = `
    SELECT id, fecha, cantidad, bien_id, origen_id, destino_id 
    FROM Traslados
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

const getTranfersById = async (id: number) => {
    const query = `
    SELECT id, fecha, cantidad, bien_id, origen_id, destino_id 
    FROM Traslados WHERE id= ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const updatedTransfer = async (
    id: number,
    {
        fecha,
        cantidad,
        bien_id,
        origen_id,
        destino_id,
    }: {
        fecha?: Date;
        cantidad?: number;
        bien_id?: number;
        origen_id?: number;
        destino_id?: number;
    }
) => {
    const query = `
    UPDATE Traslados
    SET 
        fecha = COALESCE(?, fecha),
        cantidad = COALESCE(?, cantidad),
        bien_id = COALESCE(?, bien_id),
        origen_id = COALESCE(?, origen_id),
        destino_id = COALESCE(?, destino_id)
    WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
        fecha || null,
        cantidad || null,
        bien_id || null,
        origen_id || null,
        destino_id || null,
        id,
    ]);
    return result;
};

const deleteTranfer = async (id: number) => {
    const query = `
    DELETE FROM Traslados WHERE id=?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

const createTranfer = async ({
    fecha,
    cantidad,
    bien_id,
    origen_id,
    destino_id,
}: {
    fecha: Date;
    cantidad: number;
    bien_id: number;
    origen_id: number;
    destino_id: number;
}) => {
    const query = `
    INSERT INTO Traslados (fecha, cantidad, bien_id, origen_id, destino_id)
    VALUES (?, ?, ?, ?, ?)
  `;
    const [result] = await pool.execute(query, [
        fecha || null,
        cantidad || null,
        bien_id || null,
        origen_id || null,
        destino_id || null,
    ]);
    return result;
}


export const transfersModel = {
    getAllTranfers,
    getTranfersById,
    updatedTransfer,
    deleteTranfer,
}