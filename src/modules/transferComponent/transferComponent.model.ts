import { pool } from "../../database/index";

const getAllTransferComponents = async () => {
  const query = `
    SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial
    FROM TrasladoComponentes tc
    JOIN Componentes c ON tc.componente_id = c.id
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

const getTransferComponentById = async (id: number) => {
  const query = `
    SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial
    FROM TrasladoComponentes tc
    JOIN Componentes c ON tc.componente_id = c.id
    WHERE tc.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

const createTransferComponent = async ({
  componente_id,
  bien_origen_id,
  bien_destino_id,
  fecha,
}: {
  componente_id: number;
  bien_origen_id: number;
  bien_destino_id: number;
  fecha: string | Date;
}) => {
  const query = `
    INSERT INTO TrasladoComponentes (componente_id, bien_origen_id, bien_destino_id, fecha)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    componente_id,
    bien_origen_id,
    bien_destino_id,
    fecha,
  ]);
  return {
    id: (result as any).insertId,
    componente_id,
    bien_origen_id,
    bien_destino_id,
    fecha,
  };
};

const updateTransferComponent = async (
  id: number,
  {
    componente_id,
    bien_origen_id,
    bien_destino_id,
    fecha,
  }: {
    componente_id?: number;
    bien_origen_id?: number;
    bien_destino_id?: number;
    fecha?: string | Date;
  }
) => {
  const query = `
    UPDATE TrasladoComponentes
    SET 
      componente_id = COALESCE(?, componente_id),
      bien_origen_id = COALESCE(?, bien_origen_id),
      bien_destino_id = COALESCE(?, bien_destino_id),
      fecha = COALESCE(?, fecha)
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [
    componente_id ?? null,
    bien_origen_id ?? null,
    bien_destino_id ?? null,
    fecha ?? null,
    id,
  ]);
  return result;
};

const deleteTransferComponent = async (id: number) => {
  const query = `
    DELETE FROM TrasladoComponentes
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const TransferComponentModel = {
  getAllTransferComponents,
  getTransferComponentById,
  createTransferComponent,
  updateTransferComponent,
  deleteTransferComponent,
};