import { Router } from "express";
import {
  listarProdutos,
  buscarProduto
} from "../controllers/produtoController";

const router = Router();

router.get("/", listarProdutos);
router.get("/buscar", buscarProduto);

export default router;