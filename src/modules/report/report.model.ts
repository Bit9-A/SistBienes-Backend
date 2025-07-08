import { pool } from "../../database/index";
// Este modelo maneja las operaciones relacionadas con los reportes mensuales
interface IncorporationCount {
  total_incorporations: number;
}

interface DisincorporationCount {
  total_disincorporations: number;
}

interface PreviousExistence {
  existencia_anterior: number;
}

interface FinalAssetsCount {
  existencia_final: number;
}

// Este modelo maneja las operaciones relacionadas con los reportes mensuales

// Este modelo maneja la obtención de incorporaciones por mes y departamento
const getIncorporationsByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<IncorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_incorporations
    FROM IncorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [IncorporationCount[], any];
  return rows[0];
};

// Este modelo maneja la obtención de desincorporaciones por concepto 60 por mes y departamento
const getDisincorporationsConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<DisincorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id = (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [DisincorporationCount[], any];
  return rows[0];
};

// Este modelo maneja la obtención de desincorporaciones por concepto diferente a 60 por mes y departamento
const getDisincorporationsExceptConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<DisincorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id != (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [DisincorporationCount[], any];
  return rows[0];
};

// Este modelo maneja la obtención de activos activos del mes anterior por departamento
const getActiveAssetsPreviousMonthByDepartment = async (month: number, year: number, deptId: number): Promise<PreviousExistence> => {
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  const query = `
    SELECT COUNT(*) AS existencia_anterior
    FROM Activos
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = await pool.execute(query, [previousMonth, previousYear, deptId]) as [PreviousExistence[], any];
  return rows[0];
};

// Este modelo maneja el cálculo de la existencia final de activos por mes y departamento
const getFinalAssetsCountByMonth = async (month: number, year: number, deptId: number): Promise<FinalAssetsCount> => {
  // Obtener todos los valores necesarios
  const [existenciaAnterior, incorporaciones, desincorporaciones60, desincorporacionesNo60] = await Promise.all([
    getActiveAssetsPreviousMonthByDepartment(month, year, deptId),
    getIncorporationsByMonthAndDepartment(month, year, deptId),
    getDisincorporationsConcept60ByMonthAndDepartment(month, year, deptId),
    getDisincorporationsExceptConcept60ByMonthAndDepartment(month, year, deptId)
  ]);

  // Calcular existencia final
  const existenciaFinal = existenciaAnterior.existencia_anterior +
    incorporaciones.total_incorporations -
    (desincorporaciones60.total_disincorporations + desincorporacionesNo60.total_disincorporations);

  return { existencia_final: existenciaFinal };
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const reportModel = {
  getIncorporationsByMonthAndDepartment,
  getDisincorporationsConcept60ByMonthAndDepartment,
  getDisincorporationsExceptConcept60ByMonthAndDepartment,
  getActiveAssetsPreviousMonthByDepartment,
  getFinalAssetsCountByMonth
};
