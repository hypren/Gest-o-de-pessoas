let graficos = {}; // Objeto para armazenar as instâncias dos gráficos

function atualizarGraficos(dados) {
    const niveis = contarEstagiariosPorNivel(dados);
    const secretarias = contarEstagiariosPorSecretaria(dados);
    const custoTotal = calcularCustosTotais(dados);
    const status = contarStatus(dados);

    // Gráfico de Níveis (Pizza)
    if (graficos.niveis) {
        graficos.niveis.destroy();
    }
    graficos.niveis = new Chart(document.getElementById('graficoNiveis'), {
        type: 'pie',
        data: {
            labels: Object.keys(niveis),
            datasets: [{
                data: Object.values(niveis),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });

    // Gráfico de Secretarias (Barras)
    if (graficos.secretarias) {
        graficos.secretarias.destroy();
    }
    graficos.secretarias = new Chart(document.getElementById('graficoSecretarias'), {
        type: 'bar',
        data: {
            labels: Object.keys(secretarias),
            datasets: [{
                label: 'Estagiários por Secretaria',
                data: Object.values(secretarias),
                backgroundColor: '#36A2EB'
            }]
        }
    });

    // Gráfico de Status (Rosca)
    if (graficos.status) {
        graficos.status.destroy();
    }
    graficos.status = new Chart(document.getElementById('graficoStatus'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(status),
            datasets: [{
                data: Object.values(status),
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }]
        }
    });

    // Atualizar contador e custo total
    document.getElementById('totalEstagiarios').textContent = dados.length;
    document.getElementById('custoTotal').textContent = 
        `R$ ${custoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}