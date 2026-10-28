import { Router } from "express";
import { processarComando } from "../controllers/comandoController";

const router = Router();

router.post("/", processarComando);

export default router;