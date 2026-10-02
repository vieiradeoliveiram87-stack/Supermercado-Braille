export interface Produto {
    nome: string;
    sinonimos: string[];
    setor: string;
    corredor: string;
    prateleira: string;
    altura: string;
    lado: string;
  }
  
  export const produtos: Produto[] = [
    { 
      nome: "leite", 
      sinonimos: ["leite integral", "leite de caixinha"],
      setor: "laticinios", 
      corredor: "c3", 
      prateleira: "c3-p2",
      altura: "cintura", 
      lado: "esquerda" 
    },
    { 
      nome: "arroz", 
      sinonimos: ["arroz branco"],
      setor: "mercearia", 
      corredor: "c2", 
      prateleira: "c2-p1",
      altura: "ombro", 
      lado: "direita" 
    }
  ];
  
  export const mapa = {
    nos: [
      { id: "entrada", nome: "entrada da loja" },
      { id: "c2", nome: "corredor 2, mercearia" },
      { id: "c3", nome: "corredor 3, laticinios" }
    ],
    ligacoes: [
      { de: "entrada", para: "c2", instrucao: "siga em frente cerca de 10 passos" },
      { de: "c2", para: "c3", instrucao: "vire a direita e siga ate o proximo corredor" }
    ]
  };
  