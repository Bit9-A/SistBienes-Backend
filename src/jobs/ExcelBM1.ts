import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { FurnitureModel } from "../modules/furniture/furniture.model";

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

  const PARROQUIA = "Tariba";
  const FECHA = new Date().toLocaleDateString("es-VE");
  const BIENES_POR_PAGINA = 13;
  const totalPaginas = Math.ceil(assets.length / BIENES_POR_PAGINA);
  console.log(`[ExcelBM1] Total pages to generate: ${totalPaginas}`);

  // Ruta absoluta a la plantilla
  const plantillaPath = path.resolve(__dirname, "../../plantillas/plantilla-bm1.xlsx");
  console.log(`[ExcelBM1] Template path: ${plantillaPath}`);
  const plantillaBuffer = fs.readFileSync(plantillaPath); // Asegura tipo Buffer
  const generatedFilePaths: string[] = [];

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(plantillaBuffer as any);
    const ws = workbook.worksheets[0];
    console.log(`[ExcelBM1] Processing page ${pagina + 1} of ${totalPaginas}`);

    // Cargar y añadir imágenes
    const escudoPath = path.resolve(__dirname, "../../images/Escudo.jpg");
    const logoImpresionPath = path.resolve(__dirname, "../../images/LogoImpresion.jpg");
    const redesPath = path.resolve(__dirname, "../../images/Redes.png");

    console.log(`[ExcelBM1] Intentando cargar imagen: ${escudoPath}`);
    const escudoImageId = workbook.addImage({
      filename: escudoPath,
      extension: 'jpeg',
    });
    console.log(`[ExcelBM1] ID de imagen Escudo: ${escudoImageId}`);

    console.log(`[ExcelBM1] Intentando cargar imagen: ${logoImpresionPath}`);
    const logoImpresionImageId = workbook.addImage({
      filename: logoImpresionPath,
      extension: 'jpeg',
    });
    console.log(`[ExcelBM1] ID de imagen LogoImpresion: ${logoImpresionImageId}`);

    console.log(`[ExcelBM1] Intentando cargar imagen: ${redesPath}`);
    const redesImageId = workbook.addImage({
      filename: redesPath,
      extension: 'png',
    });
    console.log(`[ExcelBM1] ID de imagen Redes: ${redesImageId}`);

    // Añadir imágenes a la hoja de trabajo en posiciones estimadas
    console.log(`[ExcelBM1] Añadiendo imágenes a la hoja de trabajo.`);
    ws.addImage(logoImpresionImageId, 'A1:C1');
    ws.addImage(escudoImageId, 'G1:G1');
    ws.addImage(redesImageId, 'A25:C27');
    console.log(`[ExcelBM1] Imágenes añadidas a la hoja de trabajo.`);

    // Reemplazar marcadores en las celdas
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string") {
          cell.value = cell.value
            .replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "")
            .replace(/{{PARROQUIA}}/g, PARROQUIA)
            .replace(/{{NPAGINA}}/g, String(pagina + 1))
            .replace(/{{NTOTAL}}/g, String(totalPaginas))
            .replace(/{{FECHA}}/g, FECHA);
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
      row.getCell(5).value = asset.nombre_descripcion || "";
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

    // Guardar el archivo generado
    const nombreArchivo = `BM1_${departamentoNombre}_${pagina + 1}_de_${totalPaginas}.xlsx`;
    const rutaArchivo = path.join(outputPath, nombreArchivo);
    await workbook.xlsx.writeFile(rutaArchivo);
    console.log(`[ExcelBM1] Archivo generado: ${rutaArchivo}`);
    generatedFilePaths.push(rutaArchivo);
  }
  console.log(`[ExcelBM1] Finished generating files. Total generated: ${generatedFilePaths.length}`);
  return generatedFilePaths;
}
