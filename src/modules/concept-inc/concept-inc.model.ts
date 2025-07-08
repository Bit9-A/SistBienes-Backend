import { pool } from "../../database/index";

// Este modelo maneja las operaciones relacionadas con los conceptos de incorporación en la base de datos
const createConceptInc = async ({
    nombre,
    codigo,
}: {
    nombre: string;
    codigo: string;
}) => {
    const query = `
        INSERT INTO ConceptoIncorporacion (nombre, codigo)
        VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, codigo]);

    const concepIncorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion WHERE id = ?`;
    const [rows] = await pool.execute(concepIncorpQuery, [(result as any).insertId]);
    return (rows as any[])[0];
};

// Obtiene todos los conceptos de incorporación
const getAllConceptInc = async () => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

// Obtiene un concepto de incorporación por su ID
const getConceptIncById = async (id: number) => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

// Actualiza un concepto de incorporación existente
const updateConceptInc = async (
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
        UPDATE ConceptoIncorporacion
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

// Elimina un concepto de incorporación por su ID
const deleteConceptInc = async (id: number) => {
    const query = `
        DELETE FROM ConceptoIncorporacion WHERE id=?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

// Exportamos las funciones del modelo para que puedan ser utilizadas en los controladores
export const ConcepIncorpModel = {
    createConceptInc,
    getAllConceptInc,
    getConceptIncById,
    updateConceptInc,
    deleteConceptInc,
};
