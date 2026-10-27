
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import marketRoutes from './routes/marketRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Serve os arquivos do frontend
app.use(express.static(path.join(__dirname, '../public')));

// Ativa as rotas da API
app.use('/api', marketRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor acessível rodando em http://localhost:${PORT}`);
});
