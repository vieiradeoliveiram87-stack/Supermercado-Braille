let reconhecimentoAtivo = null;

function iniciarReconhecimento() {
  const API =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!API) {
    atualizarStatus(
      "Reconhecimento de voz indisponível neste navegador. Use a busca por texto."
    );
    falar("Não foi possível ativar o microfone neste navegador.");
    return;
  }

  if (reconhecimentoAtivo) {
    reconhecimentoAtivo.abort();
  }

  const reconhecimento = new API();
  reconhecimentoAtivo = reconhecimento;

  reconhecimento.lang = "pt-BR";
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;
  reconhecimento.maxAlternatives = 1;

  const botao = document.getElementById("btnComecar");

  reconhecimento.onstart = () => {
    botao.disabled = true;
    atualizarStatus("Estou ouvindo. Pode falar o produto ou setor.");
  };

  reconhecimento.onresult = (evento) => {
    const comando = evento.results[0][0].transcript;
    atualizarStatus(`Comando reconhecido: ${comando}`);
    enviarComando(comando);
  };

  reconhecimento.onerror = (evento) => {
    const mensagem = evento.error === "not-allowed"
      ? "Permissão do microfone negada. Autorize o acesso nas configurações do navegador."
      : "Não consegui reconhecer sua voz. Tente novamente.";

    atualizarStatus(mensagem);
  };

  reconhecimento.onend = () => {
    botao.disabled = false;
    reconhecimentoAtivo = null;
  };

  try {
    reconhecimento.start();
  } catch (erro) {
    botao.disabled = false;
    atualizarStatus("Não foi possível iniciar o reconhecimento de voz.");
  }
}