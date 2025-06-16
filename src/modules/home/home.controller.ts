import { Request, Response } from 'express';
import { HomeModel } from './home.model';

const getCounts = async (req: Request, res: Response) => {
    try {
        const counts = await HomeModel.getSubgruposConConteo();
        res.status(200).json({ ok: true, counts });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al obtener los conteos de subgrupos: " + error.message : "Error desconocido" 
        });
    }
};

const getCountsEstadobien = async (req: Request, res: Response) => {
    try {
        const countsEstadobien = await HomeModel.getGoodStatusConConteo();
        res.status(200).json({ ok: true, countsEstadobien });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al obtener los conteos de estado de bienes: " + error.message : "Error desconocido" 
        });
    }
};

const getTotalMuebles = async (req: Request, res: Response) => {
    try {
        const total = await HomeModel.contarMuebles();
        res.status(200).json({ ok: true, total });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al contar los muebles: " + error.message : "Error desconocido" 
        });
    }
};

const getMueblesUltimaSemana = async (req: Request, res: Response) => {
    try {
        const ultimaSemana = await HomeModel.contarMueblesUltimaSemana();
        res.status(200).json({ ok: true, ultimaSemana });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al contar los muebles de la última semana: " + error.message : "Error desconocido" 
        });
    }
};

const obtenerValorTotalBienesPorDepartamento = async (req: Request, res: Response) => {
    try {
        const valortotal = await HomeModel.obtenerValorTotalBienesPorDepartamento();
        res.status(200).json({ ok: true, valortotal });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al obtener el valor total de bienes por departamento: " + error.message : "Error desconocido" 
        });
    }
};

const contarMueblesPorMes = async (req: Request, res: Response) => {
    try {
        const mublesPorMes = await HomeModel.contarMueblesPorMes();
        res.status(200).json({ ok: true, mublesPorMes });
    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Error del servidor", 
            error: error instanceof Error ? "Error al contar los muebles por mes: " + error.message : "Error desconocido" 
        });
    }
};

export const mueblesController = {
    getCounts,
    getCountsEstadobien,
    getTotalMuebles,
    getMueblesUltimaSemana,
    obtenerValorTotalBienesPorDepartamento,
    contarMueblesPorMes
};
