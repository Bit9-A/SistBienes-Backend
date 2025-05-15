import { pool } from "../../database/index";

const createConceptInc = async ({
    nombre,
    codigo,
} : {
    nombre: string;
    codigo: string;
}) => {
    const query = `
        INSERT INTO ConceptoIncorp (nombre, codigo)
        VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, codigo]);

    const concepIncorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorp WHERE id = ?`;
    const [rows] = await pool.execute(concepIncorpQuery, [(result as any).insertId]);
    return (rows as any[])[0];
};

const getAllConceptInc = async () => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorp
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

const getConceptIncById = async (id: number) => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorp WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

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
        UPDATE ConceptoIncorp
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

const deleteConceptInc = async (id: number) => {
    const query = `
        DELETE FROM ConceptoIncorp WHERE id=?`;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const ConcepIncorpModel = {
    createConceptInc,
    getAllConceptInc,
    getConceptIncById,
    updateConceptInc,
    deleteConceptInc,
}

