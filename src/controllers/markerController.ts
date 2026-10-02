import { Request, Response } from 'express';
import { produtos, mapa } from '../data/produtos.js'; // Adicionado .js no final


export const buscarProduto = (req: Request, res: Response): any => {
  const { nome } = req.query;
  
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ erro: 'O parâmetro nome é obrigatório' });
  }

  const termoBusca = nome.toLowerCase();
  const produto = produtos.find(p => p.nome === termoBusca || p.sinonimos.includes(termoBusca));
  
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }
  
  return res.json(produto);
};

export const calcularRota = (req: Request, res: Response): any => {
  const { de, para } = req.query;

  if (!de || !para || typeof de !== 'string' || typeof para !== 'string') {
    return res.status(400).json({ erro: 'Os parâmetros de e para são obrigatórios' });
  }

  // Busca em Largura (BFS) no grafo para achar o caminho mais curto
  let fila: string[][] = [[de]];
  let visitados = new Set<string>([de]);

  while (fila.length > 0) {
    let caminho = fila.shift() || [];
    let noAtual = caminho[caminho.length - 1];

    if (noAtual === para) {
      let instrucoes: string[] = [];
      for (let i = 0; i < caminho.length - 1; i++) {
        const ligacao = mapa.ligacoes.find(l => l.de === caminho[i] && l.para === caminho[i+1]);
        if (ligacao) instrucoes.push(ligacao.instrucao);
      }
      return res.json({ caminho, instrucoes });
    }

    const vizinhos = mapa.ligacoes.filter(l => l.de === noAtual).map(l => l.para);
    for (let vizinho of vizinhos) {
      if (!visitados.has(vizinho)) {
        visitados.add(vizinho);
        fila.push([...caminho, vizinho]);
      }
    }
  }

  return res.status(404).json({ erro: 'Rota não encontrada' });
};
