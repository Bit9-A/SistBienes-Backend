import { pool } from '../../database/index';
import { RowDataPacket } from 'mysql2/promise';

interface TotalBienesResult extends RowDataPacket {
  total_bienes: number;
}

interface TotalValorBienesResult extends RowDataPacket {
  dept_id: number;
  dept_nombre: string;
  total_valor: number;
}

interface MueblesPorMesResult extends RowDataPacket {
    anio: number;
    mes: number;
    total_muebles: number;
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

const obtenerValorTotalBienesPorDepartamento = async () => {
    const query = `
        SELECT m.dept_id, d.nombre AS dept_nombre, COALESCE(SUM(m.valor_unitario * m.cantidad), 0) AS total_valor
        FROM Muebles m
        LEFT JOIN Dept d ON m.dept_id = d.id
        GROUP BY m.dept_id, d.nombre
    `;
    const [rows] = await pool.execute<TotalValorBienesResult[]>(query);
    return rows;
};

const contarMueblesPorMes = async (): Promise<MueblesPorMesResult[]> => {
    const query = `
        SELECT 
            YEAR(fecha) AS anio, 
            MONTH(fecha) AS mes, 
            COALESCE(sum(cantidad), 0) AS total_muebles
        FROM Muebles
        WHERE fecha IS NOT NULL
        GROUP BY anio, mes
        ORDER BY anio ASC, mes ASC;
    `;
    const [rows] = await pool.execute<MueblesPorMesResult[]>(query);
    return rows;
};

export const HomeModel = {
    getSubgruposConConteo,
    getGoodStatusConConteo,
    contarMuebles,
    contarMueblesUltimaSemana,
    obtenerValorTotalBienesPorDepartamento,
    contarMueblesPorMes
};
