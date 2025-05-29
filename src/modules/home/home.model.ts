import { pool } from '../../database/index';

const getSubgruposConConteo = async () => {
    const query = `
        SELECT sg.id, sg.nombre, sg.codigo, COALESCE(SUM(m.cantidad), 0) AS total
        FROM SubGrupoMuebles sg
        LEFT JOIN Muebles m ON sg.id = m.subgrupo_id
        GROUP BY sg.id, sg.nombre, sg.codigo
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

export const mueblesModel = {
    getSubgruposConConteo,
};
