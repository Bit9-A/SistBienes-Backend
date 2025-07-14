import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { missingGoodsModel } from "../modules/missing-goods/missing-goods.model";
import { UserModel } from "../modules/users/user.model"; // Asumiendo que existe o se creará

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exporta un bien faltante específico a un archivo Excel usando una plantilla BM3.
 * @param missingGoodsId ID del bien faltante.
 * @param responsableId ID del usuario responsable (logeado).
 * @param outputPath Ruta donde se guardará el archivo generado.
 */
export async function exportBM3ByMissingGoodsId(
  missingGoodsId: number,
  responsableId: number,
  outputPath: string
): Promise<string[]> {
  let missingAsset: any = null;
  let departamentoNombre: string = "";
  let responsableNombre: string = "";
  let responsableRol: string = "";
  let responsableDepartamento: string = "";
  let jefeNombre: string = ""; // Nuevo: para el nombre del jefe

  // 1. Obtener datos del bien faltante específico
  missingAsset = await missingGoodsModel.getMissingGoodsByIdWithDetails(missingGoodsId);
  if (!missingAsset) {
    console.log(`[ExcelBM3] No se encontró el bien faltante con ID: ${missingGoodsId}`);
    return [];
  }
  console.log(`[ExcelBM3] Retrieved missing asset with ID ${missingGoodsId}.`);

  // 2. Obtener datos del responsable y su departamento
  const responsableData = await UserModel.getUserDetailsById(responsableId);
  if (responsableData) {
    responsableNombre = `${responsableData.nombre} ${responsableData.apellido}`;
    responsableRol = responsableData.rol_nombre || "N/A";
    responsableDepartamento = responsableData.dept_nombre || "N/A";
  }

  // 3. Obtener datos del jefe de departamento
  if (missingAsset.dept_id) { // Usar missingAsset.unidad que se mapea a dept_id
    const jefeData = await UserModel.getUserByDeptJefe(missingAsset.dept_id);
    if (jefeData) {
      jefeNombre = jefeData.nombre || "N/A";
    }
  }

  // Obtener el nombre del departamento del bien faltante
  departamentoNombre = missingAsset.departamento || "Departamento Desconocido";


  const PARROQUIA = "Tariba"; // Asumiendo que es fijo o se obtiene de otro lado
  const FECHA = new Date().toLocaleDateString("es-VE");
  const BIENES_POR_PAGINA = 6; // Ajustar según la plantilla BM3
  const totalPaginas = 1; // Siempre será 1 página para un solo bien
  console.log(`[ExcelBM3] Total pages to generate: ${totalPaginas}`);

  // Ruta absoluta a la plantilla
  const plantillaPath = path.resolve(__dirname, "../../plantillas/plantilla-bm3.xlsx");
  console.log(`[ExcelBM3] Template path: ${plantillaPath}`);
  const plantillaBuffer = fs.readFileSync(plantillaPath);
  const generatedFilePaths: string[] = [];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(plantillaBuffer as any);

  // Cargar imágenes una sola vez para el workbook (si aplica, como en BM2)
  const escudoPath = path.resolve(__dirname, "../../images/Escudo.jpg");
  const logoImpresionPath = path.resolve(__dirname, "../../images/LogoImpresion.jpg");
  const redesPath = path.resolve(__dirname, "../../images/Redes.png");

  const escudoImageId = workbook.addImage({ filename: escudoPath, extension: 'jpeg' });
  const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: 'jpeg' });
  const redesImageId = workbook.addImage({ filename: redesPath, extension: 'png' });

  const addImagesToWorksheet = (targetWs: ExcelJS.Worksheet) => {
    targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.2 }, ext: { width: 150, height: 50 } });
    targetWs.addImage(escudoImageId, { tl: { col: 8.8, row: 0.1 }, ext: { width: 70, height: 70 } });
    targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 25 }, ext: { width: 120, height: 40 } });
  };

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
    // No establecer G1 aquí, se hará después de los reemplazos generales
  };

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    let ws: ExcelJS.Worksheet;
    if (pagina === 0) {
      ws = workbook.worksheets[0];
      ws.name = `BM3 - Pagina 1`;
      addImagesToWorksheet(ws);
      // No establecer G1 aquí, se hará después de los reemplazos generales
    } else {
      ws = workbook.addWorksheet(`BM3 - Pagina ${pagina + 1}`);
      copyTemplateContent(workbook.worksheets[0], ws);
      addImagesToWorksheet(ws);
    }
    console.log(`[ExcelBM3] Processing page ${pagina + 1} of ${totalPaginas}`);

    // Reemplazar marcadores en las celdas
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === "string") {
          cell.value = cell.value
            .replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "")
            .replace(/{{PARROQUIA}}/g, PARROQUIA)
            .replace(/{{FECHA}}/g, FECHA)
            .replace(/{{PAGINAN}}/g, String(pagina + 1)) // Corregido: reemplazar solo el número de página actual
            .replace(/{{TOTALN}}/g, String(totalPaginas)) // Corregido: reemplazar solo el número total de páginas
            .replace(/{{RESPONSABLE}}/g, responsableNombre || "")
            .replace(/{{ROL}}/g, responsableRol || "")
            .replace(/{{DEPARTAMENTORESPONSABLE}}/g, responsableDepartamento || "")
            .replace(/{{JEFE}}/g, jefeNombre || "")
            .replace(/{{OBSERVACIONES}}/g, missingAsset.observaciones || "");
        }
      });
    });

    // Establecer el valor de I5
    ws.getCell('I5').value = `Hoja N° : ${pagina + 1}/${totalPaginas}`;

    // Insertar los bienes en la tabla (ajusta la fila de inicio según tu plantilla)
    const startRow = 14; // Fila de inicio de la tabla en plantilla-bm3.xlsx
    const asset = missingAsset; // Solo hay un activo para procesar
    const row = ws.getRow(startRow); // Siempre la primera fila de la tabla

    row.getCell(1).value = asset.grupo || "02"; // Columna A (Grupo)
    row.getCell(2).value = asset.subgrupo_codigo || ""; // Columna B (Sub-Grupo)
    row.getCell(3).value = ""; // Columna C (Sección - no disponible en missing-goods)
    row.getCell(4).value = asset.numero_identificacion || ""; // Columna D (Número de Identificación)
    row.getCell(5).value = asset.cantidad || 0; // Columna E (Cantidad)
    
    const descripcion = [ // Columna F (Descripción de los Bienes)
      asset.bien_nombre,
      asset.numero_serial || "",
      asset.marca_nombre,
      asset.modelo_nombre,
      asset.estado_nombre,
    ].filter(Boolean).join(' ') || "";
    row.getCell(6).value = descripcion;

    row.getCell(7).value = asset.existencias || 0; // Columna G (Existencia Física)
    row.getCell(9).value = asset.cantidad || 0; // Columna H (Registros Contables - asumiendo que es la cantidad registrada)
    
    row.getCell(10).value = asset.valor_unitario || 0; // Columna I (Valor Unitario)
    row.getCell(10).numFmt = '#,##0.00';

    row.getCell(11).value = asset.diferencia_valor || 0; // Columna J (Diferencia Cantidad Valor Total)
    row.getCell(11).numFmt = '#,##0.00';

    row.commit();

    // Borra filas sobrantes (todas excepto la primera fila de datos)
    for (let idx = 1; idx < BIENES_POR_PAGINA; idx++) {
      const emptyRow = ws.getRow(startRow + idx);
      for (let col = 1; col <= 10; col++) emptyRow.getCell(col).value = "";
      emptyRow.commit();
    }
  }

  // Guardar el único archivo generado al final
  const nombreArchivo = `BM3_BienesFaltantes_${departamentoNombre}_${FECHA.replace(/\//g, '-')}.xlsx`;
  const rutaArchivo = path.join(outputPath, nombreArchivo);

  const buffer = await workbook.xlsx.writeBuffer();
  // @ts-ignore
  fs.writeFileSync(rutaArchivo, buffer);

  console.log(`[ExcelBM3] Archivo final generado: ${rutaArchivo}`);
  generatedFilePaths.push(rutaArchivo);

  console.log(`[ExcelBM3] Finished generating files. Total generated: ${generatedFilePaths.length}`);
  return generatedFilePaths;
}
