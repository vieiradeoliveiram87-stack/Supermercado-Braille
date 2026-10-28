import { Request, Response } from "express";
import { produtos } from "../data/produtos";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Listar todos os produtos
export function listarProdutos(req: Request, res: Response) {
  res.json(produtos);
}

// Buscar produto pelo nome
export function buscarProduto(req: Request, res: Response) {
  const nome = normalizar(String(req.query.nome || "").trim());

  if (!nome) {
    return res.status(400).json({
      erro: "Informe o nome do produto."
    });
  }

  const encontrados = produtos.filter(produto =>
    normalizar(produto.nome).includes(nome)
  );

  res.json(encontrados);
}