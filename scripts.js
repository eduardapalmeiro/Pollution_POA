const elementoContador = document.getElementById('ValorContador');
const botaoTestar = document.getElementById('botaoTestar');

function exibirContador() {
    let totalSalvo = localStorage.getItem('qtdDenuncias') || 0;
    elementoContador.innerText = totalSalvo;
}

function incrementarContador() {
    let totalAtual = parseInt(localStorage.getItem('qtdDenuncias') || 0);
    let novoTotal = totalAtual + 1;
    
    localStorage.setItem('qtdDenuncias', novoTotal);
    exibirContador();
}

botaoTestar.addEventListener('click', incrementarContador);

exibirContador();