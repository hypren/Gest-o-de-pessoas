// Função para exportar para CSV
function exportarCSV() {
    const headers = ['Matrícula', 'Nome', 'Cargo', 'Secretaria', 'Admissão', 'Status', 'Salário'];
    const csvRows = [headers];

    dadosEstagiarios.forEach(estagiario => {
        const row = [
            estagiario.matricula,
            estagiario.nome,
            estagiario.cargo,
            estagiario.secretaria,
            estagiario.admissao,
            estagiario.status,
            estagiario.salario
        ];
        csvRows.push(row);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `estagiarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função para exportar para Excel
async function exportarExcel() {
    const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
    
    const ws = XLSX.utils.json_to_sheet(dadosEstagiarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estagiários");
    
    XLSX.writeFile(wb, `estagiarios_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Função para importar dados
async function importarDados(file) {
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            let dados;
            if (file.name.endsWith('.csv')) {
                dados = CSVToJSON(e.target.result);
            } else if (file.name.endsWith('.xlsx')) {
                const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
                const workbook = XLSX.read(e.target.result, {type: 'binary'});
                dados = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            }

            if (confirmarImportacao(dados)) {
                dadosEstagiarios = dados;
                atualizarGraficos(dadosEstagiarios);
                alert('Dados importados com sucesso!');
            }
        } catch (error) {
            alert('Erro ao importar arquivo: ' + error.message);
        }
    };

    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

// Função auxiliar para converter CSV para JSON
function CSVToJSON(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }
    return result;
}

// Função para confirmar importação
function confirmarImportacao(dados) {
    return confirm(`Deseja importar ${dados.length} registros? Isso substituirá todos os dados existentes.`);
}

// Adicionar event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
    document.getElementById('btnExportarExcel').addEventListener('click', exportarExcel);
    
    const btnImportar = document.getElementById('btnImportar');
    const inputImportar = document.getElementById('inputImportar');
    
    btnImportar.addEventListener('click', () => inputImportar.click());
    inputImportar.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importarDados(e.target.files[0]);
        }
    });
});