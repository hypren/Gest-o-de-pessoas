// Atualizar a data atual
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date();
    document.getElementById('currentDate').textContent = date.toLocaleDateString('pt-BR', options);
}

// Função para contar estagiários por secretaria
function contarPorSecretaria() {
    const contagem = {};
    dadosEstagiarios.forEach(estagiario => {
        const secretaria = estagiario.secretaria.replace('SECRETARIA MUNICIPAL DE ', '').replace('SECRETARIA-GERAL DO MUNICÍPIO', 'SECRETARIA-GERAL');
        contagem[secretaria] = (contagem[secretaria] || 0) + 1;
    });
    return contagem;
}

// Função para contar estagiários por tipo
function contarPorTipo() {
    const contagem = {
        'Nível Médio': 0,
        'Nível Superior': 0,
        'Pós-Graduado': 0
    };
    dadosEstagiarios.forEach(estagiario => {
        if (estagiario.cargo.includes('MÉDIO')) contagem['Nível Médio']++;
        else if (estagiario.cargo.includes('SUPERIOR')) contagem['Nível Superior']++;
        else if (estagiario.cargo.includes('PÓS')) contagem['Pós-Graduado']++;
    });
    return contagem;
}

// Função para contar contratações por mês
function contarContratacoesPorMes() {
    const contratacoes = [0, 0, 0, 0, 0, 0]; // Jan a Jun
    dadosEstagiarios.forEach(estagiario => {
        const data = new Date(estagiario.admissao);
        const mes = data.getMonth();
        if (mes < 6) { // Apenas meses de Jan a Jun
            contratacoes[mes]++;
        }
    });
    return contratacoes;
}

// Inicializar gráficos
function initCharts() {
    const contagemSecretaria = contarPorSecretaria();
    const contagemTipo = contarPorTipo();

    // Gráfico de Distribuição por Secretaria
    const ctxSecretaria = document.getElementById('distribuicaoSecretaria').getContext('2d');
    new Chart(ctxSecretaria, {
        type: 'bar',
        data: {
            labels: Object.keys(contagemSecretaria),
            datasets: [{
                data: Object.values(contagemSecretaria),
                backgroundColor: ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c', '#34495e'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Gráfico de Distribuição por Tipo
    const ctxTipo = document.getElementById('distribuicaoTipo').getContext('2d');
    new Chart(ctxTipo, {
        type: 'doughnut',
        data: {
            labels: Object.keys(contagemTipo),
            datasets: [{
                data: Object.values(contagemTipo),
                backgroundColor: ['#3498db', '#2ecc71', '#9b59b6'],
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gráfico de Evolução de Contratações
    const ctxEvolucao = document.getElementById('evolucaoContratacoes').getContext('2d');
    new Chart(ctxEvolucao, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [{
                label: 'Contratações',
                data: contarContratacoesPorMes(),
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Função para aplicar filtros
function aplicarFiltros() {
    const secretaria = document.getElementById('secretariaFilter').value;
    const tipo = document.getElementById('tipoFilter').value;
    const data = document.getElementById('dataFilter').value;
    
    fetchDadosFiltrados(secretaria, tipo, data);
}

// Função para buscar dados filtrados
function fetchDadosFiltrados(secretaria, tipo, data) {
    try {
        // Filtrar dados
        const dadosFiltrados = dadosEstagiarios.filter(estagiario => {
            if (secretaria && !estagiario.secretaria.includes(secretaria)) return false;
            if (tipo && !estagiario.cargo.includes(tipo)) return false;
            if (data) {
                const [ano, mes] = data.split('-');
                const admissao = new Date(estagiario.admissao);
                if (admissao.getFullYear() !== parseInt(ano) || admissao.getMonth() + 1 !== parseInt(mes)) return false;
            }
            return true;
        });

        // Calcular métricas
        const total = dadosFiltrados.length;
        const custoTotal = dadosFiltrados.reduce((acc, curr) => acc + parseFloat(curr.salario), 0);
        const custoMedio = custoTotal / total;
        
        const dados = {
            total: total,
            rotatividade: '8.2',
            custoPerCapita: custoMedio.toFixed(2),
            absenteismo: '4.5',
            estagiarios: dadosFiltrados
        };
        
        atualizarDashboard(dados);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar dados');
    }
}

// Função para atualizar o dashboard com novos dados
function atualizarDashboard(dados) {
    // Atualizar cards principais
    document.getElementById('totalEstagiarios').textContent = dados.total;
    document.getElementById('taxaRotatividade').textContent = dados.rotatividade + '%';
    document.getElementById('custoPerCapita').textContent = 'R$ ' + dados.custoPerCapita;
    document.getElementById('absenteismo').textContent = dados.absenteismo + '%';

    // Atualizar tabela
    const tbody = document.getElementById('tabelaEstagiarios').querySelector('tbody');
    tbody.innerHTML = '';
    
    dados.estagiarios.forEach(estagiario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${estagiario.nome}</td>
            <td>${estagiario.matricula}</td>
            <td>${estagiario.cargo}</td>
            <td>${estagiario.secretaria}</td>
            <td>${estagiario.admissao}</td>
            <td>${estagiario.status}</td>
            <td>R$ ${estagiario.salario}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    initCharts();
    // Carregar dados iniciais
    fetchDadosFiltrados('', '', '');
});
