
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
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contemTermo(frase: string, termo: string): boolean {
  const palavras = normalizar(frase).split(" ");
  const termoNormalizado = normalizar(termo);

  return palavras.some(palavra =>
    palavra === termoNormalizado ||
    palavra === `${termoNormalizado}s` ||
    palavra === `${termoNormalizado}es`
  );
}

function criarRota(
  origem: number,
  destino: number
): string[] {
  if (origem === destino) {
    return [
      `Na simulação, você já está no corredor ${destino}.`
    ];
  }

  const passos: string[] = [];

  passos.push(
    origem === 0
      ? "Ponto inicial: entrada do supermercado."
      : `Ponto inicial: corredor ${origem}.`
  );

  const direcao = destino > origem ? 1 : -1;

  for (
    let corredor = origem + direcao;
    direcao > 0
      ? corredor <= destino
      : corredor >= destino;
    corredor += direcao
  ) {
    passos.push(
      `Próximo ponto demonstrativo: corredor ${corredor}.`
    );
  }

  passos.push(
    `Destino demonstrativo: corredor ${destino}.`
  );

  return passos;
}

export function processarComando(
  req: Request,
  res: Response
) {
  const comandoOriginal = req.body?.comando;

  if (
    typeof comandoOriginal !== "string" ||
    !comandoOriginal.trim()
  ) {
    return res.status(400).json({
      tipo: "erro",
      erro: "Informe um produto ou comando válido."
    });
  }

  const comando = normalizar(comandoOriginal);
  const origem = Number(req.body?.corredorAtual);

  const corredorAtual =
    Number.isInteger(origem) &&
    origem >= 0 &&
    origem <= 5
      ? origem
      : 0;

  if (
    comando.includes("onde estou") ||
    comando.includes("minha localizacao") ||
    comando.includes("minha posicao")
  ) {
    return res.json({
      tipo: "localizacao",
      resposta:
        corredorAtual === 0
          ? "Na simulação, sua posição está na entrada."
          : `Na simulação, sua posição está no corredor ${corredorAtual}.`
    });
  }

  if (
    comando.includes("minha frente") ||
    comando.includes("obstaculo")
  ) {
    return res.json({
      tipo: "ambiente",
      resposta:
        "O aplicativo não identifica obstáculos ou objetos em tempo real. O mapa e as orientações são demonstrativos."
    });
  }

  const produto = produtos.find(item =>
    contemTermo(comando, item.nome)
  );

  const setor = setores.find(item =>
    contemTermo(comando, item.nome)
  );

  const destino =
    produto?.corredor ?? setor?.corredor;

  if (destino !== undefined) {
    const nomeDestino =
      produto?.nome ?? setor?.nome ?? "Destino";

    const rota = criarRota(corredorAtual, destino);

    const descricao = produto
      ? `${produto.nome}: setor ${produto.setor}, corredor ${produto.corredor}, ${produto.posicao}.`
      : `Setor ${setor?.nome}: corredor ${destino}.`;

    return res.json({
      tipo: "rota",
      destino: nomeDestino,
      corredor: destino,
      rota,
      resposta:
        `${descricao} Rota demonstrativa: ${rota.join(" ")}`
    });
  }

  return res.json({
    tipo: "nao_encontrado",
    resposta:
      "Produto ou setor não encontrado. Você pode tentar leite, arroz, feijão, pão, limpeza ou padaria."
  });
}
