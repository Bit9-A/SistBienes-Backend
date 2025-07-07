import { pool } from "../../database/index";

const getAllStatusGoods = async () => {
    const query = `
        SELECT * FROM EstadoActivo`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

const getStatusGoodsById = async (id: number) => {
    const query = `
        SELECT * FROM EstadoActivo WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const createStatusGoods = async (nombre: string) => {
    const query = `
        INSERT INTO EstadoActivo (nombre) VALUES (?)`;
    const [result] = await pool.execute(query, [nombre]);
    return {
        id: (result as any).insertId,
        nombre,
    };
};

const updateStatusGoods = async (id: number, nombre: string) => {
    const query = `
        UPDATE EstadoActivo SET nombre = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [nombre, id]);
    return result;
};

const deleteStatusGoods = async (id: number) => {
    const query = `
        DELETE FROM EstadoActivo WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const statusGoodsModel = {
    getAllStatusGoods,
    getStatusGoodsById,
    createStatusGoods,
    updateStatusGoods,
    deleteStatusGoods,
};
