import { pool } from "../database/index";

const getAllAudit = async () => {
    const query = `SELECT * FROM Auditoria`;
    const [rows] = await pool.execute(query);
    return rows as any[];
}

const getAuditById = async (id: number) => {
    const query = `SELECT * FROM Auditoria WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
}

const createAudit = async ({
    usuario_id, 
    entrada,
    salida,
    ip,
} : {
    usuario_id: Number;
    entrada: Date;
    salida: Date;
    ip: String; 
}) => {
    const query = `
        INSERT INTO Auditoria (usuario_id, entrada, salida, ip)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [usuario_id, entrada, salida, ip]);

    const auditQuery = `
        SELECT id, usuario_id, entrada, salida, ip
        FROM Auditoria WHERE id = ?`;
    const [rows] = await pool.execute(auditQuery, [(result as any).insertId]);
    return (rows as any[])[0];
}

const updateAudit = async (
    id:number,
    {
        usuario_id,
        entrada,
        salida,
        ip,
    }: {
        usuario_id?: Number;
        entrada?: Date;
        salida?: Date;
        ip?: String; 
    }
) => {
    const query = `
    UPDATE Auditoria 
    SET
        usuario_id = COALESCE(?, usuario_id),
        entrada = COALESCE(?, entrada),
        salida = COALESCE(?, Ssalida),
        ip = COALESCE(?, ip)
    WHERE id = ?`;
    const [result] = await pool.execute(query, [
        usuario_id || null,
        entrada || null,
        salida || null,
        ip || null,
    ]);
    return result;
};

const deleteAudit = async (id: number) => {
    const query = `DELETE FROM Auditoria WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
}

export const auditModel = {
    getAllAudit,
    getAuditById,
    createAudit,
    updateAudit,
    deleteAudit,
}