import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { exportBM1ByDepartment } from '../jobs/ExcelBM1';
import { exportBM2ByDepartment } from '../jobs/ExcelBM2'; // Importar la nueva función
import { exportBM3ByMissingGoodsId } from '../jobs/ExcelBM3'; // Importar la nueva función

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Define a temporary directory for generated Excel files
const tempDir = path.join(__dirname, '../../temp_excel_exports');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

router.post('/bm1', async (req: any, res: any) => {
  const { dept_id, dept_nombre } = req.body;

  if (!dept_id || !dept_nombre) {
    return res.status(400).json({ message: 'deptId and departamentoNombre are required.' });
  }

  try {
    const generatedFilePaths = await exportBM1ByDepartment(
      dept_id,
      dept_nombre,
      tempDir
    );

    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: 'No Excel files were generated.' });
    }

    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);

    res.download(filePathToSend, fileName, (err: Error | null) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      generatedFilePaths.forEach(file => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });

  } catch (error: unknown) {
    console.error('Error generating Excel file:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred during Excel file generation.' });
    }
  }
});

// Nueva ruta para generar el BM2 (incorporaciones y desincorporaciones)
router.post('/bm2', async (req: any, res: any) => {
  const { dept_id, dept_nombre, mes, año, tipo } = req.body; // Añadir 'tipo'

  if (!dept_id || !dept_nombre || !mes || !año || !tipo) {
    return res.status(400).json({ message: 'deptId, departamentoNombre, mes, año, and tipo are required.' });
  }

  if (tipo !== 'incorporacion' && tipo !== 'desincorporacion') {
    return res.status(400).json({ message: 'Invalid type. Must be "incorporacion" or "desincorporacion".' });
  }

  try {
    let generatedFilePaths: string[] = [];

    if (tipo === 'incorporacion') {
      generatedFilePaths = await exportBM2ByDepartment(
        dept_id,
        dept_nombre,
        mes,
        año,
        'incorporacion',
        tempDir
      );
    } else if (tipo === 'desincorporacion') {
      generatedFilePaths = await exportBM2ByDepartment(
        dept_id,
        dept_nombre,
        mes,
        año,
        'desincorporacion',
        tempDir
      );
    }

    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: `No Excel files were generated for BM2 type: ${tipo}.` });
    }

    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);

    res.download(filePathToSend, fileName, (err: Error | null) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Limpiar los archivos generados después de enviarlos
      generatedFilePaths.forEach(file => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });

  } catch (error: unknown) {
    console.error('Error generating BM2 Excel file:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error generating BM2 Excel file', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred during BM2 Excel file generation.' });
    }
  }
});

// Nueva ruta para generar el BM3 (bienes faltantes)
router.post('/bm3', async (req: any, res: any) => {
  const { missing_goods_id, responsable_id } = req.body; // Cambiar a missing_goods_id

  if (!missing_goods_id || !responsable_id) {
    return res.status(400).json({ message: 'missing_goods_id and responsable_id are required.' });
  }

  try {
    const generatedFilePaths = await exportBM3ByMissingGoodsId(
      missing_goods_id,
      responsable_id,
      tempDir
    );

    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: `No Excel file was generated for missing goods ID: ${missing_goods_id}.` });
    }

    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);

    res.download(filePathToSend, fileName, (err: Error | null) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      generatedFilePaths.forEach(file => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });

  } catch (error: unknown) {
    console.error('Error generating BM3 Excel file:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error generating BM3 Excel file', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred during BM3 Excel file generation.' });
    }
  }
});

export default router;
