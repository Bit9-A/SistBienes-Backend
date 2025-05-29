import { pool } from "../../database/index";

const getGoodHistoryById = async (goodId: number) => {
  const query = `
    SELECT
    M.id AS bien_id,
    M.nombre_descripcion AS bien_nombre, 
    CD.nombre AS estado_desincorporacion,
    D.nombre AS dept_actual,
    CONCAT(U.nombre, ' ', U.apellido) AS funcionario_nombre,
    I.fecha AS fecha_incorporacion,
    D1.nombre AS dept_origen,
    D2.nombre AS dept_destino,
    T.fecha AS fecha_traslado,
    DES.fecha AS fecha_desincorporacion,
    DES.valor AS valor_desincorporacion,
    DES.cantidad AS cantidad_desincorporacion,
    DDES.nombre AS dept_desincorporacion
    FROM Muebles M
    LEFT JOIN Dept D ON M.dept_id = D.id
    LEFT JOIN Incorp I ON M.id = I.bien_id
    LEFT JOIN Usuarios U ON I.dept_id = U.dept_id
    LEFT JOIN bien_traslado BT ON BT.id_mueble = M.id  
    LEFT JOIN Traslado T ON BT.id_traslado = T.id 
    LEFT JOIN Dept D1 ON T.origen_id = D1.id
    LEFT JOIN Dept D2 ON T.destino_id = D2.id
    LEFT JOIN Desincorp DES ON M.id = DES.bien_id
    LEFT JOIN ConceptoDesincorp CD ON DES.concepto_id = CD.id
    LEFT JOIN Dept DDES ON DES.dept_id = DDES.id
    WHERE M.id = ?
    ORDER BY 
    I.fecha ASC,
    T.fecha ASC,
    DES.fecha ASC;
    `;
  const [rows] = await pool.execute(query, [goodId]);
  return rows as any[];
};

export const goodHistoryModel = {
  getGoodHistoryById,
};
