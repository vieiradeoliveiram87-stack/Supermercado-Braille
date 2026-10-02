// Ativa o sintetizador de voz do celular
function falar(texto) {
    const regiaoTexto = document.getElementById('status-voz');
    if (regiaoTexto) {
      regiaoTexto.innerText = texto;
    }
    
    // Cancela áudios anteriores para não encavalar as falas
    window.speechSynthesis.cancel();
    
    const mensagem = new SpeechSynthesisUtterance(texto);
    mensagem.lang = 'pt-BR';
    window.speechSynthesis.speak(mensagem);
  }
  
  document.getElementById('btn-buscar').addEventListener('click', () => {
    falar("Procurar produto selecionado. Digite ou use o comando de voz.");
  });
  
  document.getElementById('btn-onde-estou').addEventListener('click', () => {
    falar("Escanear ponto de checagem. A câmera do seu navegador será aberta.");
  });
  
  document.getElementById('btn-ajuda').addEventListener('click', () => {
    falar("Botão de ajuda acionado. Um funcionário do mercado foi notificado e está a caminho.");
  });
  