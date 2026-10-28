import { Produto } from "../types/Produto";

export const produtos: Produto[] = [
  { id: 1, nome: "Leite", setor: "Laticínios", corredor: 3, posicao: "Prateleira A" },
  { id: 2, nome: "Queijo", setor: "Laticínios", corredor: 3, posicao: "Prateleira B" },
  { id: 3, nome: "Iogurte", setor: "Laticínios", corredor: 3, posicao: "Prateleira C" },
  { id: 4, nome: "Arroz", setor: "Mercearia", corredor: 2, posicao: "Prateleira A" },
  { id: 5, nome: "Feijão", setor: "Mercearia", corredor: 2, posicao: "Prateleira B" },
  { id: 6, nome: "Macarrão", setor: "Mercearia", corredor: 2, posicao: "Prateleira C" },
  { id: 7, nome: "Sabão", setor: "Limpeza", corredor: 5, posicao: "Prateleira A" },
  { id: 8, nome: "Detergente", setor: "Limpeza", corredor: 5, posicao: "Prateleira B" },
  { id: 9, nome: "Pão", setor: "Padaria", corredor: 1, posicao: "Balcão principal" },
  { id: 10, nome: "Carne", setor: "Açougue", corredor: 4, posicao: "Balcão de atendimento" }
];