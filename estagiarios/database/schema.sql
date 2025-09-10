-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS gestao_estagiarios;
USE gestao_estagiarios;

-- Criar tabela de secretarias
CREATE TABLE secretarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de estagiários
CREATE TABLE estagiarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('Nível Médio', 'Nível Superior', 'Pós-Graduado') NOT NULL,
    secretaria_id INT,
    data_admissao DATE NOT NULL,
    data_desligamento DATE,
    status ENUM('Ativo', 'Desligado') DEFAULT 'Ativo',
    salario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (secretaria_id) REFERENCES secretarias(id)
);

-- Criar tabela de frequência
CREATE TABLE frequencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estagiario_id INT,
    data DATE NOT NULL,
    presente BOOLEAN DEFAULT TRUE,
    justificativa TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estagiario_id) REFERENCES estagiarios(id)
);

-- Inserir algumas secretarias de exemplo
INSERT INTO secretarias (nome) VALUES
('Secretaria-Geral'),
('Desenvolvimento Urbano'),
('Gestão e Finanças'),
('Secretaria de Governo'),
('Outras');

-- Índices para melhor performance
CREATE INDEX idx_estagiario_status ON estagiarios(status);
CREATE INDEX idx_estagiario_tipo ON estagiarios(tipo);
CREATE INDEX idx_frequencia_data ON frequencia(data);
CREATE INDEX idx_estagiario_admissao ON estagiarios(data_admissao);
