<?php
/**
 * Configuración de base de datos MySQL
 */

class Database {
    private static $instance = null;
    private $connection;
    
    private $host = 'localhost';
    private $db_name = 'saggarag_GestionPresupuestos';
    private $username = 'saggarag_admin';
    private $password = 'Kndiani2593!';
    private $charset = 'utf8mb4';
    
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            // En caso de error, usar fallback a JSON
            error_log('Error de conexión MySQL: ' . $e->getMessage());
            throw new Exception('Error de conexión a la base de datos');
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Prevenir clonación
    private function __clone() {}
    
    // Prevenir deserialización
    public function __wakeup() {
        throw new Exception("No se puede deserializar singleton");
    }
}