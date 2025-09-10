<?php
// Configurações do banco de dados
$config = [
    'host' => 'localhost:3307',
    'dbname' => 'gestao_estagiarios',
    'user' => 'root',
    'password' => 'pmbbetim'
];

// Função para conectar ao banco de dados
function conectarDB() {
    global $config;
    try {
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8",
            $config['root'],
            $config['pmbbetim']
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        die("Erro de conexão: " . $e->getMessage());
    }
}
