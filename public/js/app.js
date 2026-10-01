const botaoComecar = document.getElementById("btnComecar");
const status = document.getElementById("status");

botaoComecar.addEventListener("click", () => {

    status.textContent =
        "Sistema iniciado. Em breve você poderá usar comandos de voz.";

});