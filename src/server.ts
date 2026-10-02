import express from 'express';
import path from 'path';
import marketRoutes from './routes/marketRoutes';

const app = express();
app.use(express.json());

// Serve a pasta public (frontend) de forma estática
app.use(express.static(path.join(__dirname, '../public')));

// Ativa as rotas da API
app.use('/api', marketRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor acessível rodando em http://localhost:${PORT}`);
});
