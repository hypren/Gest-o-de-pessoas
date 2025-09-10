// Função para contar estagiários por nível
function contarEstagiariosPorNivel(dados) {
    const contagem = {
        'MÉDIO': 0,
        'SUPERIOR': 0,
        'PÓS': 0
    };

    dados.forEach(estagiario => {
        if (estagiario.cargo.includes('MÉDIO')) contagem['MÉDIO']++;
        else if (estagiario.cargo.includes('SUPERIOR')) contagem['SUPERIOR']++;
        else if (estagiario.cargo.includes('PÓS')) contagem['PÓS']++;
    });

    return contagem;
}

// Função para contar estagiários por secretaria
function contarEstagiariosPorSecretaria(dados) {
    const contagem = {};
    dados.forEach(estagiario => {
        const secretaria = estagiario.secretaria;
        contagem[secretaria] = (contagem[secretaria] || 0) + 1;
    });
    return contagem;
}

// Função para calcular custos totais
function calcularCustosTotais(dados) {
    return dados.reduce((total, estagiario) => {
        return total + parseFloat(estagiario.salario);
    }, 0);
}

// Função para contar status
function contarStatus(dados) {
    const contagem = {
        'Ativo': 0,
        'Inativo': 0,
        'Desligado': 0
    };
    
    dados.forEach(estagiario => {
        contagem[estagiario.status]++;
    });
    
    return contagem;
}