<?php
/**
 * Configuración de Base de Datos
 */

// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'saggarag_GestionPresupuestos');
define('DB_USER', 'saggarag_admin');
define('DB_PASS', 'Kndiani2593!');
define('DB_CHARSET', 'utf8mb4');

// Crear conexión PDO
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    error_log('ERROR de conexión a BD: ' . $e->getMessage());
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]));
}

return $pdo;