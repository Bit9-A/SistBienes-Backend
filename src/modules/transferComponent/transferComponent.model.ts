import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los componentes de traslado

// Este modelo maneja la obtención de todos los componentes de traslado
const getAllTransferComponents = async () => {
  const query = `
   SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial, b.dept_id as dept_origen, b2.dept_id as dept_destino,
            d.nombre as dept_origen_nombre, d2.nombre as dept_destino_nombre
    FROM ComponentesTraslado tc
    JOIN Componentes c ON tc.componente_id = c.id
    LEFT JOIN Activos b ON tc.bien_origen_id = b.id 
    LEFT JOIN Activos b2 ON tc.bien_destino_id = b2.id
    LEFT JOIN Departamento d ON b.dept_id = d.id
    LEFT JOIN Departamento d2 ON b2.dept_id = d2.id
    ORDER BY tc.fecha DESC
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Este modelo maneja la obtención de un componente de traslado por su ID
const getTransferComponentById = async (id: number) => {
  const query = `
    SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial
    FROM ComponentesTraslado tc
    JOIN Componentes c ON tc.componente_id = c.id
    WHERE tc.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Este modelo maneja la creación de un nuevo componente de traslado
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
    INSERT INTO ComponentesTraslado (componente_id, bien_origen_id, bien_destino_id, fecha)
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

// Este modelo maneja la actualización de un componente de traslado existente
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
    UPDATE ComponentesTraslado
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

// Este modelo maneja la eliminación de un componente de traslado por su ID
const deleteTransferComponent = async (id: number) => {
  const query = `
    DELETE FROM ComponentesTraslado
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

// Exportamos los métodos del modelo para que puedan ser utilizados en otros módulos
export const TransferComponentModel = {
  getAllTransferComponents,
  getTransferComponentById,
  createTransferComponent,
  updateTransferComponent,
  deleteTransferComponent,
};
