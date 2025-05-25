import { pool } from '../../database/index';

const getCountBySubgrupo = async (subgrupoId: number) => {
    const query = `
        SELECT SUM(cantidad) AS total FROM Muebles WHERE subgrupo_id = ?`;
    const [rows] = await pool.execute(query, [subgrupoId]);
    return (rows as any[])[0]?.total || 0; // Devuelve 0 si no hay resultados
};

const getCounts = async () => {
    const counts = {
        equiposInformaticos: await getCountBySubgrupo(15), // Asumiendo que 1 es el ID para equipos informáticos
        mobiliarios: await getCountBySubgrupo(2), // Asumiendo que 2 es el ID para mobiliarios
        vehiculos: await getCountBySubgrupo(3), // Asumiendo que 3 es el ID para vehículos
        equiposOficina: await getCountBySubgrupo(4), // Asumiendo que 4 es el ID para equipos de oficina
        audiovisuales: await getCountBySubgrupo(5), // Asumiendo que 5 es el ID para audiovisuales
    };
    return counts;
};

export const mueblesModel = {
    getCountBySubgrupo,
    getCounts,
};
