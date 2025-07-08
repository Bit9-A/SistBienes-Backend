import { Request, Response } from 'express';
import { HomeModel } from './home.model';

// Este controlador maneja las operaciones relacionadas con los muebles y sus conteos
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

// Este controlador maneja la obtención de los conteos de estado de bienes
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

// Este controlador maneja la obtención del total de muebles
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

// Este controlador maneja la obtención de muebles creados en la última semana
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

// Este controlador maneja la obtención del valor total de bienes por departamento
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

// Este controlador maneja el conteo de muebles por mes
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

// Exportamos el controlador para que pueda ser utilizado en las rutas
export const mueblesController = {
    getCounts,
    getCountsEstadobien,
    getTotalMuebles,
    getMueblesUltimaSemana,
    obtenerValorTotalBienesPorDepartamento,
    contarMueblesPorMes
};
