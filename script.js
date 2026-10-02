/// Estrutura de dados com Notas e Faltas
const boletim = [
  { disciplina: "Língua Portuguesa", tri1: 7.0, tri2: 7.5, tri3: null, faltas: 5 },
  { disciplina: "Matemática", tri1: 6.5, tri2: 6.0, tri3: null, faltas: 8 },
  { disciplina: "Ciências", tri1: 7.9, tri2: 8.2, tri3: null, faltas: 2 },
  { disciplina: "História", tri1: 9.4, tri2: 10.0, tri3: null, faltas: 2 },
  { disciplina: "Geografia", tri1: 9.0, tri2: 5.5, tri3: null, faltas: 6 },
  { disciplina: "Língua Inglesa", tri1: 7.8, tri2: 6.5, tri3: null, faltas: 7 },
  { disciplina: "Arte", tri1: 6.5, tri2: 7.0, tri3: null, faltas: 1 },
  { disciplina: "Educação Física", tri1: 9.7, tri2: 7.3, tri3: null, faltas: 3 },
  { disciplina: "Educação Digital", tri1: 7.6, tri2: 8.0, tri3: null, faltas: 2 },
  { disciplina: "Educação Financeira", tri1: 7.8, tri2: 7.8, tri3: null, faltas: 8 },
  { disciplina: "Estudo Orientado", tri1: 7.6, tri2: 8.1, tri3: null, faltas: 6 },
  { disciplina: "Redação e Leitura", tri1: 7.1, tri2: 9.0, tri3: null, faltas: 2 },
  { disciplina: "Pensamento Lógico", tri1: 8.2, tri2: 9.1, tri3: null, faltas: 3 },
  { disciplina: "Literatura Arte e Movimento", tri1: 7.7, tri2: 6.2, tri3: null, faltas: 0 },
  { disciplina: "Práticas Experimentais", tri1: 8.8, tri2: 7.8, tri3: null, faltas: 4 }
];

// Função para calcular totais e médias de cada disciplina
function processarBoletim(dados) {
  return dados.map(item => {
    const totalParcial = item.tri1 + item.tri2 + (item.tri3 || 0);
    const trimestresComNota = item.tri3 !== null ? 3 : 2;
    const mediaParcial = totalParcial / trimestresComNota;

    return {
      ...item,
      totalParcial: Number(totalParcial.toFixed(1)),
      mediaParcial: Number(mediaParcial.toFixed(1))
    };
  });
}

// Função para calcular os totais gerais do boletim
function calcularTotaisGerais(dadosProcessados) {
  const totais = dadosProcessados.reduce(
    (acc, curr) => {
      acc.totalTri1 += curr.tri1;
      acc.totalTri2 += curr.tri2;
      acc.totalGeral += curr.totalParcial;
      acc.totalFaltas += curr.faltas;
      return acc;
    },
    { totalTri1: 0, totalTri2: 0, totalGeral: 0, totalFaltas: 0 }
  );

  const mediaGeral = totais.totalGeral / dadosProcessados.length;

  return {
    totalTri1: Number(totais.totalTri1.toFixed(1)),
    totalTri2: Number(totais.totalTri2.toFixed(1)),
    totalGeral: Number(totais.totalGeral.toFixed(1)),
    mediaGeral: Number(mediaGeral.toFixed(1)),
    totalFaltas: totais.totalFaltas
  };
}

// Execução e exibição dos resultados
const boletimProcessado = processarBoletim(boletim);
const resumoGeral = calcularTotaisGerais(boletimProcessado);

console.log("=== BOLETIM ESCOLAR DETALHADO ===");
console.table(boletimProcessado);

console.log("=== RESUMO GERAL ===");
console.log(`Total 1º Tri: ${resumoGeral.totalTri1}`);
console.log(`Total 2º Tri: ${resumoGeral.totalTri2}`);
console.log(`Soma Total das Notas: ${resumoGeral.totalGeral}`);
console.log(`Média Geral de Notas: ${resumoGeral.mediaGeral}`);
console.log(`Total de Faltas no Ano: ${resumoGeral.totalFaltas}`);