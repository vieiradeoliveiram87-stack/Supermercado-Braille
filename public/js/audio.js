function falar(texto, aoTerminar) {
    if (!("speechSynthesis" in window)) {
      document.getElementById("status").textContent =
        "Seu navegador não oferece respostas por voz.";
      if (aoTerminar) aoTerminar();
      return;
    }
  
    window.speechSynthesis.cancel();
  
    const mensagem = new SpeechSynthesisUtterance(texto);
    mensagem.lang = "pt-BR";
    mensagem.rate = 0.88;
    mensagem.pitch = 1;
    mensagem.volume = 1;
  
    mensagem.onend = () => {
      if (aoTerminar) aoTerminar();
    };
  
    mensagem.onerror = () => {
      if (aoTerminar) aoTerminar();
    };
  
    window.speechSynthesis.speak(mensagem);
  }
  
  function pararAudio() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }