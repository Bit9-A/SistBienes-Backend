import { pool } from "../../database/index";

// Este modelo maneja la obtención del historial de un bien por su ID
const getGoodHistoryById = async (goodId: number) => {
  const query = `
    -- Incorporaciones
    SELECT
        A.id AS bien_id,
        A.nombre_descripcion AS bien_nombre,
        'Incorporacion' AS tipo_evento,
        I.fecha AS fecha_evento,
        D_actual.nombre AS departamento_relacionado,
        NULL AS departamento_origen,
        NULL AS departamento_destino,
        NULL AS concepto_desincorporacion,
        NULL AS valor_desincorporacion,
        NULL AS cantidad_desincorporacion,
        NULL AS campo_modificado,
        NULL AS valor_anterior,
        NULL AS valor_nuevo
    FROM Activos A
    JOIN IncorporacionActivo I ON A.id = I.bien_id
    LEFT JOIN Departamento D_actual ON A.dept_id = D_actual.id
    WHERE A.id = ?

    UNION ALL

    -- Traslados
    SELECT
        A.id AS bien_id,
        A.nombre_descripcion AS bien_nombre,
        'Traslado' AS tipo_evento,
        T.fecha AS fecha_evento,
        NULL AS departamento_relacionado,
        D1.nombre AS departamento_origen,
        D2.nombre AS departamento_destino,
        NULL AS concepto_desincorporacion,
        NULL AS valor_desincorporacion,
        NULL AS cantidad_desincorporacion,
        NULL AS campo_modificado,
        NULL AS valor_anterior,
        NULL AS valor_nuevo
    FROM Activos A
    JOIN TransferenciaActivo BT ON A.id = BT.id_mueble
    JOIN Traslado T ON BT.id_traslado = T.id
    LEFT JOIN Departamento D1 ON T.origen_id = D1.id
    LEFT JOIN Departamento D2 ON T.destino_id = D2.id
    WHERE A.id = ?

    UNION ALL

    -- Desincorporaciones
    SELECT
        A.id AS bien_id,
        A.nombre_descripcion AS bien_nombre,
        'Desincorporacion' AS tipo_evento,
        DES.fecha AS fecha_evento,
        DDES.nombre AS departamento_relacionado,
        NULL AS departamento_origen,
        NULL AS departamento_destino,
        CD.nombre AS concepto_desincorporacion,
        DES.valor AS valor_desincorporacion,
        DES.cantidad AS cantidad_desincorporacion,
        NULL AS campo_modificado,
        NULL AS valor_anterior,
        NULL AS valor_nuevo
    FROM Activos A
    JOIN DesincorporacionActivo DES ON A.id = DES.bien_id
    LEFT JOIN ConceptoDesincorporacion CD ON DES.concepto_id = CD.id
    LEFT JOIN Departamento DDES ON DES.dept_id = DDES.id
    WHERE A.id = ?

    UNION ALL

    -- Activos Faltantes
    SELECT
        AF.bien_id AS bien_id,
        A.nombre_descripcion AS bien_nombre,
        'Activo Faltante' AS tipo_evento,
        AF.fecha AS fecha_evento,
        D_actual.nombre AS departamento_relacionado,
        NULL AS departamento_origen,
        NULL AS departamento_destino,
        NULL AS concepto_desincorporacion,
        AF.diferencia_valor AS valor_desincorporacion,
        AF.diferencia_cantidad AS cantidad_desincorporacion,
        NULL AS campo_modificado,
        NULL AS valor_anterior,
        NULL AS valor_nuevo
    FROM ActivosFaltantes AF
    JOIN Activos A ON AF.bien_id = A.id
    LEFT JOIN Departamento D_actual ON AF.unidad = D_actual.id
    WHERE AF.bien_id = ?

    ORDER BY fecha_evento ASC;
  `;
  const [rows] = await pool.execute(query, [goodId, goodId, goodId, goodId]);
  return rows as any[];
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const goodHistoryModel = {
  getGoodHistoryById,
};
