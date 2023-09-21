const bt_mostraLista = document.querySelector(".botao-mostra-lista");
const bt_novoAluno = document.querySelector(".botao-novo-aluno");
const bt_atualizaLista = document.querySelector(".bt_atualiza-lista")
const bt_filtrar = document.querySelector(".bt-filtrar");
const secaoTabela = document.querySelector(".secao-tabela");
const secaoNovoAluno = document.querySelector(".secao-novo-aluno");
const corpoTabelaAlunos = document.querySelector(".corpo-tabela-alunos");
const form = document.querySelector("#form-novo-aluno");
const inNovoAluno = form.querySelector("#inNome");
const inNovoCPF = form.querySelector("#inCPF");
const inNovoTelefone = form.querySelector("#inTelefone");
const inFiltro = document.querySelector("#inFiltro");



/*
*****************************************************************
=== Botao para mostrar o formulário de inserção de novo aluno ===
*****************************************************************
*/
bt_novoAluno.addEventListener("click", () => {
    if (getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "flex") {
        secaoNovoAluno.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "none") {
        secaoNovoAluno.style.setProperty('display', 'flex');
    };
});


/*
*********************************************************
=== Botao para mostrar a tabela com a lista de alunos ===
*********************************************************
*/
bt_mostraLista.addEventListener("click", () => {
    if (getComputedStyle(secaoTabela).getPropertyValue("display") == "flex") {
        secaoTabela.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoTabela).getPropertyValue("display") == "none") {
        secaoTabela.style.setProperty('display', 'flex');
    };
});




/*
************************************************************************************
=== Funcao que inicia no carregamento da pagina e quando ha atualizacoes no BD,  ===
=== que busca a tabela no banco de dados e chama a funcao que monta a lista      ===
************************************************************************************
*/
async function getList() {
    let url = "http://127.0.0.1:5000/get_alunos";
    fetch(url, { method: 'GET' })
        .then(resposta => {
            return resposta.json();
        })
        .then(data => {
            limpaTabela();
            data.alunos.forEach(aluno => insertList(aluno.matricula, aluno.cpf, aluno.nome, aluno.telefone, aluno.validade));
            aplicaOuvintes()
            // faco os ouvintes das listas de botoes de edicao, contratacao e exclusao de alunos da tabela
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    limpaCampos();
};
getList();



/*
********************************************
=== Funcao que mostra a lista ao usuario ===
********************************************
*/
function insertList(matricula, cpf, nome, tel, validade) {
    let aluno = [matricula, cpf, nome, tel, validade];
    const linha = corpoTabelaAlunos.insertRow();

    // For que cria e preenche as células com a quantidade de alunos e seus respectivos dados
    for (let i = 0; i < aluno.length; i++) {
        let cel = linha.insertCell(i);
        cel.textContent = aluno[i];
    };

    // Chama a função para inserir nas ultimsa colunas os botões de edição, adição de plano e exclusão do aluno.
    insertButton(linha.insertCell(-1), "✎", "edita");
    insertButton(linha.insertCell(-1), "+", "contrata");
    insertButton(linha.insertCell(-1), "\u00D7", "exclui");
};


/*
************************************************************************************************************
=== Funcao chamada por insertList, que coloca os botoes de edita e excluir ultimas colunas de cada linha ===
************************************************************************************************************
*/
function insertButton(parent, caractere, classe) {
    let botao = document.createElement("button");
    let txt = document.createTextNode(caractere);
    botao.className = classe;
    botao.appendChild(txt);
    parent.appendChild(botao);
};


/*
*********************************************************************************************************
=== Funcao auxiliar que ativa os botões de alteracao cadastral, inclusao de plano e exclusao de aluno ===
*********************************************************************************************************
*/
async function aplicaOuvintes() {
    editaCadastro(".edita");
    contrataPlano(".contrata");
    excluiAluno(".exclui");
}



/*
***********************************************************************************
                === Funcao para filtrar aluno por CPF ===
***********************************************************************************
=== Capta o valor do CPF e chama a funcao que chama a rota de filtro /get_aluno ===
***********************************************************************************
*/
function filtraAlunos() {
    bt_filtrar.addEventListener("click", () => {
        let cpf = inFiltro.value;
        if (cpf == "" || isNaN(cpf)) {
            alert("Digite um valor válido!")
            getList()
            return; //caso o campo esteja vazio, mostra a lista completa
        }
        getListFiltrada(cpf);
        inFiltro.value = "";
        inFiltro.focus();
    });
};
filtraAlunos();


/*
******************************************************************************************************
=== Utiliza a rota e obtem o retorno. Chama a funcao que deixa apenas o conteudo filtrado no Front ===
******************************************************************************************************
*/
async function getListFiltrada(cpf) {
    let url = `http://127.0.0.1:5000/get_aluno?cpf=${cpf}`;
    fetch(url, { method: 'GET' })
        .then(resposta => resposta.json())
        .then((dados) => {
            limpaTabela();
            insertList(dados.matricula, dados.cpf, dados.nome, dados.tel, dados.validade);
        })
        .then(() => aplicaOuvintes())
        .catch((error) => console.error('Error:', error));
};


/*
***********************************
=== Funcao para adicionar Aluno ===
***********************************
*/
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', inNovoAluno.value);
    formData.append('cpf', inNovoCPF.value);
    formData.append('telefone', inNovoTelefone.value);

    url = 'http://127.0.0.1:5000/add_aluno';
    fetch(url, { method: 'post', body: formData })
        .then((resposta) => {
            if (resposta.ok) {
                resposta.json();
                getList();
            }
            else {
                throw new Error("Erro ao adicionar novo aluno.");
            };
        })
        .catch((error) => console.error('Error:', error));
});





/*
*****************************************************************************************************************************

=== Funcoes chamadas no getList que adicionam as classes nos botoes de edicao e exclusao, junto com os ouvintes de evento ===

*****************************************************************************************************************************
*/
/*
**********************************************************************
=== Funcao que ira editar o cadastro de um aluno - Nome e Telefone ===
**********************************************************************
*/
function editaCadastro(classe) {
    const bt_editaAluno = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_editaAluno.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            const linha_atual = element.parentElement.parentElement;
            const cpf = linha_atual.children[1].innerText;
            const nome = prompt(`Insira o nome correto do Aluno \n CPF: ${cpf}`);
            if (nome) {
                const telefone = prompt("Insira o telefone do aluno");
                if (telefone) {
                    const parametros = { cpf: cpf, nome: nome, telefone: telefone };
                    let url = 'http://127.0.0.1:5000/update_aluno';
                    fetch(`${url}?${new URLSearchParams(parametros).toString()}`, { method: 'PUT' })
                        .then((resposta) => {
                            if (resposta.ok) {
                                resposta.json();
                                alert("Dados do aluno atualizados com sucesso!")
                            }
                            else {
                                throw new Error("Erro ao atualizar dados do aluno.")
                            }
                        })
                        .then(data => getList())
                        .catch((error) => console.error('Erro:', error));
                }
            }
        });
    });
};


/*
***********************************************************************
=== Funcao que ira adicionar X meses a validade do plano do cliente ===
***********************************************************************
*/
function contrataPlano(classe) {
    const bt_contrata = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_contrata.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            const linha_atual = element.parentElement.parentElement;
            const cpf = linha_atual.children[1].innerText;
            let qtd_meses = prompt("Quantos meses o aluno contratou?");
            if (qtd_meses == null) { return } // Para a execução em caso de não inclusão de dado
            const parametros = { cpf: cpf, qtd_meses: qtd_meses };
            let url = 'http://127.0.0.1:5000/contrata_plano';
            fetch(`${url}?${new URLSearchParams(parametros).toString()}`, { method: 'PUT' })
                .then((resposta) => {
                    if (resposta.ok) {
                        resposta.json();
                        alert("Plano renovado com sucesso!")
                    }
                    else {
                        throw new Error("Erro ao contratar plano.");
                    }
                })
                .then(data => { getList() })
                .catch((error) => { console.error('Erro:', error) });
        });
    });
};

/*
********************************************
=== Funcao que excui o cadastro do aluno ===
********************************************
*/
function excluiAluno(classe) {
    const bt_exclui = document.querySelectorAll(classe);
    // Itera sobre cada elemento e adiciona o event listener
    bt_exclui.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            if (confirm("Você tem certeza?")) {
                const linha_atual = element.parentElement.parentElement;
                const cpf = linha_atual.children[1].innerText;
                let url = "http://127.0.0.1:5000/del_aluno?cpf=" + cpf;
                fetch(url, { method: 'DELETE' })
                    .then((response) => response.json())
                    .then(() => linha_atual.remove())
                    .catch((error) => console.error('Error:', error));
            };
        });
    });
};









/*
*******************************************************************************************
=== Funcao que limpa a tabela, para ser chamada antes de construir, evitando duplicacao ===
*******************************************************************************************
*/
function limpaTabela() {
    corpoTabelaAlunos.innerHTML = "";
}

/*
*********************************************************************************************
=== Funcao que limpa os campos de preenchimento, para nao ter nada ao recarregar a pagina ===
*********************************************************************************************
*/
function limpaCampos() {
    inNovoAluno.value = "";
    inNovoCPF.value = "";
    inNovoTelefone.value = "";
    inFiltro.value = "";
}