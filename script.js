// ===== ELEMENTOS PRINCIPAIS =====
const input = document.getElementById("command");
const output = document.getElementById("output");


input.addEventListener("input", () => {
  if (input.innerHTML === "<br>") {
    input.innerHTML = "";
  }
});

input.addEventListener("focus", () => {
  if (input.innerHTML === "<br>") {
    input.innerHTML = "";
  }
});


// ===== ESTADO =====
let historico = [];
let indiceHistorico = 0;
let processando = false;
let modoAtual = "AUTO";
``

// ===== EXIBIÇÃO =====

function mostrarLogoPre(logoTexto) {
  const pre = document.createElement("pre");
  pre.textContent = logoTexto;

  output.appendChild(pre);
  output.scrollTop = output.scrollHeight;
}

function alterarModo(novoModo) {
  modoAtual = novoModo;

  const el = document.getElementById("mode");
  if (el) {
    el.textContent = "MODE: " + novoModo;
  }

  // fecha menu automaticamente
  document.getElementById("menuModo").classList.add("hidden");
}
``
function abrirUpload() {
  document.getElementById("fileInput").click();
}

let arquivoAtual = null;

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    arquivoAtual = file;

    adicionarLinha(`[FILE] Arquivo carregado: ${file.name}`);
  }
});

function toggleMenu() {
  const menu = document.getElementById("menuModo");

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
}
``

function adicionarLinhaDigitando(texto, velocidade = 25) {
  const linha = document.createElement("div");
  output.appendChild(linha);

  let i = 0;

  function digitar() {
    if (i < texto.length) {
      linha.textContent += texto.charAt(i);
      i++;
      output.scrollTop = output.scrollHeight;
      setTimeout(digitar, velocidade);
    }
  }

  digitar();
}

const adicionarLinha = adicionarLinhaDigitando;

function limparTerminal() {
  output.innerHTML = "";
}

function bloquearInput() {
  processando = true;
  input.contentEditable = "false";
  input.style.opacity = "0.5";
}

function liberarInput() {
  processando = false;
  input.contentEditable = "true";
  input.style.opacity = "1";
  input.focus();
  moverCursorFinal();
}

function moverCursorFinal() {
  const range = document.createRange();
  const sel = window.getSelection();

  range.selectNodeContents(input);
  range.collapse(false);

  sel.removeAllRanges();
  sel.addRange(range);
}

// ===== BOOT =====
function bootSistema() {
  bloquearInput();

  const linhas = [
    "[BOOT] Inicializando núcleo...",
    "[OK] Módulos carregados",
    "[API] Conectada...",
    "[SYNC] Sincronização concluída",
    "[READY] Sistema operacional ativo",
    "[SOBRE] about: cupinxa"
  ];

  let i = 0;

  function proximaLinha() {
    if (i < linhas.length) {
      adicionarLinhaDigitando(linhas[i]);
      i++;
      setTimeout(proximaLinha, 700);
    } else {
      liberarInput();
    }
  }

  proximaLinha();
}

// ===== ANIMAÇÃO DE PROCESSAMENTO =====
function animarProcessando(callback) {
  const linha = document.createElement("div");
  output.appendChild(linha);

  let pontos = 0;

  const intervalo = setInterval(() => {
    pontos = (pontos + 1) % 4;
    linha.textContent = "[PROCESSANDO" + ".".repeat(pontos) + "]";
    output.scrollTop = output.scrollHeight;
  }, 400);

  setTimeout(() => {
    clearInterval(intervalo);
    linha.textContent = "[PROCESSAMENTO CONCLUÍDO]";
    output.scrollTop = output.scrollHeight;

    if (typeof callback === "function") {
      callback();
    }
  }, 3000);
}

function mostrarAboutCupinxa() {

  const logo = `
                                               ██╗     
   ██████╗ ██╗   ██╗██████╗ ██╗███╗   ██╗██╗  ██╔╝ █████╗
  ██╔════╝ ██║   ██║██╔══██╗██║████╗  ██║╚██╗██╔╝██╔══██║
  ██║      ██║   ██║██████╔╝██║██╔██╗ ██║ ╚███╔╝ ███████║
  ██║      ██║   ██║██╔═══╝ ██║██║╚██╗██║ ██╔██╗ ██╔══██║
  ╚██████╗ ╚██████╔╝██║     ██║██║ ╚████║██╔╝ ██╗██║  ██║
   ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══██╔╝  ╚═╝╚═╝  ╚═╝
                                       ██╔╝
                                       ╚═╝       1.0 
  `;

  const info = `
CUPINXA SYSTEM v1.0
────────────────────────────
IDEIA: Terminal Hacker
Arquitetura: Casca + IA externa

STATUS: OPERACIONAL
IA CORE: OpenAI
AUTOR: EDER LEITÃO
PROJETO: CUPINXA
CONTATO: eder.sl.1993@gmail.com
`;

  // mostra logo (com pre)
  mostrarLogoPre(logo);

  // mostra info normal (linha a linha)
  info.split("\n").forEach(linha => {
    adicionarLinha(linha);
  });
}

// ===== PONTE PARA IA REAL =====

async function consultarIA(pergunta) {

  const response = await fetch("https://cupinxa-backend.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pergunta: pergunta
    })
  });

  const data = await response.json();

  return data.resposta;
}

// ===== PROCESSAMENTO DE COMANDOS =====
async function processarComando(cmd) {
  const comando = cmd.trim();
  
  if (comando === "about: cupinxa") {
  mostrarAboutCupinxa();
  return;
}

  if (!comando) {
    return;
  }


  if (comando === "status") {
    adicionarLinha("[OK] Cupinxa online");
    adicionarLinha("[OK] Interface pronta");
    adicionarLinha("[INFO] IA de fundo: não conectada");
    return;
  }


  bloquearInput();

  animarProcessando(async () => {
    try {
      const respostaIA = await consultarIA(comando);
      adicionarLinha(respostaIA);
    } catch (erro) {
      adicionarLinha("[INFO] Nenhuma resposta local será gerada.");
      adicionarLinha("[ERRO] IA de fundo ainda não integrada.");
    } finally {
      liberarInput();
    }
  });
}

// ===== EVENTOS =====
input.addEventListener("keydown", async function (e) {
  if (processando) {
    e.preventDefault();
    return;
  }
  
  if (e.key === "F1") alterarModo("AUTO");
  if (e.key === "F2") alterarModo("FAST");
  if (e.key === "F3") alterarModo("DEEP");

  if (e.key === "Enter") {
    e.preventDefault();

    const comando = input.innerText.replace(/\n/g, "").trim();

    if (comando !== "") {
      historico.push(comando);
      indiceHistorico = historico.length;
    }

    adicionarLinha("> " + comando);
    input.innerHTML = "";

    await processarComando(comando);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();

    if (indiceHistorico > 0) {
      indiceHistorico--;
      input.innerText = historico[indiceHistorico];
      moverCursorFinal();
    }
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();

    if (indiceHistorico < historico.length - 1) {
      indiceHistorico++;
      input.innerText = historico[indiceHistorico];
    } else {
      indiceHistorico = historico.length;
      input.innerText = "";
    }

    moverCursorFinal();
  }
});

// ===== INICIALIZAÇÃO =====
window.onload = () => {
  input.focus();
  moverCursorFinal();
  bootSistema();
};
