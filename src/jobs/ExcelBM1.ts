import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { FurnitureModel } from "../modules/furniture/furniture.model";
import { ComponentsModel } from "../modules/components/components.model"; // Importar ComponentsModel
import { globalConfig } from "../variables/globals"; // Importar globalConfig

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función auxiliar para añadir imágenes al workbook de ExcelJS de forma segura
const addImageToWorkbook = async (
  workbook: ExcelJS.Workbook,
  imageUrl: string | null | undefined,
  defaultImagePath: string,
  imageName: string
): Promise<number | undefined> => {
  let finalImagePath = defaultImagePath;
  let extension: "jpeg" | "png" | "gif" | undefined; // Eliminado 'webp' del tipo

  if (imageUrl) {
    const potentialPath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(potentialPath)) {
      finalImagePath = potentialPath;
    } else {
      console.warn(
        `[ExcelBM1] La imagen ${imageName} no se encontró en la URL configurada: ${imageUrl}. Usando imagen por defecto.`
      );
    }
  } else {
    console.warn(
      `[ExcelBM1] URL para ${imageName} no disponible en la configuración global. Usando imagen por defecto.`
    );
  }

  extension = path.extname(finalImagePath).toLowerCase().substring(1) as any; // Eliminar el '.' inicial

  if (!extension || !["jpeg", "png", "gif"].includes(extension)) {
    // Eliminado 'webp' de la comprobación
    console.warn(
      `[ExcelBM1] Formato de imagen no soportado para ${imageName} (${extension}). Usando extensión 'jpeg' por defecto.`
    );
    extension = "jpeg"; // Fallback a jpeg si la extensión no es reconocida o soportada por ExcelJS
  }

  try {
    const imageId = workbook.addImage({
      filename: finalImagePath,
      extension: extension,
    });
    console.log(`[ExcelBM1] ID de imagen ${imageName}: ${imageId}`);
    return imageId;
  } catch (error: any) {
    console.error(
      `[ExcelBM1] Error al cargar la imagen ${imageName} desde ${finalImagePath}:`,
      error
    );
    return undefined;
  }
};

/**
 * Exporta los bienes de un departamento a un archivo Excel usando una plantilla.
 * Obtiene los bienes usando el modelo FurnitureModel.getFurnitureByDepartment.
 * @param deptId ID del departamento.
 * @param departamentoNombre Nombre del departamento.
 * @param outputPath Ruta donde se guardará el archivo generado.
 */
export async function exportBM1ByDepartment(
  deptId: number,
  departamentoNombre: string,
  outputPath: string
): Promise<string[]> {
  try {
    // Buscar bienes por departamento usando el modelo
    const assets = await FurnitureModel.getFurnitureByDepartment(deptId);
    console.log(
      `[ExcelBM1] Retrieved ${assets.length} assets for department ${deptId}.`
    );

    // Obtener componentes para cada activo
    for (const asset of assets) {
      const components = await ComponentsModel.getComponentsByBienId(asset.id);
      asset.components_description = components
        .map((c: any) => c.nombre)
        .join(", ");
      if (asset.components_description) {
        asset.components_description = `Componentes: ${asset.components_description}`;
      }
    }

    const PARROQUIA = "Tariba";
    const FECHA = new Date().toLocaleDateString("es-VE");
    const BIENES_POR_PAGINA = 13;
    const totalPaginas = Math.ceil(assets.length / BIENES_POR_PAGINA);
    console.log(`[ExcelBM1] Total pages to generate: ${totalPaginas}`);

    // Ruta absoluta a la plantilla
    const plantillaPath = path.resolve(
      __dirname,
      "../plantillas/plantilla-bm1.xlsx"
    );
    console.log(`[ExcelBM1] Template path: ${plantillaPath}`);
    if (!fs.existsSync(plantillaPath)) {
      throw new Error(`La plantilla Excel no se encontró en: ${plantillaPath}`);
    }
    let plantillaBuffer: Buffer;
    try {
      plantillaBuffer = fs.readFileSync(plantillaPath); // Asegura tipo Buffer
    } catch (error: any) {
      console.error(
        `[ExcelBM1] Error al leer la plantilla en ${plantillaPath}:`,
        error
      );
      throw new Error(`No se pudo leer la plantilla Excel: ${error.message}`);
    }
    const generatedFilePaths: string[] = [];

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(plantillaBuffer as any);
    } catch (error: any) {
      console.error(
        `[ExcelBM1] Error al cargar la plantilla Excel desde el buffer:`,
        error
      );
      throw new Error(`No se pudo cargar la plantilla Excel: ${error.message}`);
    }

    // Cargar imágenes una sola vez para el workbook usando la configuración global
    const logoImpresionImageId = await addImageToWorkbook(
      workbook,
      globalConfig.url_logo,
      path.resolve(__dirname, "../images/LogoImpresion.jpg"),
      "LogoImpresion"
    );
    const escudoImageId = await addImageToWorkbook(
      workbook,
      globalConfig.url_impresion_1, // Asumiendo que url_impresion_1 es para el escudo
      path.resolve(__dirname, "../images/Escudo.jpg"),
      "Escudo"
    );
    const redesImageId = await addImageToWorkbook(
      workbook,
      globalConfig.url_impresion_2, // Asumiendo que url_impresion_2 es para redes
      path.resolve(__dirname, "../images/Redes.png"),
      "Redes"
    );

    // Función para añadir imágenes a una hoja de trabajo específica
    const addImagesToWorksheet = (targetWs: ExcelJS.Worksheet) => {
      if (logoImpresionImageId) {
        targetWs.addImage(logoImpresionImageId, {
          tl: { col: 0.5, row: 0.2 },
          ext: { width: 150, height: 50 },
        });
      }
      if (escudoImageId) {
        targetWs.addImage(escudoImageId, {
          tl: { col: 6.5, row: 0.05 },
          ext: { width: 70, height: 60 },
        });
      }
      if (redesImageId) {
        targetWs.addImage(redesImageId, {
          tl: { col: 0.5, row: 24.5 },
          ext: { width: 120, height: 40 },
        });
      }
      console.log(
        `[ExcelBM1] Imágenes añadidas a la hoja de trabajo: ${targetWs.name}`
      );
    };

    // Función para copiar el contenido de la primera hoja a una nueva hoja
    const copyTemplateContent = (
      sourceWs: ExcelJS.Worksheet,
      targetWs: ExcelJS.Worksheet
    ) => {
      sourceWs.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const newRow = targetWs.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;
          newCell.style = cell.style;
        });
        newRow.height = row.height;
      });

      sourceWs.model.merges.forEach((merge) => {
        targetWs.mergeCells(merge);
      });

      sourceWs.columns.forEach((column, index) => {
        if (column.width) {
          targetWs.getColumn(index + 1).width = column.width;
        }
      });

      // Asegurar que los marcadores de página estén presentes para el reemplazo
      targetWs.getCell("F5").value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
    };

    for (let pagina = 0; pagina < totalPaginas; pagina++) {
      let ws: ExcelJS.Worksheet;
      if (pagina === 0) {
        ws = workbook.worksheets[0];
        ws.name = `BM1 - Pagina 1`;
        addImagesToWorksheet(ws); // Añadir imágenes a la primera hoja
        // Asegurar que los marcadores de página estén presentes para el reemplazo en la primera hoja
        ws.getCell("F5:G5").value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
      } else {
        ws = workbook.addWorksheet(`BM1 - Pagina ${pagina + 1}`);
        copyTemplateContent(workbook.worksheets[0], ws);
        addImagesToWorksheet(ws); // Añadir imágenes a las nuevas hojas
      }
      console.log(
        `[ExcelBM1] Processing page ${pagina + 1} of ${totalPaginas}`
      );

      // Reemplazar marcadores en las celdas
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          if (typeof cell.value === "string") {
            cell.value = cell.value
              .replace(
                /{{DEPARTAMENTO}}/g,
                "Oficina de " + departamentoNombre || ""
              )
              .replace(/{{PARROQUIA}}/g, PARROQUIA)
              .replace(/{{FECHA}}/g, FECHA)
              .replace(/{{NPAGINA}}/g, String(pagina + 1)) // Usar NPAGINA
              .replace(/{{NTOTAL}}/g, String(totalPaginas)); // Usar NTOTAL
          }
        });
      });

      // Insertar los bienes en la tabla
      const startRow = 9; // Cambia según la plantilla
      const bienesPagina = assets.slice(
        pagina * BIENES_POR_PAGINA,
        (pagina + 1) * BIENES_POR_PAGINA
      );

      bienesPagina.forEach((asset, idx) => {
        const row = ws.getRow(startRow + idx);
        const baseDescriptionParts = [
          asset.nombre_descripcion,
          "S/N: " + (asset.numero_serial || ""),
          asset.marca_nombre,
          asset.modelo_nombre,
          asset.estado_nombre,
          asset.components_description,
        ].filter(Boolean);

        if (asset.isActive === 0) {
          row.getCell(5).value = {
            richText: [
              { text: baseDescriptionParts.join(" ") },
              { font: { color: { argb: "FFFF0000" } }, text: " (Inactivo)" }, // Rojo
            ],
          };
        } else {
          row.getCell(5).value = baseDescriptionParts.join(" ") || "";
        }

        row.getCell(1).value = asset.grupo || "02";
        row.getCell(2).value = asset.subgrupo_codigo || "";
        row.getCell(3).value = asset.cantidad || 1;
        row.getCell(4).value = asset.numero_identificacion || "";
        row.getCell(6).value = Number(asset.valor_unitario) || 0;
        row.getCell(7).value = Number(asset.valor_total) || 0;
        row.commit();
      });

      // Borra filas sobrantes si hay menos de 13 bienes
      for (let idx = bienesPagina.length; idx < BIENES_POR_PAGINA; idx++) {
        const row = ws.getRow(startRow + idx);
        for (let col = 1; col <= 7; col++) row.getCell(col).value = "";
        row.commit();
      }
    }

    // Guardar el único archivo generado al final
    const nombreArchivo = `BM1_${departamentoNombre}.xlsx`; // Nombre de archivo único
    const rutaArchivo = path.join(outputPath, nombreArchivo);
    try {
      await workbook.xlsx.writeFile(rutaArchivo);
      console.log(`[ExcelBM1] Archivo final generado: ${rutaArchivo}`);
      generatedFilePaths.push(rutaArchivo);
    } catch (error: any) {
      console.error(
        `[ExcelBM1] Error al escribir el archivo Excel en ${rutaArchivo}:`,
        error
      );
      throw new Error(`No se pudo escribir el archivo Excel: ${error.message}`);
    }

    console.log(
      `[ExcelBM1] Finished generating files. Total generated: ${generatedFilePaths.length}`
    );
    return generatedFilePaths;
  } catch (error: any) {
    console.error(
      `[ExcelBM1] Error inesperado en exportBM1ByDepartment:`,
      error
    );
    throw new Error(`Error al generar el archivo Excel BM1: ${error.message}`);
  }
}
