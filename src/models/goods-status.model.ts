import { pool } from "../database/index";

const getAllStatusGoods = async () => {
    const query = `
        SELECT * FROM  EstadoBien`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

const getStatusGoodsById = async (id : number) => {
    const query = `
        SELECT * FROM EstadoBien WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const createStatusGoods = async (nombre: string) => {
    const query = `
        INSERT INTO EstadoBien (nombre) VALUES (?)`;
    const [result] = await pool.execute(query, [nombre]);
    return {
        id: (result as any).insertId,
        nombre,
    };
};

const uptadeStatusGoods = async (id: number, nombre: string) => {
    const query = `
        UPDATE EstadoBien SET nombre = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [nombre, id]);
    return result;
};

const deleteStatusGoods = async (id:number) => {
    const query = `
        DELETE FROM EstadoBien WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const statusGoodsModel = {
    getAllStatusGoods,
    getStatusGoodsById,
    createStatusGoods,
    uptadeStatusGoods,
    deleteStatusGoods,
}