const statusSistema = document.getElementById("status");
const campoProduto = document.getElementById("campoProduto");
const tituloResposta = document.getElementById("tituloResposta");
const respostaTexto = document.getElementById("respostaTexto");
const listaPassos = document.getElementById("listaPassos");
const corredorAtual = document.getElementById("corredorAtual");

let ultimaResposta = "";
let ultimoComandoDeDestino = "";

function atualizarStatus(texto) {
  statusSistema.textContent = texto;
}

function mostrarResposta(titulo, texto, passos = []) {
  tituloResposta.textContent = titulo;
  respostaTexto.textContent = texto;

  listaPassos.replaceChildren();

  passos.forEach(passo => {
    const item = document.createElement("li");
    item.textContent = passo;
    listaPassos.appendChild(item);
  });

  ultimaResposta = texto;
}

async function enviarComando(comando) {
  if (!comando || !comando.trim()) {
    atualizarStatus("Informe um produto ou comando.");
    return;
  }

  atualizarStatus("Consultando informações do supermercado...");

  try {
    const resposta = await fetch("/api/comandos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        comando,
        corredorAtual: Number(corredorAtual.value)
      })
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível processar o comando.");
    }

    const dados = await resposta.json();

    if (dados.tipo === "rota") {
      ultimoComandoDeDestino = comando;
    }

    const titulo = dados.destino || (
      dados.tipo === "localizacao" ? "Sua posição simulada" :
      dados.tipo === "ambiente" ? "Informações do ambiente" :
      "Resposta do assistente"
    );

    mostrarResposta(titulo, dados.resposta, dados.rota || []);
    atualizarStatus("Resposta disponível. Você pode ouvir novamente.");
    falar(dados.resposta);

    document.getElementById("orientacao")
      .scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (erro) {
    console.error(erro);

    const mensagem =
      "Não foi possível consultar o sistema. Verifique se o servidor está funcionando.";

    atualizarStatus(mensagem);
    mostrarResposta("Erro de conexão", mensagem);
    falar(mensagem);
  }
}

document.getElementById("btnComecar").addEventListener("click", () => {
  pararAudio();
  iniciarReconhecimento();
});

document.getElementById("formBusca").addEventListener("submit", evento => {
  evento.preventDefault();

  const produto = campoProduto.value.trim();

  if (produto) {
    enviarComando(`Quero encontrar ${produto}`);
  }
});

document.querySelectorAll("[data-busca]").forEach(botao => {
  botao.addEventListener("click", () => {
    const produto = botao.dataset.busca;
    campoProduto.value = produto;
    enviarComando(`Quero encontrar ${produto}`);
  });
});

document.querySelectorAll("[data-comando]").forEach(botao => {
  botao.addEventListener("click", () => {
    enviarComando(botao.dataset.comando);
  });
});

document.getElementById("btnRepetir").addEventListener("click", () => {
  if (ultimaResposta) {
    falar(ultimaResposta);
  } else {
    falar("Ainda não existe uma orientação para repetir.");
  }
});

document.getElementById("btnParar").addEventListener("click", () => {
  pararAudio();
  atualizarStatus("Áudio interrompido.");
});

corredorAtual.addEventListener("change", () => {
  const numero = Number(corredorAtual.value);
  const nome = obterNomeCorredor(numero);

  atualizarStatus(
    `Posição simulada alterada para ${nome}.`
  );

  if (ultimoComandoDeDestino) {
    enviarComando(ultimoComandoDeDestino);
  }
});