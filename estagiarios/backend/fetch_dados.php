<?php
header('Content-Type: application/json');
require_once 'config.php';

// Receber dados do POST
$data = json_decode(file_get_contents('php://input'), true);
$secretaria = $data['secretaria'] ?? '';
$tipo = $data['tipo'] ?? '';
$data_filtro = $data['data'] ?? '';

try {
    $pdo = conectarDB();
    
    // Construir a query base
    $query = "SELECT 
                e.*,
                s.nome as secretaria_nome
             FROM estagiarios e
             LEFT JOIN secretarias s ON e.secretaria_id = s.id
             WHERE 1=1";
    
    $params = [];
    
    // Adicionar filtros
    if (!empty($secretaria)) {
        $query .= " AND e.secretaria_id = ?";
        $params[] = $secretaria;
    }
    
    if (!empty($tipo)) {
        $query .= " AND e.tipo = ?";
        $params[] = $tipo;
    }
    
    if (!empty($data_filtro)) {
        $query .= " AND DATE_FORMAT(e.data_admissao, '%Y-%m') = ?";
        $params[] = $data_filtro;
    }
    
    // Executar a query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $estagiarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calcular métricas
    $total = count($estagiarios);
    
    // Outras queries para métricas específicas
    $stmt = $pdo->query("SELECT 
        COUNT(*) as total_desligados 
        FROM estagiarios 
        WHERE status = 'Desligado' 
        AND data_desligamento >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
    $desligados = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $rotatividade = ($total > 0) ? ($desligados['total_desligados'] / $total) * 100 : 0;
    
    $stmt = $pdo->query("SELECT AVG(salario) as media_salario FROM estagiarios WHERE status = 'Ativo'");
    $custoMedio = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Preparar resposta
    $response = [
        'total' => $total,
        'rotatividade' => number_format($rotatividade, 1),
        'custoPerCapita' => number_format($custoMedio['media_salario'], 2),
        'absenteismo' => '4.5', // Este valor precisaria vir de uma tabela de frequência
        'estagiarios' => $estagiarios
    ];
    
    echo json_encode($response);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
