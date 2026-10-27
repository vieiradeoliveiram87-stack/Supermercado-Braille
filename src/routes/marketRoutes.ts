
import { Router } from 'express';
import {
  buscarProduto,
  calcularRota
} from '../controllers/markerController.js';

const router = Router();

router.get('/produto', buscarProduto);
router.get('/rota', calcularRota);

export default router;
