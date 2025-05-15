import {Request, Response} from "express";
import {ConcepIncorpModel} from "./concept-inc.model";

const getAllConceptInc = async (req: any, res: any) => {
    try {
        const conceptInc = await ConcepIncorpModel.getAllConceptInc();
        return res.status(200).json({ok: true, conceptInc});
    } catch (error) {
        console.error("Error fetching concept incorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}; 

const getConceptIncById = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const conceptInc = await ConcepIncorpModel.getConceptIncById(Number(id));
        if (!conceptInc) {
            return res.status(404).json({ok: false, message: "Concept incorporation not found"});
        }
        return res.status(200).json({ok: true, conceptInc});
    } catch (error) {
        console.error("Error fetching concept incorporation by ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const createConceptInc = async (req: any, res: any) => {
    try {
        const {nombre, codigo} = req.body;
        const newConceptInc = await ConcepIncorpModel.createConceptInc({nombre, codigo});
        return res.status(201).json({
            ok: true,
            message: "Concept incorporation created successfully",
            newConceptInc,
        });
    } catch (error) {
        console.error("Error creating concept incorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const updateConceptInc = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const updatedConceptInc = await ConcepIncorpModel.updateConceptInc(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Concept incorporation updated successfully",
            updatedConceptInc,
        });
    } catch (error) {
        console.error("Error updating concept incorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteConceptInc = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const deletedConceptInc = await ConcepIncorpModel.deleteConceptInc(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Concept incorporation deleted successfully",
            deletedConceptInc,
        });
    } catch (error) {
        console.error("Error deleting concept incorporation:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const ConceptIncController = {
    getAllConceptInc,
    getConceptIncById,
    createConceptInc,
    updateConceptInc,
    deleteConceptInc,
};



