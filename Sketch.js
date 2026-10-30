

/* MISSÃO AURA */

/* VARIÁVEIS */

let nome_info;
let nascimento_info;
let idade_calculada;
let perfis_empatados = [];

/* PERFIS */

const perfis = [
  {
    id: 1,
    nome: "Engenheiro de Sistemas",
    categoria: "Construção",
    descricao: "Gosta de construir e resolver problemas.",
    imagem: "imgs/engesp.jpg",
    recomendacao: "Construir, consertar equipamentos e resolver falhas da nave."
  },
  {
    id: 2,
    nome: "Cientista Explorador",
    categoria: "Investigação",
    descricao: "Gosta de pesquisar e fazer descobertas.",
    imagem: "imgs/cien.jpg",
    recomendacao: "Investigar o planeta, pesquisar e descobrir coisas novas."
  },
  {
    id: 3,
    nome: "Explorador de Campo",
    categoria: "Exploração",
    descricao: "Gosta de conhecer lugares novos.",
    imagem: "imgs/expcamp.jpg",
    recomendacao: "Explorar lugares desconhecidos e encontrar novos recursos."
  },
  {
    id: 4,
    nome: "Estrategista da Missão",
    categoria: "Planejamento",
    descricao: "Gosta de organizar e tomar decisões.",
    imagem: "imgs/est.jpg",
    recomendacao: "Organizar a equipe e planejar as etapas da missão."
  }
];

/* ELEMENTOS DO HTML */

const formulario = document.getElementById("formulario");
const desempate = document.getElementById("desempate");
const resultado = document.getElementById("resultado");

const pergunta_desempate =
  document.getElementById("pergunta_desempate");

const opcoes_desempate =
  document.getElementById("opcoes_desempate");

const botao_desempate =
  document.getElementById("botao_desempate");

const msg = document.getElementById("msg");

/* CALCULAR IDADE */

function calcular_idade(data) {
  const nascimento = new Date(data + "T00:00:00");
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mes = hoje.getMonth() - nascimento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade;
}

/* MOSTRAR O PERFIL FINAL */

function mostrar_perfil(perfil) {
  document.getElementById("saudacao").textContent =
    "Parabéns, " + nome_info + "!";

  const imagem = document.getElementById("imagem_perfil");

  imagem.src = perfil.imagem;
  imagem.alt = perfil.nome;

  document.getElementById("nome_perfil").textContent =
    perfil.nome;

  document.getElementById("categoria_perfil").textContent =
    "Categoria: " + perfil.categoria;

  document.getElementById("idade_perfil").textContent =
    "Idade: " + idade_calculada + " anos";

  document.getElementById("descricao_perfil").textContent =
    perfil.descricao;

  document.getElementById("recomendacao_perfil").textContent =
    "Sua função na missão: " + perfil.recomendacao;

  formulario.hidden = true;
  desempate.hidden = true;
  resultado.hidden = false;

  msg.textContent = "";
}

/* ENVIAR O FORMULÁRIO */

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  msg.textContent = "";

  nome_info = document.getElementById("nome").value.trim();
  nascimento_info = document.getElementById("nascimento").value;

  if (nome_info === "") {
    msg.textContent = "Digite seu nome!";
    return;
  }

  if (nascimento_info === "") {
    msg.textContent = "Informe sua data de nascimento!";
    return;
  }

  const data_nascimento =
    new Date(nascimento_info + "T00:00:00");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (data_nascimento > hoje) {
    msg.textContent =
      "A data de nascimento não pode ser futura!";
    return;
  }

  idade_calculada = calcular_idade(nascimento_info);

  if (idade_calculada > 120) {
    msg.textContent =
      "Confira a data de nascimento informada!";
    return;
  }

  /* CONTAR OS PONTOS DE CADA PERFIL */

  let pontos = [0, 0, 0, 0];

  for (let i = 1; i <= 4; i++) {
    const resposta = document.querySelector(
      'input[name="p' + i + '"]:checked'
    );

    if (resposta === null) {
      msg.textContent =
        "Responda todas as perguntas!";
      return;
    }

    const perfil_escolhido = Number(resposta.value);

    pontos[perfil_escolhido - 1]++;
  }

  /* DESCOBRIR A MAIOR PONTUAÇÃO */

  const maior_pontuacao = Math.max(...pontos);

  perfis_empatados = [];

  for (let i = 0; i < perfis.length; i++) {
    if (pontos[i] === maior_pontuacao) {
      perfis_empatados.push(perfis[i]);
    }
  }

  /* SE HOUVER EMPATE, FAZER OUTRA PERGUNTA */

  if (perfis_empatados.length > 1) {
    mostrar_desempate();
  } else {
    mostrar_perfil(perfis_empatados[0]);
  }
});

/* PERGUNTA DE DESEMPATE */

function mostrar_desempate() {
  formulario.hidden = true;
  resultado.hidden = true;
  desempate.hidden = false;

  msg.textContent = "";

  pergunta_desempate.textContent =
    "Qual dessas tarefas você mais gostaria de realizar na missão?";

  opcoes_desempate.innerHTML = "";

  for (let i = 0; i < perfis_empatados.length; i++) {
    const perfil = perfis_empatados[i];

    const label = document.createElement("label");
    label.className = "opcao";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "resposta_desempate";
    radio.value = perfil.id;

    const texto = document.createTextNode(
      perfil.recomendacao
    );

    label.appendChild(radio);
    label.appendChild(texto);

    opcoes_desempate.appendChild(label);
  }
}

/* CONFIRMAR O DESEMPATE */

botao_desempate.addEventListener("click", function() {
  const resposta = document.querySelector(
    'input[name="resposta_desempate"]:checked'
  );

  if (resposta === null) {
    msg.textContent =
      "Escolha uma opção para desempatar!";
    return;
  }

  const id_escolhido = Number(resposta.value);
  let perfil_final = null;

  for (let i = 0; i < perfis_empatados.length; i++) {
    if (perfis_empatados[i].id === id_escolhido) {
      perfil_final = perfis_empatados[i];
      break;
    }
  }

  if (perfil_final !== null) {
    mostrar_perfil(perfil_final);
  }
});

/* REFAZER O TESTE */

document.getElementById("refazer").addEventListener("click", function() {
  formulario.reset();

  perfis_empatados = [];
  idade_calculada = null;

  resultado.hidden = true;
  desempate.hidden = true;
  formulario.hidden = false;

  opcoes_desempate.innerHTML = "";
  msg.textContent = "";

  // Não usar window.scrollTo: evita forçar a página a voltar ao topo.
});
