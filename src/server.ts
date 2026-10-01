import express from "express";
import path from "path";

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
    res.json({
        status: "online",
        mensagem: "Supermercado Acessível funcionando!"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});