const CONFIG_ALUNO = {
    turma: "8C",
    numeroChamada: 36,
    apiUrl: "https://boletim-api.profbt.com.br"
};

let sessaoPin = "";

let dadosBoletim = {
    disciplinas: [
        {
            nome: "Matemática",
            notas: [7.5, 8.0, 8.5],
            faltas: [2, 0, 1]
        },
        {
            nome: "Língua Portuguesa",
            notas: [8.0, 7.5, 9.0],
            faltas: [1, 2, 0]
        },
        {
            nome: "História",
            notas: [9.0, 8.5, 9.5],
            faltas: [0, 1, 0]
        },
        {
            nome: "Geografia",
            notas: [8.5, 8.0, 8.0],
            faltas: [0, 0, 1]
        },
        {
            nome: "Ciências",
            notas: [7.0, 8.5, 8.0],
            faltas: [2, 1, 1]
        }
    ]
};

// ==========================================================================
// VARIÁVEIS GLOBAIS DAS INSTÂNCIAS DOS GRÁFICOS
// ==========================================================================
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

function normalizarNota(val) {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "string") {
        val = val.replace(",", ".");
    }
    let num = parseFloat(val);
    if (isNaN(num)) return null;
    if (num > 10) {
        num = num / 10;
    }
    return num;
}

function calcularMediaDisciplina(notas) {
    let soma = 0;
    let qtd = 0;
    for (let i = 0; i < 3; i++) {
        let n = normalizarNota(notas[i]);
        if (n !== null) {
            soma += n;
            qtd++;
        }
    }
    return qtd > 0 ? (soma / qtd) : null;
}

function calcularTotalFaltas(faltas) {
    let total = 0;
    for (let i = 0; i < 3; i++) {
        let f = parseInt(faltas[i]);
        if (!isNaN(f) && f >= 0) {
            total += f;
        }
    }
    return total;
}

function renderizarBoletim() {
    const corpoTabela = document.getElementById("corpo-tabela-boletim");
    const cardsContainer = document.getElementById("cards-container");

    if (corpoTabela) corpoTabela.innerHTML = "";
    if (cardsContainer) cardsContainer.innerHTML = "";

    if (!dadosBoletim || !dadosBoletim.disciplinas) return;

    dadosBoletim.disciplinas.forEach(d => {
        let n1 = normalizarNota(d.notas ? d.notas[0] : null);
        let n2 = normalizarNota(d.notas ? d.notas[1] : null);
        let n3 = normalizarNota(d.notas ? d.notas[2] : null);

        let f1 = (d.faltas && d.faltas[0] !== undefined && d.faltas[0] !== null) ? d.faltas[0] : 0;
        let f2 = (d.faltas && d.faltas[1] !== undefined && d.faltas[1] !== null) ? d.faltas[1] : 0;
        let f3 = (d.faltas && d.faltas[2] !== undefined && d.faltas[2] !== null) ? d.faltas[2] : 0;

        let media = calcularMediaDisciplina([n1, n2, n3]);
        let totalFaltas = calcularTotalFaltas([f1, f2, f3]);
        let situacao = "Em Acompanhamento";
        if (media !== null) {
            situacao = media >= 6.0 ? "Aprovado" : "Atenção";
        }

        if (corpoTabela) {
            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = d.nome;
            tr.appendChild(tdNome);

            const tdN1 = document.createElement("td");
            tdN1.textContent = n1 !== null ? n1.toFixed(1) : "-";
            tr.appendChild(tdN1);

            const tdF1 = document.createElement("td");
            tdF1.textContent = f1;
            tr.appendChild(tdF1);

            const tdN2 = document.createElement("td");
            tdN2.textContent = n2 !== null ? n2.toFixed(1) : "-";
            tr.appendChild(tdN2);

            const tdF2 = document.createElement("td");
            tdF2.textContent = f2;
            tr.appendChild(tdF2);

            const tdN3 = document.createElement("td");
            tdN3.textContent = n3 !== null ? n3.toFixed(1) : "-";
            tr.appendChild(tdN3);

            const tdF3 = document.createElement("td");
            tdF3.textContent = f3;
            tr.appendChild(tdF3);

            const tdMedia = document.createElement("td");
            tdMedia.textContent = media !== null ? media.toFixed(1) : "-";
            tr.appendChild(tdMedia);

            const tdTotalFaltas = document.createElement("td");
            tdTotalFaltas.textContent = totalFaltas;
            tr.appendChild(tdTotalFaltas);

            const tdSit = document.createElement("td");
            tdSit.textContent = situacao;
            tr.appendChild(tdSit);

            corpoTabela.appendChild(tr);
        }

        if (cardsContainer) {
            const divCard = document.createElement("div");
            divCard.className = "card-item";

            const h3 = document.createElement("h3");
            h3.textContent = d.nome;
            divCard.appendChild(h3);

            const pMedia = document.createElement("p");
            pMedia.textContent = "Média: " + (media !== null ? media.toFixed(1) : "-");
            divCard.appendChild(pMedia);

            const pFaltas = document.createElement("p");
            pFaltas.textContent = "Faltas Totais: " + totalFaltas;
            divCard.appendChild(pFaltas);

            cardsContainer.appendChild(divCard);
        }
    });

    // Atualização dos gráficos após renderizar tabela e cards
    atualizarGraficos();
}

async function fazerLogin() {
    const campoPin = document.getElementById("campo-pin");
    const msgStatus = document.getElementById("mensagem-status-login");
    const pinDigitado = campoPin ? campoPin.value.trim() : "";

    if (!pinDigitado) {
        if (msgStatus) msgStatus.textContent = "Por favor, digite o PIN.";
        return;
    }

    if (msgStatus) msgStatus.textContent = "Conectando...";

    try {
        const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                turma: CONFIG_ALUNO.turma,
                numero_chamada: CONFIG_ALUNO.numeroChamada,
                pin: pinDigitado
            })
        });

        if (resposta.status === 401) {
            if (msgStatus) msgStatus.textContent = "Turma, chamada ou PIN inválidos.";
            return;
        }

        if (resposta.status === 429) {
            if (msgStatus) msgStatus.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
            return;
        }

        if (!resposta.ok) {
            if (msgStatus) msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
            return;
        }

        const dadosRetornados = await resposta.json();

        sessaoPin = pinDigitado;
        if (campoPin) campoPin.value = "";

        if (dadosRetornados && dadosRetornados.dados && dadosRetornados.dados.disciplinas) {
            dadosBoletim = dadosRetornados.dados;
        }

        document.getElementById("secao-login").style.display = "none";
        document.getElementById("secao-boletim").style.display = "block";

        renderizarBoletim();

    } catch (erro) {
        if (msgStatus) msgStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    }
}

function abrirEdicao() {
    const painelEdicao = document.getElementById("painel-edicao");
    const containerCampos = document.getElementById("campos-edicao-disciplinas");
    const msgEdicao = document.getElementById("mensagem-status-edicao");

    if (msgEdicao) msgEdicao.textContent = "";
    if (containerCampos) containerCampos.innerHTML = "";

    if (!dadosBoletim || !dadosBoletim.disciplinas) return;

    dadosBoletim.disciplinas.forEach((d, idx) => {
        const divDisc = document.createElement("div");
        divDisc.className = "grid-edicao-disciplina";

        const h4 = document.createElement("h4");
        h4.textContent = d.nome;
        divDisc.appendChild(h4);

        const divInputs = document.createElement("div");
        divInputs.className = "campos-inputs";

        for (let t = 1; t <= 3; t++) {
            let valNota = (d.notas && d.notas[t - 1] !== undefined && d.notas[t - 1] !== null) ? d.notas[t - 1] : "";
            let valFalta = (d.faltas && d.faltas[t - 1] !== undefined && d.faltas[t - 1] !== null) ? d.faltas[t - 1] : "";

            const divN = document.createElement("div");
            const lblN = document.createElement("label");
            lblN.textContent = `Nota ${t}ºT:`;
            const inpN = document.createElement("input");
            inpN.type = "text";
            inpN.id = `nota-${idx}-${t}`;
            inpN.value = valNota;

            divN.appendChild(lblN);
            divN.appendChild(inpN);

            const divF = document.createElement("div");
            const lblF = document.createElement("label");
            lblF.textContent = `Faltas ${t}ºT:`;
            const inpF = document.createElement("input");
            inpF.type = "number";
            inpF.id = `falta-${idx}-${t}`;
            inpF.value = valFalta;

            divF.appendChild(lblF);
            divF.appendChild(inpF);

            divInputs.appendChild(divN);
            divInputs.appendChild(divF);
        }

        divDisc.appendChild(divInputs);
        containerCampos.appendChild(divDisc);
    });

    if (painelEdicao) painelEdicao.style.display = "block";
}

function fecharEdicao() {
    const painelEdicao = document.getElementById("painel-edicao");
    if (painelEdicao) painelEdicao.style.display = "none";
}

function validarNotaInput(valStr) {
    if (valStr === null || valStr === undefined) return { valido: true, valor: null };
    let str = valStr.toString().trim();
    if (str === "") return { valido: true, valor: null };

    str = str.replace(",", ".");
    let num = Number(str);

    if (isNaN(num)) return { valido: false };
    if (num < 0 || num > 10) return { valido: false };

    return { valido: true, valor: num };
}

function validarFaltaInput(valStr) {
    if (valStr === null || valStr === undefined) return { valido: false };
    let str = valStr.toString().trim();
    if (str === "") return { valido: false };

    let num = Number(str);
    if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        return { valido: false };
    }

    return { valido: true, valor: num };
}

async function salvarAlteracoes() {
    const msgEdicao = document.getElementById("mensagem-status-edicao");
    if (msgEdicao) msgEdicao.textContent = "";

    let possuiErro = false;
    let novasDisciplinas = JSON.parse(JSON.stringify(dadosBoletim.disciplinas));

    dadosBoletim.disciplinas.forEach((d, idx) => {
        let novasNotas = [];
        let novasFaltas = [];

        for (let t = 1; t <= 3; t++) {
            const inpN = document.getElementById(`nota-${idx}-${t}`);
            const inpF = document.getElementById(`falta-${idx}-${t}`);

            if (inpN) inpN.classList.remove("input-invalido");
            if (inpF) inpF.classList.remove("input-invalido");

            let resNota = validarNotaInput(inpN ? inpN.value : "");
            if (!resNota.valido) {
                possuiErro = true;
                if (inpN) inpN.classList.add("input-invalido");
            } else {
                novasNotas.push(resNota.valor);
            }

            let resFalta = validarFaltaInput(inpF ? inpF.value : "");
            if (!resFalta.valido) {
                possuiErro = true;
                if (inpF) inpF.classList.add("input-invalido");
            } else {
                novasFaltas.push(resFalta.valor);
            }
        }

        novasDisciplinas[idx].notas = novasNotas;
        novasDisciplinas[idx].faltas = novasFaltas;
    });

    if (possuiErro) {
        if (msgEdicao) msgEdicao.textContent = "Existem campos com valores inválidos. Verifique os destaques em vermelho.";
        return;
    }

    if (msgEdicao) msgEdicao.textContent = "Salvando...";

    try {
        const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                turma: CONFIG_ALUNO.turma,
                numero_chamada: CONFIG_ALUNO.numeroChamada,
                pin: sessaoPin,
                dados: {
                    disciplinas: novasDisciplinas
                }
            })
        });

        if (!resposta.ok) {
            if (msgEdicao) msgEdicao.textContent = "Erro ao salvar os dados. Tente novamente.";
            return;
        }

        dadosBoletim.disciplinas = novasDisciplinas;
        renderizarBoletim();
        if (msgEdicao) msgEdicao.textContent = "Dados salvos com sucesso.";

        setTimeout(() => {
            fecharEdicao();
        }, 1200);

    } catch (erro) {
        if (msgEdicao) msgEdicao.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    }
}

// ==========================================================================
// CAMADA ISOLADA DE LEITURA E GERAÇÃO DOS GRÁFICOS (SOMENTE LEITURA)
// ==========================================================================

function atualizarGraficoMedias() {
    const canvas = document.getElementById("graficoMediasDisciplinas");
    if (!canvas || typeof Chart === "undefined") return;

    if (graficoMedias) {
        graficoMedias.destroy();
    }

    if (!dadosBoletim || !dadosBoletim.disciplinas) return;

    const rotulos = [];
    const valoresMedias = [];

    dadosBoletim.disciplinas.forEach(d => {
        rotulos.push(d.nome);
        let n1 = normalizarNota(d.notas ? d.notas[0] : null);
        let n2 = normalizarNota(d.notas ? d.notas[1] : null);
        let n3 = normalizarNota(d.notas ? d.notas[2] : null);
        let media = calcularMediaDisciplina([n1, n2, n3]);
        valoresMedias.push(media);
    });

    const ctx = canvas.getContext("2d");
    graficoMedias = new Chart(ctx, {
        type: "bar",
        data: {
            labels: rotulos,
            datasets: [{
                label: "Média Atual",
                data: valoresMedias,
                backgroundColor: "#3498db",
                borderColor: "#2980b9",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            if (val === null || val === undefined) return " Sem notas";
                            return " Média: " + val.toFixed(1).replace(".", ",");
                        }
                    }
                }
            }
        }
    });
}

function atualizarGraficoEvolucao() {
    const canvas = document.getElementById("graficoEvolucaoTrimestres");
    if (!canvas || typeof Chart === "undefined") return;

    if (graficoEvolucao) {
        graficoEvolucao.destroy();
    }

    if (!dadosBoletim || !dadosBoletim.disciplinas) return;

    let somaT1 = 0, qtdT1 = 0;
    let somaT2 = 0, qtdT2 = 0;
    let somaT3 = 0, qtdT3 = 0;

    dadosBoletim.disciplinas.forEach(d => {
        let n1 = normalizarNota(d.notas ? d.notas[0] : null);
        let n2 = normalizarNota(d.notas ? d.notas[1] : null);
        let n3 = normalizarNota(d.notas ? d.notas[2] : null);

        if (n1 !== null) { somaT1 += n1; qtdT1++; }
        if (n2 !== null) { somaT2 += n2; qtdT2++; }
        if (n3 !== null) { somaT3 += n3; qtdT3++; }
    });

    let mediaT1 = qtdT1 > 0 ? (somaT1 / qtdT1) : null;
    let mediaT2 = qtdT2 > 0 ? (somaT2 / qtdT2) : null;
    let mediaT3 = qtdT3 > 0 ? (somaT3 / qtdT3) : null;

    const ctx = canvas.getContext("2d");
    graficoEvolucao = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["1º Tri", "2º Tri", "3º Tri"],
            datasets: [{
                label: "Média Geral",
                data: [mediaT1, mediaT2, mediaT3],
                borderColor: "#2ecc71",
                backgroundColor: "rgba(46, 204, 113, 0.2)",
                fill: true,
                tension: 0.2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            if (val === null || val === undefined) return " Sem notas no trimestre";
                            return " Média Geral: " + val.toFixed(1).replace(".", ",");
                        }
                    }
                }
            }
        }
    });
}

function atualizarGraficoFaltas() {
    const canvas = document.getElementById("graficoFaltasTrimestres");
    const containerBadge = document.getElementById("estadoFaltas");
    const cardFaltas = document.getElementById("card-faltas");

    if (!canvas || typeof Chart === "undefined") return;

    if (graficoFaltas) {
        graficoFaltas.destroy();
    }

    if (!dadosBoletim || !dadosBoletim.disciplinas) return;

    let faltasTri1 = 0;
    let faltasTri2 = 0;
    let faltasTri3 = 0;

    dadosBoletim.disciplinas.forEach(d => {
        let f1 = (d.faltas && d.faltas[0] !== undefined && d.faltas[0] !== null) ? parseInt(d.faltas[0]) : 0;
        let f2 = (d.faltas && d.faltas[1] !== undefined && d.faltas[1] !== null) ? parseInt(d.faltas[1]) : 0;
        let f3 = (d.faltas && d.faltas[2] !== undefined && d.faltas[2] !== null) ? parseInt(d.faltas[2]) : 0;

        if (!isNaN(f1) && f1 >= 0) faltasTri1 += f1;
        if (!isNaN(f2) && f2 >= 0) faltasTri2 += f2;
        if (!isNaN(f3) && f3 >= 0) faltasTri3 += f3;
    });

    let totalFaltasInterno = faltasTri1 + faltasTri2 + faltasTri3;

    if (containerBadge) {
        if (totalFaltasInterno >= 350) {
            containerBadge.innerHTML = '<span class="badge-perigo">Perigo</span>';
            if (cardFaltas) cardFaltas.classList.add("grafico-card-perigo");
        } else {
            containerBadge.innerHTML = "";
            if (cardFaltas) cardFaltas.classList.remove("grafico-card-perigo");
        }
    }

    const ctx = canvas.getContext("2d");
    graficoFaltas = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1º Tri", "2º Tri", "3º Tri"],
            datasets: [{
                label: "Faltas por Trimestre",
                data: [faltasTri1, faltasTri2, faltasTri3],
                backgroundColor: totalFaltasInterno >= 350 ? "#e74c3c" : "#e67e22",
                borderColor: totalFaltasInterno >= 350 ? "#c0392b" : "#d35400",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return " Faltas: " + context.raw;
                        }
                    }
                }
            }
        }
    });
}

function atualizarGraficos() {
    atualizarGraficoMedias();
    atualizarGraficoEvolucao();
    atualizarGraficoFaltas();
}