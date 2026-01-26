<?php
/**
 * SAG Garage - Backend API PHP
 * Compatible con cPanel / Hosting compartido
 */

// Configuración de CORS
header('Access-Control-Allow-Origin: https://saggarage.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Cargar configuración
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/jwt.php';

// Cargar controladores
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/OrdenesController.php';

// Obtener la ruta y método
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remover query string y obtener path
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/backend/', '', $path); // Ajustar según tu estructura

// Router simple
try {
    // Rutas de autenticación
    if ($path === 'api/auth/login' && $request_method === 'POST') {
        $controller = new AuthController();
        $controller->login();
    }
    elseif ($path === 'api/auth/me' && $request_method === 'GET') {
        $controller = new AuthController();
        $controller->me();
    }
    
    // Rutas de órdenes
    elseif ($path === 'api/ordenes' && $request_method === 'GET') {
        $controller = new OrdenesController();
        $controller->getAll();
    }
    elseif (preg_match('#^api/ordenes/([0-9]+)$#', $path, $matches) && $request_method === 'GET') {
        $controller = new OrdenesController();
        $controller->getById($matches[1]);
    }
    elseif ($path === 'api/ordenes' && $request_method === 'POST') {
        $controller = new OrdenesController();
        $controller->create();
    }
    elseif (preg_match('#^api/ordenes/([0-9]+)$#', $path, $matches) && $request_method === 'PUT') {
        $controller = new OrdenesController();
        $controller->update($matches[1]);
    }
    elseif (preg_match('#^api/ordenes/([0-9]+)$#', $path, $matches) && $request_method === 'DELETE') {
        $controller = new OrdenesController();
        $controller->delete($matches[1]);
    }
    
    // Ruta de salud
    elseif ($path === 'api/health' && $request_method === 'GET') {
        echo json_encode([
            'status' => 'ok',
            'database' => 'MySQL conectado',
            'timestamp' => time()
        ]);
    }
    
    // Ruta no encontrada
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error interno del servidor',
        'message' => $e->getMessage()
    ]);
}