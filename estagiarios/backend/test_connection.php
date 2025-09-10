<?php
require_once 'config.php';

try {
    $pdo = conectarDB();
    echo "Conexão bem sucedida!";
    
    // Testar se as tabelas foram criadas
    $stmt = $pdo->query("SELECT * FROM secretarias");
    $secretarias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n\nSecretarias cadastradas:\n";
    foreach ($secretarias as $secretaria) {
        echo "- " . $secretaria['nome'] . "\n";
    }
    
} catch(PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}
