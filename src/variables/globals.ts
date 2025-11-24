import { configModel } from "../modules/config/config.model";

interface GlobalConfig {
  url_banner: string | null;
  url_logo: string | null;
  url_favicon: string | null;
  url_impresion_1: string | null;
  url_impresion_2: string | null;
  colorprimario: string | null;
  colorsecundario: string | null;
  nombre_institucion: string | null;
}

export const globalConfig: GlobalConfig = {
  url_banner: null,
  url_logo: null,
  url_favicon: null,
  url_impresion_1: null,
  url_impresion_2: null,
  colorprimario: null,
  colorsecundario: null,
  nombre_institucion: null,
};

export async function loadGlobalConfig() {
  try {
    const config = await configModel.getConfig();
    if (config) {
      globalConfig.url_banner = config.url_banner;
      globalConfig.url_logo = config.url_logo;
      globalConfig.url_favicon = config.url_favicon;
      globalConfig.url_impresion_1 = config.url_impresion_1;
      globalConfig.url_impresion_2 = config.url_impresion_2;
      globalConfig.colorprimario = config.colorprimario;
      globalConfig.colorsecundario = config.colorsecundario;
      globalConfig.nombre_institucion = config.nombre_institucion;
    }
    console.log("[Globals] Configuración global cargada:", globalConfig);
  } catch (error) {
    console.error("[Globals] Error al cargar la configuración global:", error);
  }
}

// Cargar la configuración al inicio de la aplicación
// Esto podría ser llamado en el punto de entrada de la aplicación (e.g., src/index.ts)
// loadGlobalConfig();
