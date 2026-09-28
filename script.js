/* =========================================================
   BOLETIM DIGITAL — script.js
   Responsável por: normalizar notas, calcular médias,
   somar faltas, definir situação e preencher a tela.
   ========================================================= */

/* ---------------------------------------------------------
   1) DADOS BRUTOS (fictícios)
   Cada item é um OBJETO com informações de uma disciplina.
   O conjunto todo é um ARRAY (lista).
   --------------------------------------------------------- */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

/* Média mínima de referência */
const MEDIA_MINIMA = 6.0;

/* ---------------------------------------------------------
   2) FUNÇÃO normalizarNota(valor)
   Coloca qualquer nota na escala 0–10, seguindo as regras.
   Retorna null quando a nota ainda não foi lançada
   ou quando o valor é inválido.
   --------------------------------------------------------- */
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto e tenta converter
  let numero = valor;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  }

  // Se não virou um número válido, trata como inválido
  if (isNaN(numero)) {
    return null;
  }

  // Regra: entre 0 e 10, fica igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Regra: maior que 10 e até 100, divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras → inválido
  return null;
}

/* ---------------------------------------------------------
   3) FUNÇÃO calcularMedia(notas)
   Recebe um array com as notas JÁ normalizadas (ou null).
   Ignora as null e calcula a média apenas com as válidas.
   --------------------------------------------------------- */
function calcularMedia(notas) {
  // Filtra somente os números válidos (não null)
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  // Se não houver nenhuma nota válida, retorna null
  if (validas.length === 0) {
    return null;
  }

  // Soma todas e divide pela quantidade de válidas
  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

/* ---------------------------------------------------------
   4) FUNÇÃO definirSituacao(media)
   Retorna o texto da situação conforme a média disponível.
   --------------------------------------------------------- */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* ---------------------------------------------------------
   5) FUNÇÃO formatarNota(nota)
   Mostra a nota com uma casa decimal ou "Ainda não lançada".
   --------------------------------------------------------- */
function formatarNota(nota) {
  if (nota === null) {
    return "Ainda não lançada";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* ---------------------------------------------------------
   6) PROCESSAR DADOS
   Percorre cada disciplina, normaliza as notas,
   calcula média, soma faltas e define situação.
   --------------------------------------------------------- */
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Média usando apenas as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // Soma as faltas dos três trimestres
  const totalFaltas = item.faltas.reduce(function (soma, f) {
    return soma + f;
  }, 0);

  // Retorna um novo objeto já processado
  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: definirSituacao(media)
  };
});

/* ---------------------------------------------------------
   7) PREENCHER A TABELA
   Usa o DOM para criar as linhas dentro do <tbody id="corpoTabela">.
   --------------------------------------------------------- */
function preencherTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = ""; // limpa antes de preencher

  disciplinasProcessadas.forEach(function (d) {
    // Cria uma linha <tr>
    const linha = document.createElement("tr");

    // Define a classe da situação para colorir
    let classeSituacao = "situacao-sem-nota";
    if (d.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (d.situacao === "Atenção") classeSituacao = "situacao-atencao";

    // Monta o conteúdo da linha
    linha.innerHTML = `
      <td>${d.disciplina}</td>
      <td>${formatarNota(d.tri1)}</td>
      <td>${formatarNota(d.tri2)}</td>
      <td>${formatarNota(d.tri3)}</td>
      <td><strong>${formatarNota(d.media)}</strong></td>
      <td>${d.faltas}</td>
      <td class="${classeSituacao}">${d.situacao}</td>
    `;

    corpo.appendChild(linha);
  });
}

/* ---------------------------------------------------------
   8) CRIAR OS CARDS DE RESUMO
   Calcula os totais e insere os cards no <section id="cardsResumo">.
   --------------------------------------------------------- */
function criarCards() {
  const container = document.getElementById("cardsResumo");

  // --- Média geral: média das médias disponíveis ---
  const mediasDisponiveis = disciplinasProcessadas
    .map(function (d) { return d.media; })
    .filter(function (m) { return m !== null; });

  let mediaGeral = null;
  if (mediasDisponiveis.length > 0) {
    let soma = 0;
    mediasDisponiveis.forEach(function (m) { soma += m; });
    mediaGeral = soma / mediasDisponiveis.length;
  }

  // --- Total de faltas ---
  let totalFaltas = 0;
  disciplinasProcessadas.forEach(function (d) { totalFaltas += d.faltas; });

  // --- Disciplinas com bom desempenho e com atenção ---
  const bons = disciplinasProcessadas.filter(function (d) {
    return d.situacao === "Bom desempenho";
  }).length;

  const atencao = disciplinasProcessadas.filter(function (d) {
    return d.situacao === "Atenção";
  }).length;

  // Frequência fictícia/demonstrativa — será tratada de outra forma no futuro.
  const frequenciaDemonstrativa = "92%";

  // Lista de cards (título + valor)
  const cards = [
    { titulo: "Média geral", valor: formatarNota(mediaGeral) },
    { titulo: "Total de faltas", valor: totalFaltas },
    { titulo: "Bom desempenho", valor: bons + " disciplinas" },
    { titulo: "Precisam de atenção", valor: atencao + " disciplinas" },
    { titulo: "Frequência (demonstrativa)", valor: frequenciaDemonstrativa }
  ];

  // Limpa o container e cria cada card
  container.innerHTML = "";
  cards.forEach(function (c) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="titulo-card">${c.titulo}</span>
      <span class="valor-card">${c.valor}</span>
    `;
    container.appendChild(card);
  });
}

/* ---------------------------------------------------------
   9) INICIAR
   Chama as funções quando a página terminar de carregar.
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  criarCards();
  preencherTabela();
});