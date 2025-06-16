import { ConceptDesModel } from "./concept-des.model";

const getAllConceptDes = async (req: any, res:any) => {
    try {
        const conceptDes = await ConceptDesModel.getAllConceptDes();
        return res.status(200).json({ok: true, conceptDes});
    } catch (error) {
        console.error("Error al obtener el concepto de desincorporación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
}

const getConceptDesById = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const conceptDes = await ConceptDesModel.getConceptDesById(Number(id));
        if (!conceptDes) {
            return res.status(404).json({ok: false, message: "Concepto de desincorporación no encontrado"});
        }
        return res.status(200).json({ok: true, conceptDes});
    } catch (error) {
        console.error("Error al obtener la desincorporación del concepto por ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

const createConceptDes = async (req: any, res:any) => {
    try {
        const {nombre, codigo} = req.body;
        const newConceptDes = await ConceptDesModel.createConceptDes({nombre, codigo});
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

const updateConceptDes = async (req: any, res:any) => {
    try {
        const {id} = req.params;
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

const deleteConceptDes = async (req: any, res:any) => {
    try {
        const {id} = req.params;
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

export const ConceptDesController = {
    getAllConceptDes,
    getConceptDesById,
    createConceptDes,
    updateConceptDes,
    deleteConceptDes,
}