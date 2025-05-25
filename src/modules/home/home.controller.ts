import { Request, Response } from 'express';
import { mueblesModel } from './home.model';

const getCounts = async (req: Request, res: Response) => {
    try {
        const counts = await mueblesModel.getCounts();
        res.status(200).json({ ok: true, counts });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const mueblesController = {
    getCounts,
};
