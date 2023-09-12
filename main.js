const bt_mostraLista = document.querySelector(".botao-mostra-lista")
const bt_novoAluno = document.querySelector(".botao-novo-aluno")
const secaoTabela = document.querySelector(".secao-tabela")
const secaoNovoAluno = document.querySelector(".secao-novo-aluno")


bt_mostraLista.addEventListener("click", () => {
    console.log("click")
    if(getComputedStyle(secaoTabela).getPropertyValue("display") == "flex"){
        console.log("estava mostrando")
        secaoTabela.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoTabela).getPropertyValue("display") == "none"){
        console.log("estava oculto")
        secaoTabela.style.setProperty('display', 'flex');
    }
})

bt_novoAluno.addEventListener("click", () => {
    console.log("clicknovoaluno")
    if(getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "flex"){
        console.log("estava mostrando")
        secaoNovoAluno.style.setProperty('display', 'none');
    }

    else if (getComputedStyle(secaoNovoAluno).getPropertyValue("display") == "none"){
        console.log("estava oculto")
        secaoNovoAluno.style.setProperty('display', 'flex');
    }
})