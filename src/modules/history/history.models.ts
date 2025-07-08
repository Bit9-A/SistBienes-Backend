import { pool } from "../../database/index";

// Este modelo maneja la obtención del historial de un bien por su ID
const getGoodHistoryById = async (goodId: number) => {
  const query = `
    SELECT
    A.id AS bien_id,
    A.nombre_descripcion AS bien_nombre, 
    CD.nombre AS estado_desincorporacion,
    D.nombre AS dept_actual,
    I.fecha AS fecha_incorporacion,
    D1.nombre AS dept_origen,
    D2.nombre AS dept_destino,
    T.fecha AS fecha_traslado,
    DES.fecha AS fecha_desincorporacion,
    DES.valor AS valor_desincorporacion,
    DES.cantidad AS cantidad_desincorporacion,
    DDES.nombre AS dept_desincorporacion
    FROM Activos A
    LEFT JOIN Departamento D ON A.dept_id = D.id
    LEFT JOIN IncorporacionActivo I ON A.id = I.bien_id
    LEFT JOIN TransferenciaActivo BT ON BT.id_mueble = A.id  
    LEFT JOIN Traslado T ON BT.id_traslado = T.id 
    LEFT JOIN Departamento D1 ON T.origen_id = D1.id
    LEFT JOIN Departamento D2 ON T.destino_id = D2.id
    LEFT JOIN DesincorporacionActivo DES ON A.id = DES.bien_id
    LEFT JOIN ConceptoDesincorporacion CD ON DES.concepto_id = CD.id
    LEFT JOIN Departamento DDES ON DES.dept_id = DDES.id
    WHERE A.id = ?
    ORDER BY 
    I.fecha ASC,
    T.fecha ASC,
    DES.fecha ASC;
  `;
  const [rows] = await pool.execute(query, [goodId]);
  return rows as any[];
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const goodHistoryModel = {
  getGoodHistoryById,
};
