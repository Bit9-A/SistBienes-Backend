import { pool } from "../../database/index";

// Obtener todos los componentes
const getAllComponents = async () => {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial, 
    FROM Componentes c
  `;
  const [rows] = await pool.execute(query);
  return rows as any[];
};

// Obtener un componente por su ID
const getComponentById = async (id: number) => {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial
    FROM Componentes c
    WHERE c.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return (rows as any[])[0];
};

// Obtener todos los componentes de un bien específico
const getComponentsByBienId = async (bien_id: number) => {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial
    FROM Componentes c
    WHERE c.bien_id = ?
  `;
  const [rows] = await pool.execute(query, [bien_id]);
  return rows as any[];
};

// Crear un nuevo componente
const createComponent = async ({
  bien_id,
  nombre,
  numero_serial,
}: {
  bien_id: number;
  nombre: string;
  numero_serial?: string;
}) => {
  const query = `
    INSERT INTO Componentes (bien_id, nombre, numero_serial)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    bien_id,
    nombre,
    numero_serial || null,
  ]);
  return {
    id: (result as any).insertId,
    bien_id,
    nombre,
    numero_serial: numero_serial || null,
  };
};

// Actualizar un componente por su ID
const updateComponent = async (
  id: number,
  data: {
    bien_id?: number | null;
    nombre?: string;
    numero_serial?: string;
  }
) => {
  const setClauses: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.bien_id !== undefined) {
    setClauses.push("bien_id = ?");
    params.push(data.bien_id);
  }
  if (data.nombre !== undefined) {
    setClauses.push("nombre = ?");
    params.push(data.nombre);
  }
  if (data.numero_serial !== undefined) {
    setClauses.push("numero_serial = ?");
    params.push(data.numero_serial || null);
  }

  if (setClauses.length === 0) {
    return { affectedRows: 0 }; // No fields to update
  }

  const query = `
    UPDATE Componentes
    SET ${setClauses.join(", ")}
    WHERE id = ?
  `;
  params.push(id);

  const [result] = await pool.execute(query, params);
  return result;
};

// Borrar un componente por su ID
const deleteComponent = async (id: number) => {
  const query = `
    DELETE FROM Componentes
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [id]);
  return result;
};

export const ComponentsModel = {
  getAllComponents,
  getComponentsByBienId,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
};
