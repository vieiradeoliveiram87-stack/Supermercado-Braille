
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let reconhecimento = null;

function iniciarReconhecimento() {
  const status = document.getElementById("status");

  if (!SpeechRecognition) {
    if (status) {
      status.textContent =
        "Seu navegador não suporta reconhecimento de voz.";
    }
    return;
  }

  if (reconhecimento) {
    reconhecimento.abort();
  }

  reconhecimento = new SpeechRecognition();
  reconhecimento.lang = "pt-BR";
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;

  reconhecimento.onstart = () => {
    if (status) status.textContent = "🎙 Estou ouvindo...";
  };

  reconhecimento.onresult = (evento) => {
    const texto = evento.results[0][0].transcript;

    if (status) status.textContent = "Você disse: " + texto;

    const campo = document.getElementById("campoProduto");
    if (campo) campo.value = texto;

    if (typeof enviarComando === "function") {
      enviarComando(texto);
    } else {
      falar("Você disse: " + texto);
    }
  };

  reconhecimento.onerror = (evento) => {
    if (status) {
      status.textContent =
        "Erro no microfone: " + evento.error;
    }
    console.error("Erro de reconhecimento:", evento.error);
  };

  reconhecimento.onend = () => {
    reconhecimento = null;
  };

  try {
    reconhecimento.start();
  } catch (erro) {
    console.error("Não foi possível iniciar o microfone:", erro);
  }
}

function falar(texto) {
  if (!("speechSynthesis" in window)) {
    alert("Seu navegador não suporta reprodução de voz.");
    return;
  }

  speechSynthesis.cancel();

  const mensagem = new SpeechSynthesisUtterance(texto);
  mensagem.lang = "pt-BR";
  mensagem.rate = 0.9;
  mensagem.volume = 1;

  speechSynthesis.speak(mensagem);
}
