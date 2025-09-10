// Funções de validação para dados dos estagiários

// Lista de cargos válidos
const CARGOS_VALIDOS = [
    'ESTÁGIO NÍVEL MÉDIO GERAL',
    'ESTÁGIO NÍVEL SUPERIOR GERAL',
    'ESTÁGIO NÍVEL PÓS GRADUADO GERAL'
];

// Lista de status válidos
const STATUS_VALIDOS = ['Ativo', 'Inativo', 'Desligado'];

// Validação completa de um estagiário
function validarEstagiario(estagiario) {
    const erros = [];
    
    // Validar matrícula
    if (!validarMatricula(estagiario.matricula)) {
        erros.push('Matrícula inválida');
    }
    
    // Validar nome
    if (!validarNome(estagiario.nome)) {
        erros.push('Nome inválido');
    }
    
    // Validar cargo
    if (!validarCargo(estagiario.cargo)) {
        erros.push('Cargo inválido');
    }
    
    // Validar secretaria
    if (!validarSecretaria(estagiario.secretaria)) {
        erros.push('Secretaria inválida');
    }
    
    // Validar data de admissão
    if (!validarDataAdmissao(estagiario.admissao)) {
        erros.push('Data de admissão inválida');
    }
    
    // Validar status
    if (!validarStatus(estagiario.status)) {
        erros.push('Status inválido');
    }
    
    // Validar salário
    if (!validarSalario(estagiario.salario)) {
        erros.push('Salário inválido');
    }
    
    return {
        valido: erros.length === 0,
        erros: erros
    };
}

// Validação de matrícula (9 dígitos)
function validarMatricula(matricula) {
    return /^\d{9}$/.test(matricula);
}

// Validação de nome (não vazio e apenas letras, espaços e acentos)
function validarNome(nome) {
    if (!nome || nome.trim().length === 0) return false;
    return /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]+$/i.test(nome);
}

// Validação de cargo
function validarCargo(cargo) {
    return CARGOS_VALIDOS.includes(cargo);
}

// Validação de secretaria (não vazio)
function validarSecretaria(secretaria) {
    return secretaria && secretaria.trim().length > 0 && secretaria.startsWith('SECRETARIA');
}

// Validação de data de admissão (formato MM/DD/YYYY e não futura)
function validarDataAdmissao(data) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return false;
    
    const [mes, dia, ano] = data.split('/').map(Number);
    const dataAdmissao = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    
    return dataAdmissao instanceof Date && !isNaN(dataAdmissao) && dataAdmissao <= hoje;
}

// Validação de status
function validarStatus(status) {
    return STATUS_VALIDOS.includes(status);
}

// Validação de salário (valor numérico positivo)
function validarSalario(salario) {
    const valor = parseFloat(salario);
    return !isNaN(valor) && valor > 0;
}

// Função para validar todos os estagiários
function validarTodosEstagiarios(estagiarios) {
    const resultados = estagiarios.map(estagiario => ({
        matricula: estagiario.matricula,
        nome: estagiario.nome,
        ...validarEstagiario(estagiario)
    }));
    
    return {
        todosValidos: resultados.every(r => r.valido),
        resultados: resultados
    };
}
