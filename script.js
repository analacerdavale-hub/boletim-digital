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