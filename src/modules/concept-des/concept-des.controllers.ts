import { ConceptDesModel } from "./concept-des.model";

// Este controlador maneja las operaciones CRUD para los conceptos de desincorporación
const getAllConceptDes = async (req: any, res: any) => {
    try {
        // Obtenemos todos los conceptos de desincorporación
        const conceptDes = await ConceptDesModel.getAllConceptDes();
        return res.status(200).json({ ok: true, conceptDes });
    } catch (error) {
        console.error("Error al obtener el concepto de desincorporación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
}

// Este controlador maneja la obtención de un concepto de desincorporación por su ID
const getConceptDesById = async (req: any, res: any) => {
    try {
        // Verificamos que se haya proporcionado un ID válido
        const { id } = req.params;
        // Si el ID no es un número, respondemos con un error 400
        const conceptDes = await ConceptDesModel.getConceptDesById(Number(id));
        if (!conceptDes) {
            return res.status(404).json({ ok: false, message: "Concepto de desincorporación no encontrado" });
        }
        return res.status(200).json({ ok: true, conceptDes });
    } catch (error) {
        console.error("Error al obtener la desincorporación del concepto por ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la creación de un nuevo concepto de desincorporación
const createConceptDes = async (req: any, res: any) => {
    try {
        // Verificamos que se hayan proporcionado los campos necesarios
        const { nombre, codigo } = req.body;
        const newConceptDes = await ConceptDesModel.createConceptDes({ nombre, codigo });
        return res.status(201).json({
            ok: true,
            message: "Concepto de desincorporación creado con éxito",
            newConceptDes,
        });
    } catch (error) {
        console.error("Error al crear la desincorporación del concepto:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la actualización de un concepto de desincorporación existente
const updateConceptDes = async (req: any, res: any) => {
    try {
        // Verificamos que se haya proporcionado un ID válido
        const { id } = req.params;
        const updatedConceptDes = await ConceptDesModel.updateConceptDes(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Concepto de desincorporación actualizado con éxito",
            updatedConceptDes,
        });
    } catch (error) {
        console.error("Error al actualizar el concepto de desincorporación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

//
const deleteConceptDes = async (req: any, res: any) => {
    try {
        // Verificamos que se haya proporcionado un ID válido
        const { id } = req.params;
        const deletedConceptDes = await ConceptDesModel.deleteConceptDes(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Concepto de desincorporación eliminado correctamente",
            deletedConceptDes,
        });
    } catch (error) {
        console.error("Error al eliminar el concepto de desincorporación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const ConceptDesController = {
    getAllConceptDes,
    getConceptDesById,
    createConceptDes,
    updateConceptDes,
    deleteConceptDes,
}