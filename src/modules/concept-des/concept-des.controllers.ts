import { ConceptDesModel } from "./concept-des.model";

const getAllConceptDes = async (req: any, res:any) => {
    try {
        const conceptDes = await ConceptDesModel.getAllConceptDes();
        return res.status(200).json({ok: true, conceptDes});
    } catch (error) {
        console.error("Error fetching concept desincorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

const getConceptDesById = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const conceptDes = await ConceptDesModel.getConceptDesById(Number(id));
        if (!conceptDes) {
            return res.status(404).json({ok: false, message: "Concept desincorporation not found"});
        }
        return res.status(200).json({ok: true, conceptDes});
    } catch (error) {
        console.error("Error fetching concept desincorporation by ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const createConceptDes = async (req: any, res:any) => {
    try {
        const {nombre, codigo} = req.body;
        const newConceptDes = await ConceptDesModel.createConceptDes({nombre, codigo});
        return res.status(201).json({
            ok: true,
            message: "Concept desincorporation created successfully",
            newConceptDes,
        });
    } catch (error) {
        console.error("Error creating concept desincorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const updateConceptDes = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const updatedConceptDes = await ConceptDesModel.updateConceptDes(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Concept desincorporation updated successfully",
            updatedConceptDes,
        });
    } catch (error) {
        console.error("Error updating concept desincorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteConceptDes = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const deletedConceptDes = await ConceptDesModel.deleteConceptDes(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Concept desincorporation deleted successfully",
            deletedConceptDes,
        });
    } catch (error) {
        console.error("Error deleting concept desincorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
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