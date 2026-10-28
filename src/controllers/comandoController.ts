import { Request, Response } from "express";
import { produtos } from "../data/produtos";

const setores = [
  { nome: "Padaria", corredor: 1 },
  { nome: "Mercearia", corredor: 2 },
  { nome: "Laticínios", corredor: 3 },
  { nome: "Açougue", corredor: 4 },
  { nome: "Limpeza", corredor: 5 }
];

function normalizar(texto: string): string {
  return texto.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function criarRota(origem: number, destino: number): string[] {
  if (origem === destino) {
    return [`Você já está no corredor ${destino}.`];
  }

  const passos: string[] = [];

  if (origem === 0) {
    passos.push("Partindo da entrada da loja.");
  } else {
    passos.push(`Partindo do corredor ${origem}.`);
  }

  const direcao = destino > origem ? 1 : -1;

  for (
    let corredor = origem + direcao;
    direcao > 0 ? corredor <= destino : corredor >= destino;
    corredor += direcao
  ) {
    passos.push(`Próximo ponto da simulação: corredor ${corredor}.`);
  }

  passos.push(`Destino: corredor ${destino}.`);

  return passos;
}

export function processarComando(req: Request, res: Response) {
  const comando = normalizar(String(req.body.comando || "").trim());

  const origemRecebida = Number(req.body.corredorAtual);
  const corredorAtual =
    Number.isInteger(origemRecebida) &&
    origemRecebida >= 0 &&
    origemRecebida <= 5
      ? origemRecebida
      : 0;

  if (!comando) {
    return res.status(400).json({
      resposta: "Não recebi nenhum comando."
    });
  }

  if (comando.includes("onde estou")) {
    return res.json({
      tipo: "localizacao",
      resposta: corredorAtual === 0
        ? "Na simulação, sua posição está marcada na entrada."
        : `Na simulação, sua posição está marcada no corredor ${corredorAtual}.`
    });
  }

  if (comando.includes("minha frente")) {
    return res.json({
      tipo: "ambiente",
      resposta:
        "Ainda não consigo detectar objetos ou obstáculos à sua frente. Posso informar os setores cadastrados no mapa demonstrativo."
    });
  }

  const produto = produtos.find(item =>
    comando.includes(normalizar(item.nome))
  );

  const setor = setores.find(item =>
    comando.includes(normalizar(item.nome))
  );

  const destino = produto?.corredor ?? setor?.corredor;

  if (destino !== undefined) {
    const nomeDestino = produto?.nome ?? setor?.nome ?? "Destino";
    const rota = criarRota(corredorAtual, destino);

    const descricao = produto
      ? `${produto.nome} está cadastrado no setor de ${produto.setor}, corredor ${produto.corredor}, ${produto.posicao}.`
      : `O setor de ${setor?.nome} está cadastrado no corredor ${destino}.`;

    return res.json({
      tipo: "rota",
      destino: nomeDestino,
      corredor: destino,
      rota,
      resposta: `${descricao} Vou apresentar uma rota simulada. ${rota.join(" ")}`
    });
  }

  return res.json({
    tipo: "nao_encontrado",
    resposta:
      "Não encontrei esse produto ou setor. Tente dizer leite, arroz, padaria ou limpeza."
  });
}