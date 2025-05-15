import { pool } from "../../database/index";

const getAllTranfers = async () => {
    const query = `
    SELECT id, fecha, cantidad, origen_id, destino_id 
    FROM Traslado
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

const getAllGoodTranfers = async () => {
    const query = `
    SELECT id, traslado_id, mueble_id 
    FROM bien_traslado`;
    const [rows] = await pool.execute(query);
    return rows as any[];
};


const getTranfersById = async (id: number) => {
    const query = `
    SELECT id, fecha, cantidad, origen_id, destino_id 
    FROM Traslados WHERE id= ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const getGoodsTranferById = async (id:number) => {
    const query = `
    SELECT id, traslado_id, mueble_id
    FROM bien_traslado WHERE id=?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const updatedTransfer = async (
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
    UPDATE Traslados
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

const updatedGoodTransfer = async (
    id: number,
    {
        traslado_id,
        mueble_id,
    }: {
        traslado_id?: number;
        mueble_id?: number;
    }
) => {
    const query = `
    UPDATE bien_traslado
    SET 
        traslado_id = COALESCE(?, traslado_id),
        mueble_id = COALESCE(?, mueble_id)
    WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
        traslado_id || null,
        mueble_id || null,
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

const deleteGoodsTranfer = async (id: number) => {
    const query = `
    DELETE FROM bien_traslado WHERE id=?`
}

const createTranfer = async ({
    fecha,
    cantidad,
    origen_id,
    destino_id,
}: {
    fecha: Date;
    cantidad: number;
    origen_id: number;
    destino_id: number;
}) => {
    const query = `
    INSERT INTO Traslados (fecha, cantidad, origen_id, destino_id)
    VALUES (?, ?, ?, ?, ?)
  `;
    const [result] = await pool.execute(query, [
        fecha || null,
        cantidad || null,
        origen_id || null,
        destino_id || null,
    ]);
    return result;
}

const createGoodTranfer = async ({
    traslado_id,
    mueble_id,
}:{
    traslado_id: number;
    mueble_id: number;
}) => {
    const query = `
    INSERT INTO bien_traslado (traslado_id, mueble_id)
    VALUES (?, ?)
  `;
    const [result] = await pool.execute(query, [
        traslado_id || null,
        mueble_id || null,
    ]);
    return result;
};


export const transfersModel = {
    getAllTranfers,
    getTranfersById,
    updatedTransfer,
    deleteTranfer,
    createTranfer,
    createGoodTranfer,
    deleteGoodsTranfer,
    getAllGoodTranfers,
    getGoodsTranferById,
    updatedGoodTransfer,
}