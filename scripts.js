let vetorDenuncias = JSON.parse(localStorage.getItem('todasDenuncias')) || [];

function exibirContador() {
    const elementoContador = document.getElementById('ValorContador');
    
    if (elementoContador) {
        elementoContador.innerText = vetorDenuncias.length;
    }
}

function validarCampos() {
    const bairro = document.getElementById('bairro').value;
    const endereco = document.getElementById('endereco').value;
    
    if (bairro === "" || endereco.trim() === "") {
        alert("Por favor, preencha o bairro e o endereço corretamente.");
        return false;
    }
    return true;
}

function mostrarDicaBairro(event) {
    const bairroEscolhido = event.target.value;
}

function salvarDenuncia(event) {
    event.preventDefault();
    
    if (!validarCampos()) return; 


    const novaDenuncia = {
        id: Date.now(),
        bairro: document.getElementById('bairro').value,
        endereco: document.getElementById('endereco').value,
        tipo: document.getElementById('tipoPoluicao').value
    };

    vetorDenuncias.push(novaDenuncia);
    
    localStorage.setItem('todasDenuncias', JSON.stringify(vetorDenuncias));
    
    alert("Denúncia registrada com sucesso!");
    document.getElementById('formDenuncia').reset();
    
    exibirContador(); 
    renderizarMinhasDenuncias(); 
}

function excluirDenuncia(idParaExcluir) {

    vetorDenuncias = vetorDenuncias.filter(denuncia => denuncia.id !== idParaExcluir);
    

    localStorage.setItem('todasDenuncias', JSON.stringify(vetorDenuncias));
    
    exibirContador();
    renderizarMinhasDenuncias();
}

function renderizarMinhasDenuncias() {

    const lista = document.getElementById('listaMinhasDenuncias');
    if (!lista) return; 
    
    lista.innerHTML = ""; 
    
    if (vetorDenuncias.length === 0) {
        lista.innerHTML = "<li><i>Nenhuma denúncia registrada ainda.</i></li>";
        return;
    }


    vetorDenuncias.forEach(denuncia => {
        const item = document.createElement('li');
        item.style.marginBottom = "10px";
        item.innerHTML = `
            <strong>${denuncia.tipo}</strong> em ${denuncia.bairro} (${denuncia.endereco}) 
            <button onclick="excluirDenuncia(${denuncia.id})" class="botaoExcluir">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

function renderizarCards() {
    
    const listaFocos = document.getElementById('listaFocos');
    if (!listaFocos) return; 
    
    if (vetorDenuncias.length === 0) {
        listaFocos.innerHTML = "<p>Sem focos de poluição registrados no momento.</p>";
        return;
    }

    listaFocos.innerHTML = ""; 
    listaFocos.style.display = "block"; 
    listaFocos.style.padding = "5px 0";

    vetorDenuncias.forEach(denuncia => {
        const card = document.createElement('div');
        card.style.background = "white";
        card.style.border = "1px solid red";
        card.style.margin = "5px 0";
        card.style.padding = "8px";
        card.style.borderRadius = "4px";
        card.innerHTML = `📍 <b>Foco:</b> ${denuncia.endereco} - ${denuncia.bairro} <br> <span style="color: #666; font-size: 14px;">Motivo: ${denuncia.tipo}</span>`;
        listaFocos.appendChild(card);
    });
}

function calcularEstatisticas() {
    const listaFocos = document.getElementById('listaFocos');
    if (!listaFocos || vetorDenuncias.length === 0) return;

    let totalEsgoto = vetorDenuncias.filter(d => d.tipo === "Esgoto").length;
    
    const stats = document.createElement('div');
    stats.style.marginTop = "15px";
    stats.style.fontWeight = "bold";
    stats.style.color = "#2b6311";
    stats.innerHTML = `<hr style="border: 1px dashed #3c8918;">📊 Estatística: ${totalEsgoto} caso(s) de Esgoto reportados em POA.`;
    listaFocos.appendChild(stats);
}

document.addEventListener('DOMContentLoaded', () => {
    exibirContador();

    const form = document.getElementById('formDenuncia');
    if (form) {
        form.addEventListener('submit', salvarDenuncia);
        document.getElementById('bairro').addEventListener('change', mostrarDicaBairro);
        renderizarMinhasDenuncias();
    }

    renderizarCards();
    calcularEstatisticas();
});