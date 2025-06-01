import { pool } from '../../database/index';
import { RowDataPacket } from 'mysql2/promise';

interface TotalBienesResult extends RowDataPacket {
  total_bienes: number;
}

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
const getGoodStatusConConteo = async () => {
    const query = `
        SELECT eb.id, eb.nombre, COALESCE(SUM(m.cantidad), 0) AS total
        FROM EstadoBien eb
        LEFT JOIN Muebles m ON eb.id = m.estado_id
        GROUP BY eb.id, eb.nombre
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

const contarMuebles = async () => {
    const query = `
        SELECT COUNT(*) AS total_muebles, COALESCE(SUM(m.cantidad), 0) AS suma_cantidad
        FROM Muebles m;
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

const contarMueblesUltimaSemana = async (): Promise<number> => {
  const ahora = new Date();
  const hace7Dias = new Date(ahora.getTime() - 8 * 24 * 60 * 60 * 1000); 

  const query = `
    SELECT SUM(cantidad) AS total_bienes
    FROM Muebles
    WHERE fecha >= ? AND fecha <= ?;
  `;

  const [rows] = await pool.execute<TotalBienesResult[]>(query, [hace7Dias, ahora]);

  return rows[0].total_bienes ?? 0;
};

export const HomeModel = {
    getSubgruposConConteo,
    getGoodStatusConConteo,
    contarMuebles,
    contarMueblesUltimaSemana
};
