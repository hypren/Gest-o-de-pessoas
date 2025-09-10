document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    atualizarGraficos(dadosEstagiarios);

    // Adicionar listener para mudanças de status
    window.atualizarStatusEstagiario = (matricula, novoStatus) => {
        const estagiario = dadosEstagiarios.find(e => e.matricula === matricula);
        if (estagiario) {
            estagiario.status = novoStatus;
            atualizarGraficos(dadosEstagiarios);
        }
    };
});