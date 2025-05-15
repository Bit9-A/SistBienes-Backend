import { pool } from "../../database/index";

const createConceptDes = async ({
    nombre,
    codigo,
}:{
    nombre: string;
    codigo: string;
}) => {
    const query = `
        INSERT INTO ConceptoDesincorp (nombre, codigo)
        VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [nombre, codigo]);

    const concepDesincorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorp WHERE id = ?`;
    const [rows] = await pool.execute(concepDesincorpQuery, [(result as any).insertId]);
    return (rows as any[])[0];
};

const getAllConceptDes = async () => {
    const query = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorp
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

const getConceptDesById = async (id: number) => {
    const query = `
    SELECR id, nombre, codigo 
    FROM ConceptDesincorp WHERE id=?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

const updateConceptDes = async (
    id: number, 
    {
        nombre,
        codigo,
    }: {
        nombre?: string;
        codigo?: string;
    } 
) =>  {
    const query = `
        UPDATE ConceptoDesincorp 
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

const deleteConceptDes = async (id: number) => {
    const query = `
        DELETE FROM ConceptoDesincorp WHERE id = ?
    `;
    const [result] = await pool.execute(query, [id]);
    return result;
};

export const ConceptDesModel = {
    createConceptDes,
    getAllConceptDes,
    getConceptDesById,
    updateConceptDes,
    deleteConceptDes,
}