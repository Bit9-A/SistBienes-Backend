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
        SELECT sg.id, sg.nombre, sg.codigo, COALESCE(SUM(a.cantidad), 0) AS total
        FROM SubgrupoActivos sg
        LEFT JOIN Activos a ON sg.id = a.subgrupo_id
        GROUP BY sg.id, sg.nombre, sg.codigo
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

const getGoodStatusConConteo = async () => {
    const query = `
        SELECT ea.id, ea.nombre, COALESCE(SUM(a.cantidad), 0) AS total
        FROM EstadoActivo ea
        LEFT JOIN Activos a ON ea.id = a.estado_id
        GROUP BY ea.id, ea.nombre
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

const contarMuebles = async () => {
    const query = `
        SELECT COUNT(*) AS total_muebles, COALESCE(SUM(a.cantidad), 0) AS suma_cantidad
        FROM Activos a;
    `;
    const [rows] = await pool.execute(query);
    return rows;
};

const contarMueblesUltimaSemana = async (): Promise<number> => {
  const ahora = new Date();
  const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000); 

  const query = `
    SELECT SUM(cantidad) AS total_bienes
    FROM Activos
    WHERE fecha >= ? AND fecha <= ?;
  `;

  const [rows] = await pool.execute<TotalBienesResult[]>(query, [hace7Dias, ahora]);

  return rows[0].total_bienes ?? 0;
};

const obtenerValorTotalBienesPorDepartamento = async () => {
    const query = `
        SELECT a.dept_id, d.nombre AS dept_nombre, COALESCE(SUM(a.valor_unitario * a.cantidad), 0) AS total_valor
        FROM Activos a
        LEFT JOIN Departamento d ON a.dept_id = d.id
        GROUP BY a.dept_id, d.nombre
    `;
    const [rows] = await pool.execute<TotalValorBienesResult[]>(query);
    return rows;
};

const contarMueblesPorMes = async (): Promise<MueblesPorMesResult[]> => {
    const query = `
        SELECT 
            YEAR(fecha) AS anio, 
            MONTH(fecha) AS mes, 
            COALESCE(SUM(cantidad), 0) AS total_muebles
        FROM Activos
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
