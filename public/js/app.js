
const statusSistema = document.getElementById("status");
const campoProduto = document.getElementById("campoProduto");
const tituloResposta = document.getElementById("tituloResposta");
const respostaTexto = document.getElementById("respostaTexto");
const listaPassos = document.getElementById("listaPassos");
const corredorAtual = document.getElementById("corredorAtual");

let ultimaResposta = "";
let ultimoComandoDeDestino = "";
let passosDaRota = [];
let passoAtual = 0;
let vozAutomatica = true;

function atualizarStatus(texto) {
  if (statusSistema) {
    statusSistema.textContent = texto;
  }
}

function falarSeAtivado(texto) {
  if (vozAutomatica && typeof falar === "function") {
    falar(texto);
  }
}

function mostrarResposta(titulo, texto, passos = []) {
  tituloResposta.textContent = titulo;
  respostaTexto.textContent = texto;
  listaPassos.replaceChildren();

  passosDaRota = Array.isArray(passos) ? passos : [];
  passoAtual = 0;

  passosDaRota.forEach((passo, indice) => {
    const item = document.createElement("li");
    item.textContent = passo;

    if (indice === 0) {
      item.setAttribute("aria-current", "step");
    }

    listaPassos.appendChild(item);
  });

  ultimaResposta = texto;

  const proximo = document.getElementById("btnProximo");
  if (proximo) {
    proximo.disabled = passosDaRota.length < 2;
  }
}

async function enviarComando(comando) {
  if (!comando || !comando.trim()) {
    atualizarStatus("Digite ou fale o nome de um produto.");
    campoProduto.focus();
    return;
  }

  atualizarStatus("Buscando informações...");

  try {
    const resposta = await fetch("/api/comandos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        comando: comando.trim(),
        corredorAtual: Number(corredorAtual.value)
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.erro ||
        dados.resposta ||
        "Não foi possível realizar a busca."
      );
    }

    if (dados.tipo === "rota") {
      ultimoComandoDeDestino = comando;
    }

    const titulo =
      dados.destino ||
      (dados.tipo === "localizacao"
        ? "Localização demonstrativa"
        : dados.tipo === "ambiente"
          ? "Informações do ambiente"
          : "Resultado da busca");

    mostrarResposta(
      titulo,
      dados.resposta || "Nenhuma resposta disponível.",
      dados.rota || []
    );

    atualizarStatus("Resultado disponível.");
    falarSeAtivado(dados.resposta || "");

    document.getElementById("orientacao")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  } catch (erro) {
    console.error("Erro na busca:", erro);

    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Não foi possível consultar o servidor.";

    mostrarResposta("Erro na busca", mensagem);
    atualizarStatus(mensagem);
  }
}

// Comando de voz
document.getElementById("btnComecar")
  .addEventListener("click", () => {
    if (typeof pararAudio === "function") {
      pararAudio();
    }

    if (typeof iniciarReconhecimento === "function") {
      iniciarReconhecimento();
    } else {
      atualizarStatus(
        "O reconhecimento de voz não está disponível."
      );
    }
  });

// Busca digitada
document.getElementById("formBusca")
  .addEventListener("submit", evento => {
    evento.preventDefault();

    const produto = campoProduto.value.trim();

    if (!produto) {
      atualizarStatus("Digite o nome de um produto.");
      campoProduto.focus();
      return;
    }

    enviarComando(`Quero encontrar ${produto}`);
  });

// Produtos sugeridos
document.querySelectorAll("[data-busca]")
  .forEach(botao => {
    botao.addEventListener("click", () => {
      const produto = botao.dataset.busca;

      campoProduto.value = produto;
      enviarComando(`Quero encontrar ${produto}`);
    });
  });

// Comandos rápidos
document.querySelectorAll("[data-comando]")
  .forEach(botao => {
    botao.addEventListener("click", () => {
      enviarComando(botao.dataset.comando);
    });
  });

// Repetir orientação
document.getElementById("btnRepetir")
  .addEventListener("click", () => {
    if (ultimaResposta) {
      if (typeof falar === "function") {
        falar(ultimaResposta);
      }
    } else {
      atualizarStatus(
        "Ainda não existe uma orientação para repetir."
      );
    }
  });

// Parar áudio
document.getElementById("btnParar")
  .addEventListener("click", () => {
    if (typeof pararAudio === "function") {
      pararAudio();
    }

    atualizarStatus("Áudio interrompido.");
  });

// Próximo passo da rota
document.getElementById("btnProximo")
  ?.addEventListener("click", () => {
    if (passoAtual >= passosDaRota.length - 1) {
      return;
    }

    passoAtual++;

    const texto = passosDaRota[passoAtual];

    listaPassos.querySelectorAll("li")
      .forEach((item, indice) => {
        if (indice === passoAtual) {
          item.setAttribute("aria-current", "step");
        } else {
          item.removeAttribute("aria-current");
        }
      });

    atualizarStatus(
      `Passo ${passoAtual + 1} de ${passosDaRota.length}.`
    );

    ultimaResposta = texto;
    respostaTexto.textContent =
      `${texto} Esta orientação é demonstrativa.`;

    falarSeAtivado(respostaTexto.textContent);

    document.getElementById("btnProximo").disabled =
      passoAtual >= passosDaRota.length - 1;
  });

// Nova busca
document.getElementById("btnNovaBusca")
  ?.addEventListener("click", () => {
    campoProduto.value = "";

    document.getElementById("busca")
      .scrollIntoView({ behavior: "smooth" });

    campoProduto.focus({ preventScroll: true });
  });

// Controle de voz automática
document.getElementById("usarVozApp")
  ?.addEventListener("change", evento => {
    vozAutomatica = evento.target.checked;

    if (!vozAutomatica &&
        typeof pararAudio === "function") {
      pararAudio();
    }

    atualizarStatus(
      vozAutomatica
        ? "Respostas automáticas por voz ativadas."
        : "Respostas automáticas por voz desativadas."
    );
  });

// Alteração da posição simulada
corredorAtual.addEventListener("change", () => {
  const numero = Number(corredorAtual.value);

  const nome =
    typeof obterNomeCorredor === "function"
      ? obterNomeCorredor(numero)
      : `corredor ${numero}`;

  atualizarStatus(
    `Posição demonstrativa alterada para ${nome}.`
  );

  if (ultimoComandoDeDestino) {
    enviarComando(ultimoComandoDeDestino);
  }
});
