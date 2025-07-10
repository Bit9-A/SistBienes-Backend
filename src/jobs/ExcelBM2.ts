import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { IncorpModel } from "../modules/incorp/incorp.model";
import { desincorpModel } from "../modules/desincorp/desincorp.model";
import { ComponentsModel } from "../modules/components/components.model"; // Importar ComponentsModel

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exporta los bienes incorporados o desincorporados de un departamento a un archivo Excel usando una plantilla BM2.
 * @param deptId ID del departamento.
 * @param departamentoNombre Nombre del departamento.
 * @param mes Mes de la operación.
 * @param año Año de la operación.
 * @param tipo 'incorporacion' o 'desincorporacion'.
 * @param outputPath Ruta donde se guardará el archivo generado.
 */
export async function exportBM2ByDepartment(
  deptId: number,
  departamentoNombre: string,
  mes: number,
  año: number,
  tipo: 'incorporacion' | 'desincorporacion',
  outputPath: string
): Promise<string[]> {
  let assets: any[] = [];
  let conceptoMovimiento: string = "";

  if (tipo === 'incorporacion') {
    assets = await IncorpModel.getIncorpsByMonthYearDept(mes, año, deptId);
    conceptoMovimiento = "Incorporación";
    console.log(`[ExcelBM2] Incorporaciones recuperadas: ${assets.length} activos.`);
  } else if (tipo === 'desincorporacion') {
    assets = await desincorpModel.getDesincorpsByMonthYearDept(mes, año, deptId);
    conceptoMovimiento = "Desincorporación";
    console.log(`[ExcelBM2] Desincorporaciones recuperadas: ${assets.length} activos.`);
  }

  console.log(`[ExcelBM2] Retrieved ${assets.length} assets for department ${deptId}, month ${mes}, year ${año} (tipo: ${tipo}).`);
  console.log(`[ExcelBM2] Concepto de Movimiento: ${conceptoMovimiento}`);
  console.log(`[ExcelBM2] Primeros 5 activos recuperados:`, assets.slice(0, 5).map(a => ({ id: a.id, bien_nombre: a.bien_nombre, valor: a.valor, tipo_operacion: tipo })));


  // Obtener componentes para cada activo (si aplica)
  for (const asset of assets) {
    if (asset.bien_id) { // Asegurarse de que bien_id exista
      const components = await ComponentsModel.getComponentsByBienId(asset.bien_id);
      asset.components_description = components.map((c: any) => c.nombre).join(', ');
      if (asset.components_description) {
        asset.components_description = `Componentes: ${asset.components_description}`;
      }
    }
  }

  const PARROQUIA = "Tariba"; // Asumiendo que es fijo o se obtiene de otro lado
  const FECHA = new Date().toLocaleDateString("es-VE");
  const BIENES_POR_PAGINA = 6; // Ajustar según la plantilla BM2
  const totalPaginas = Math.ceil(assets.length / BIENES_POR_PAGINA);
  console.log(`[ExcelBM2] Total pages to generate: ${totalPaginas}`);

  // Ruta absoluta a la plantilla
  const plantillaPath = path.resolve(__dirname, "../../plantillas/plantilla-bm2.xlsx");
  console.log(`[ExcelBM2] Template path: ${plantillaPath}`);
  const plantillaBuffer = fs.readFileSync(plantillaPath);
  const generatedFilePaths: string[] = [];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(plantillaBuffer as any);

  // Cargar imágenes una sola vez para el workbook
  const escudoPath = path.resolve(__dirname, "../../images/Escudo.jpg");
  const logoImpresionPath = path.resolve(__dirname, "../../images/LogoImpresion.jpg");
  const redesPath = path.resolve(__dirname, "../../images/Redes.png");

  console.log(`[ExcelBM2] Intentando cargar imagen: ${escudoPath}`);
  const escudoImageId = workbook.addImage({ filename: escudoPath, extension: 'jpeg' });
  console.log(`[ExcelBM2] ID de imagen Escudo: ${escudoImageId}`);

  console.log(`[ExcelBM2] Intentando cargar imagen: ${logoImpresionPath}`);
  const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: 'jpeg' });
  console.log(`[ExcelBM2] ID de imagen LogoImpresion: ${logoImpresionImageId}`);

  console.log(`[ExcelBM2] Intentando cargar imagen: ${redesPath}`);
  const redesImageId = workbook.addImage({ filename: redesPath, extension: 'png' });
  console.log(`[ExcelBM2] ID de imagen Redes: ${redesImageId}`);

  // Función para añadir imágenes a una hoja de trabajo específica
  const addImagesToWorksheet = (targetWs: ExcelJS.Worksheet) => {
    targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.2 }, ext: { width: 150, height: 50 } });
    targetWs.addImage(escudoImageId, { tl: { col: 8.8, row: 0.2 }, ext: { width: 80, height: 80 } }); // Ajustado a I1 (col 8.5 para centrar en I)
    targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 24.5 }, ext: { width: 120, height: 40 } }); // Ajustado para subir la imagen de redes
    console.log(`[ExcelBM2] Imágenes añadidas a la hoja de trabajo: ${targetWs.name}`);
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
    targetWs.getCell('G6').value = `HOJA {{PAGINAN}}/{{TOTALN}}`;
  };

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    let ws: ExcelJS.Worksheet;
    if (pagina === 0) {
      ws = workbook.worksheets[0];
      ws.name = `BM2 ${tipo === 'incorporacion' ? 'Inc.' : 'Desinc.'} - Pagina 1`;
      addImagesToWorksheet(ws); // Añadir imágenes a la primera hoja
      // Asegurar que los marcadores de página estén presentes para el reemplazo en la primera hoja
      ws.getCell('G6').value = `HOJA {{PAGINAN}}/{{TOTALN}}`;
    } else {
      ws = workbook.addWorksheet(`BM2 ${tipo === 'incorporacion' ? 'Inc.' : 'Desinc.'} - Pagina ${pagina + 1}`);
      copyTemplateContent(workbook.worksheets[0], ws);
      addImagesToWorksheet(ws); // Añadir imágenes a las nuevas hojas
    }
    console.log(`[ExcelBM2] Processing page ${pagina + 1} of ${totalPaginas}`);

    // Reemplazar marcadores en las celdas
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string") {
          cell.value = cell.value
            .replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "")
            .replace(/{{PARROQUIA}}/g, PARROQUIA)
            .replace(/{{FECHA}}/g, FECHA)
            .replace(/{{PAGINAN}}/g, String(pagina + 1)) // Usar PAGINAN
            .replace(/{{TOTALN}}/g, String(totalPaginas)); // Usar TOTALN
        }
      });
    });

    // Reemplazar el concepto de movimiento
    ws.getCell('H8').value = conceptoMovimiento; // Celda para el concepto de movimiento

    // Insertar los bienes en la tabla (ajusta la fila de inicio según tu plantilla)
    const startRow = 11; // Fila de inicio de la tabla en plantilla-bm2.xlsx
    const bienesPagina = assets.slice(pagina * BIENES_POR_PAGINA, (pagina + 1) * BIENES_POR_PAGINA);

    bienesPagina.forEach((asset, idx) => {
      console.log(`[ExcelBM2] Procesando activo: ${asset.bien_nombre}, Valor: ${asset.valor}, Tipo: ${typeof asset.valor}`);
      const row = ws.getRow(startRow + idx);
      
      row.getCell(1).value = asset.grupo || "02"; // Columna A
      console.log(`[ExcelBM2] Col 1 (Grupo): ${row.getCell(1).value}`);
      
      row.getCell(2).value = asset.subgrupo_codigo || ""; // Columna B
      console.log(`[ExcelBM2] Col 2 (Subgrupo): ${row.getCell(2).value}`);
      
      row.getCell(3).value = asset.concepto_codigo || ""; // Columna C (Concepto de Movimiento - ahora usa el código)
      console.log(`[ExcelBM2] Col 3 (Concepto): ${row.getCell(3).value}`);
      
      row.getCell(4).value = asset.cantidad || 1; // Columna D
      console.log(`[ExcelBM2] Col 4 (Cantidad): ${row.getCell(4).value}`);
      
      row.getCell(5).value = asset.numero_identificacion || ""; // Columna E
      console.log(`[ExcelBM2] Col 5 (N° Identificación): ${row.getCell(5).value}`);
      
      const descripcion = [ // Columna F (Descripción de los Bienes)
        asset.bien_nombre,
        asset.numero_serial || "",
        asset.marca_nombre,
        asset.modelo_nombre,
        asset.estado_nombre,
        asset.components_description // Añadir la descripción de los componentes
      ].filter(Boolean).join(' ') || "";
      row.getCell(6).value = descripcion;
      console.log(`[ExcelBM2] Col 6 (Descripción): ${row.getCell(6).value}`);
      
      console.log(`[ExcelBM2] Tipo actual para asignación de celda: ${tipo}, Valor del activo: ${asset.valor}`);
      if (tipo === 'incorporacion') {
        const incorpCell = row.getCell(8); // Columna G (Incorporaciones Bs.)
        incorpCell.value = Number(asset.valor) || 0;
        incorpCell.numFmt = '#,##0.00'; // Formato numérico con dos decimales
        console.log(`[ExcelBM2] Asignando a Incorporaciones (Col 8): ${incorpCell.value}`);
        row.getCell(9).value = ""; // Columna H (Desincorporaciones Bs.)
      } else { // tipo === 'desincorporacion'
        row.getCell(8).value = ""; // Columna G (Incorporaciones Bs.)
        const desincorpCell = row.getCell(9); // Columna H (Desincorporaciones Bs.)
        desincorpCell.value = Number(asset.valor) || 0;
        desincorpCell.numFmt = '#,##0.00'; // Formato numérico con dos decimales
        console.log(`[ExcelBM2] Asignando a Desincorporaciones (Col 9): ${desincorpCell.value}`);
      }
      row.commit();
    });

    // Borra filas sobrantes si hay menos de 13 bienes
    for (let idx = bienesPagina.length; idx < BIENES_POR_PAGINA; idx++) {
      const row = ws.getRow(startRow + idx);
      for (let col = 1; col <= 9; col++) row.getCell(col).value = "";
      row.commit();
    }
  }

  // Guardar el único archivo generado al final
  const nombreArchivo = `BM2_${tipo === 'incorporacion' ? 'Incorporaciones' : 'Desincorporaciones'}_${departamentoNombre}_${mes}-${año}.xlsx`;
  const rutaArchivo = path.join(outputPath, nombreArchivo);

  // Guardar el workbook en un buffer y luego escribir el buffer al archivo
  const buffer = await workbook.xlsx.writeBuffer();
  // @ts-ignore
  fs.writeFileSync(rutaArchivo, buffer);

  console.log(`[ExcelBM2] Archivo final generado: ${rutaArchivo}`);
  generatedFilePaths.push(rutaArchivo);

  console.log(`[ExcelBM2] Finished generating files. Total generated: ${generatedFilePaths.length}`);
  return generatedFilePaths;
}
