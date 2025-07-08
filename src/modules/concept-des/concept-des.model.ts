import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los conceptos de desincorporación en la base de datos

// Funciones para manejar los conceptos de desincorporación
const createConceptDes = async ({
    nombre,
    codigo,
}: {
    nombre: string;
    codigo: string;
}) => {
    const query = `
        INSERT INTO ConceptoDesincorporacion (nombre, codigo)
        VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, codigo]);

    const concepDesincorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorporacion WHERE id = ?`;
    const [rows] = await pool.execute(concepDesincorpQuery, [(result as any).insertId]);
    return (rows as any[])[0];
};

// Obtiene todos los conceptos de desincorporación
const getAllConceptDes = async () => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorporacion
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

// Obtiene un concepto de desincorporación por su ID
const getConceptDesById = async (id: number) => {
    const query = `
        SELECT id, nombre, codigo 
        FROM ConceptoDesincorporacion WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

//  Actualiza un concepto de desincorporación existente
const updateConceptDes = async (
    id: number,
    {
        nombre,
        codigo,
    }: {
        nombre?: string;
        codigo?: string;
    }
) => {
    const query = `
        UPDATE ConceptoDesincorporacion 
        SET 
            nombre = COALESCE(?, nombre),
            codigo = COALESCE(?, codigo)
        WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
        nombre || null,
        codigo || null,
        id,
    ]);
    return result;
};

// Elimina un concepto de desincorporación por su ID
const deleteConceptDes = async (id: number) => {
    const query = `
        DELETE FROM ConceptoDesincorporacion WHERE id = ?
    `;
    const [result] = await pool.execute(query, [id]);
    return result;
};

// Exportamos las funciones del modelo para que puedan ser utilizadas en los controladores
export const ConceptDesModel = {
    createConceptDes,
    getAllConceptDes,
    getConceptDesById,
    updateConceptDes,
    deleteConceptDes,
};
