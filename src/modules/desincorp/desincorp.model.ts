import { pool } from "../../database/index";

const getAllDesincorp = async () => {
    const query = `
        SELECT * FROM Desincorp`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

const getDesincorpById = async (id: number) => {
    const query = `
        SELECT * FROM Desincorp WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const createDesincorp = async (
    bienId: number,
    fecha: Date,
    valor: number,
    cantidad: number,
    conceptoId: number,
    deptId: number
) => {
    const query = `
        INSERT INTO Desincorp (bien_id, fecha, valor, cantidad, concepto_id, dept_id) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
        bienId,
        fecha,
        valor,
        cantidad,
        conceptoId,
        deptId,
    ]);
    return {
        id: (result as any).insertId,
        bienId,
        fecha,
        valor,
        cantidad,
        conceptoId,
        deptId,
    };
};

const updateDesincorp = async (
    id: number,
    bienId: number,
    fecha: Date,
    valor: number,
    cantidad: number,
    conceptoId: number,
    deptId: number
) => {
    const query = `
        UPDATE Desincorp 
        SET bien_id = ?, fecha = ?, valor = ?, cantidad = ?, concepto_id = ?, dept_id = ? 
        WHERE id = ?`;
    const [result] = await pool.execute(query, [
        bienId,
        fecha,
        valor,
        cantidad,
        conceptoId,
        deptId,
        id,
    ]);
    return result;
};

const deleteDesincorp = async (id: number) => {
    const query = `
        DELETE FROM Desincorp WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const desincorpModel = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
};
