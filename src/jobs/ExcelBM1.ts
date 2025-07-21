import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { FurnitureModel } from "../modules/furniture/furniture.model";
import { ComponentsModel } from "../modules/components/components.model"; // Importar ComponentsModel

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Buscar bienes por departamento usando el modelo
  const assets = await FurnitureModel.getFurnitureByDepartment(deptId);
  console.log(`[ExcelBM1] Retrieved ${assets.length} assets for department ${deptId}.`);

  // Obtener componentes para cada activo
  for (const asset of assets) {
    const components = await ComponentsModel.getComponentsByBienId(asset.id);
    asset.components_description = components.map((c: any) => c.nombre).join(', ');
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
  const plantillaPath = path.resolve(__dirname, "../plantillas/plantilla-bm1.xlsx");
  console.log(`[ExcelBM1] Template path: ${plantillaPath}`);
  const plantillaBuffer = fs.readFileSync(plantillaPath); // Asegura tipo Buffer
  const generatedFilePaths: string[] = [];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(plantillaBuffer as any);

  // Cargar imágenes una sola vez para el workbook
  const escudoPath = path.resolve(__dirname, "../images/Escudo.jpg");
  const logoImpresionPath = path.resolve(__dirname, "../images/LogoImpresion.jpg");
  const redesPath = path.resolve(__dirname, "../images/Redes.png");

  console.log(`[ExcelBM1] Intentando cargar imagen: ${escudoPath}`);
  const escudoImageId = workbook.addImage({ filename: escudoPath, extension: 'jpeg' });
  console.log(`[ExcelBM1] ID de imagen Escudo: ${escudoImageId}`);

  console.log(`[ExcelBM1] Intentando cargar imagen: ${logoImpresionPath}`);
  const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: 'jpeg' });
  console.log(`[ExcelBM1] ID de imagen LogoImpresion: ${logoImpresionImageId}`);

  console.log(`[ExcelBM1] Intentando cargar imagen: ${redesPath}`);
  const redesImageId = workbook.addImage({ filename: redesPath, extension: 'png' });
  console.log(`[ExcelBM1] ID de imagen Redes: ${redesImageId}`);

  // Función para añadir imágenes a una hoja de trabajo específica
  const addImagesToWorksheet = (targetWs: ExcelJS.Worksheet) => {
    targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.5 }, ext: { width: 150, height: 50 } });
    targetWs.addImage(escudoImageId, { tl: { col: 6.5, row: 0.5 }, ext: { width: 80, height: 80 } });
    targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 24.5 }, ext: { width: 120, height: 40 } });
    console.log(`[ExcelBM1] Imágenes añadidas a la hoja de trabajo: ${targetWs.name}`);
  };

  // Función para copiar el contenido de la primera hoja a una nueva hoja (sin imágenes)
  const copyTemplateContent = (sourceWs: ExcelJS.Worksheet, targetWs: ExcelJS.Worksheet) => {
    sourceWs.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const newRow = targetWs.getRow(rowNumber);
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = newRow.getCell(colNumber);
        newCell.value = cell.value;
        newCell.style = cell.style;
      });
      newRow.height = row.height;
    });

    sourceWs.model.merges.forEach(merge => {
      targetWs.mergeCells(merge);
    });

    sourceWs.columns.forEach((column, index) => {
      if (column.width) {
        targetWs.getColumn(index + 1).width = column.width;
      }
    });

    // Asegurar que los marcadores de página estén presentes para el reemplazo
    targetWs.getCell('F5').value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
  };

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    let ws: ExcelJS.Worksheet;
    if (pagina === 0) {
      ws = workbook.worksheets[0];
      ws.name = `BM1 - Pagina 1`;
      addImagesToWorksheet(ws); // Añadir imágenes a la primera hoja
      // Asegurar que los marcadores de página estén presentes para el reemplazo en la primera hoja
      ws.getCell('F5:G5').value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
    } else {
      ws = workbook.addWorksheet(`BM1 - Pagina ${pagina + 1}`);
      copyTemplateContent(workbook.worksheets[0], ws);
      addImagesToWorksheet(ws); // Añadir imágenes a las nuevas hojas
    }
    console.log(`[ExcelBM1] Processing page ${pagina + 1} of ${totalPaginas}`);

    // Reemplazar marcadores en las celdas
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string") {
          cell.value = cell.value
            .replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "")
            .replace(/{{PARROQUIA}}/g, PARROQUIA)
            .replace(/{{FECHA}}/g, FECHA)
            .replace(/{{NPAGINA}}/g, String(pagina + 1)) // Usar NPAGINA
            .replace(/{{NTOTAL}}/g, String(totalPaginas)); // Usar NTOTAL
        }
      });
    });

    // Insertar los bienes en la tabla (ajusta la fila de inicio según tu plantilla)
    const startRow = 9; // Cambia según tu plantilla (por ejemplo, si la tabla empieza en la fila 10)
    const bienesPagina = assets.slice(pagina * BIENES_POR_PAGINA, (pagina + 1) * BIENES_POR_PAGINA);

    bienesPagina.forEach((asset, idx) => {
      const row = ws.getRow(startRow + idx);
      row.getCell(1).value = asset.grupo || "02";
      row.getCell(2).value = asset.subgrupo_codigo || "";
      row.getCell(3).value = asset.cantidad || 1;
      row.getCell(4).value = asset.numero_identificacion || "";
      row.getCell(5).value = [
        asset.nombre_descripcion,
        asset.numero_serial || "",
        asset.marca_nombre,
        asset.modelo_nombre,
        asset.estado_nombre,
        asset.components_description // Añadir la descripción de los componentes
      ].filter(Boolean).join(' ') || "";
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
  await workbook.xlsx.writeFile(rutaArchivo);
  console.log(`[ExcelBM1] Archivo final generado: ${rutaArchivo}`);
  generatedFilePaths.push(rutaArchivo);

  console.log(`[ExcelBM1] Finished generating files. Total generated: ${generatedFilePaths.length}`);
  return generatedFilePaths;
}
