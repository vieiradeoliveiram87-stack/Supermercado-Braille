const mapaSupermercado = {
    entrada: 0,
  
    setores: [
      { nome: "Padaria", corredor: 1 },
      { nome: "Mercearia", corredor: 2 },
      { nome: "Laticínios", corredor: 3 },
      { nome: "Açougue", corredor: 4 },
      { nome: "Limpeza", corredor: 5 }
    ]
  };
  
  function obterNomeCorredor(numero) {
    if (numero === 0) return "Entrada";
  
    const setor = mapaSupermercado.setores.find(
      item => item.corredor === numero
    );
  
    return setor ? setor.nome : "Corredor desconhecido";
  }