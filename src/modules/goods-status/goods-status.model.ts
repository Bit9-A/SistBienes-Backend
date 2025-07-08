import { pool } from "../../database/index";

// Este modelo maneja las operaciones CRUD para los estados de los bienes

// Este modelo maneja la obtención de todos los estados de los bienes
const getAllStatusGoods = async () => {
    const query = `
        SELECT * FROM EstadoActivo`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

// Este modelo maneja la obtención de un estado de los bienes por su ID
const getStatusGoodsById = async (id: number) => {
    const query = `
        SELECT * FROM EstadoActivo WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo estado de los bienes
const createStatusGoods = async (nombre: string) => {
    const query = `
        INSERT INTO EstadoActivo (nombre) VALUES (?)`;
    const [result] = await pool.execute(query, [nombre]);
    return {
        id: (result as any).insertId,
        nombre,
    };
};

// Este modelo maneja la actualización de un estado de los bienes existente
const updateStatusGoods = async (id: number, nombre: string) => {
    const query = `
        UPDATE EstadoActivo SET nombre = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [nombre, id]);
    return result;
};

// Este modelo maneja la eliminación de un estado de los bienes por su ID
const deleteStatusGoods = async (id: number) => {
    const query = `
        DELETE FROM EstadoActivo WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const statusGoodsModel = {
    getAllStatusGoods,
    getStatusGoodsById,
    createStatusGoods,
    updateStatusGoods,
    deleteStatusGoods,
};
