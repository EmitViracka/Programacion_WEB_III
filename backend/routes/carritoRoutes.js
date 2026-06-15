import express from 'express';
import { generarReporteProductos, obtenerDatosGrafico } from '../controllers/reporteController.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/productos-pdf', verificarToken, verificarAdmin, generarReporteProductos);
router.get('/datos-grafico', verificarToken, obtenerDatosGrafico);

export default router;