import cron from "node-cron";
import { pool } from "../database/index";

// Función que cierra sesiones antiguas
export const closeOldSessions = async () => {
  try {
    const query = `
      UPDATE RegistroAuditoria
      SET salida = NOW()
      WHERE salida IS NULL AND entrada < (NOW() - INTERVAL 1 HOUR)
    `;
    const [result] = await pool.execute(query);
    if ((result as any).affectedRows > 0) {
      console.log(`[CRON] Sesiones cerradas automáticamente: ${(result as any).affectedRows}`);
    }
  } catch (error) {
    console.error("[CRON] Error cerrando sesiones antiguas:", error);
  }
};

// Ejecuta cada hora
cron.schedule("0 * * * *", closeOldSessions);

// Para pruebas manuales, puedes llamar closeOldSessions() desde otro archivo o desde aquí:
//closeOldSessions(); // Descomenta esta línea para probar manualmente