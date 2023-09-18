const bt_mostraLista = document.querySelector(".botao-mostra-lista")
const bt_novoAluno = document.querySelector(".botao-novo-aluno")
const bt_filtrar = document.querySelector(".bt-filtrar")
const secaoTabela = document.querySelector(".secao-tabela")
const secaoNovoAluno = document.querySelector(".secao-novo-aluno")
const tabelaAlunos = document.querySelector(".tabela-alunos")
const corpoTabelaAlunos = tabelaAlunos.querySelector(".corpo-tabela-alunos") // p adicionar os <tr> e <td>



// Mostro o formulário de inserção de novo aluno
bt_novoAluno.addEventListener("click", () => {
    if (getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "flex") {
        secaoNovoAluno.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "none") {
        secaoNovoAluno.style.setProperty('display', 'flex');
    }
})

// Mostro a tabela com a lista de alunos
bt_mostraLista.addEventListener("click", () => {
    if (getComputedStyle(secaoTabela).getPropertyValue("display") == "flex") {
        secaoTabela.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoTabela).getPropertyValue("display") == "none") {
        secaoTabela.style.setProperty('display', 'flex');
    }
})

// funcao que inicia no carregamento da pagina, que busca a tabela no banco de dados e chama a funcao que monta a lista
function getList() {
    let url = "http://127.0.0.1:5000/get_alunos";
    fetch(url, {method: 'GET'})
        .then(response => {
            return response.json()
        })
        .then(data => {
            data.alunos.forEach(aluno => insertList(aluno.matricula, aluno.cpf, aluno.nome, aluno.telefone, aluno.validade))
            addListenerEdita(".edita")
            addListenerContrata(".contrata")
            addListenerExclui(".exclui")
            // faco os ouvintes das listas de botoes de edicao, contratacao e exclusao de alunos da tabela
        })

        .catch((error) => {
            console.error('Error:', error);
        });
}


getList()

// Funcao que mostra a lista ao usuario
function insertList(matricula, cpf, nome, tel, validade) {
    let aluno = [matricula, cpf, nome, tel, validade]
    const linha = tabelaAlunos.insertRow()

    for (let i = 0; i < aluno.length; i++) {
        let cel = linha.insertCell(i);
        cel.textContent = aluno[i];
    }
    insertButton(linha.insertCell(-1), "✎", "edita")
    insertButton(linha.insertCell(-1), "+", "contrata")
    insertButton(linha.insertCell(-1), "\u00D7", "exclui")


    //removeElement()
}

// funcao chamada por insertList, que coloca os botoes de edita e excluir ultimas colunas de cada linha
function insertButton(parent, caractere, classe) {
    let span = document.createElement("button");
    let txt = document.createTextNode(caractere);
    span.className = classe;
    span.appendChild(txt);
    parent.appendChild(span);
}


// Funcao chamada no getList que adiciona as classes nos botoes de edicao e exclusao, junto com os ouvintes de evento
function addListenerEdita(classe) {
    const bt_editaAluno = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_editaAluno.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            console.log("Clicou no elemento:", element, "index:", index);
            console.log("Evento:", e);
        });
    });
}

function addListenerContrata(classe) {
    const bt_contrata = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_contrata.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            console.log("Clicou no elemento:", element, "index:", index);
            console.log("Evento:", e);
            const linha_atual = document.querySelectorAll('tr')[index + 1];
            const cpf = linha_atual.children[1].innerHTML;
            console.log(cpf)

        });
    });
}

function addListenerExclui(classe) {
    const bt_exclui = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_exclui.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            console.log("Clicou no elemento:", element, "index:", index);
            console.log("Evento:", e);
            if (confirm("Você tem certeza?")) {
                const linha_atual = document.querySelectorAll('tr')[index + 1];
                const cpf = linha_atual.children[1].innerHTML;
                let url = "http://127.0.0.1:5000/del_aluno?cpf=" + cpf;
                fetch(url, {method: 'DELETE'})
                    .then((response) => response.json())
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                linha_atual.remove();
            }
        });
    });
}
