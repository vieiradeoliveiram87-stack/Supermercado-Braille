
import express from "express";
import path from "path";

import produtoRoutes from "./routes/produtoRoutes";
import comandoRoutes from "./routes/comandoRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

const pastaPublic = path.resolve(process.cwd(), "public");

app.use(express.static(pastaPublic));

app.use("/api/produtos", produtoRoutes);
app.use("/api/comandos", comandoRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(pastaPublic, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    mensagem: "Supermercado Acessível funcionando!"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando em http://localhost:${PORT}`);
});
