<?php
/**
 * Controlador de autenticación
 */

class AuthController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Login - POST /api/auth/login
     */
    public function login() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email y contraseña son requeridos']);
                return;
            }
            
            $email = $data['email'];
            $password = $data['password'];
            
            // Buscar usuario en la base de datos
            $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas']);
                return;
            }
            
            // Verificar contraseña
            if (!password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas']);
                return;
            }
            
            // Generar token JWT
            $payload = [
                'userId' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'iat' => time(),
                'exp' => time() + (24 * 60 * 60) // 24 horas
            ];
            
            $token = JWT::encode($payload);
            
            // Preparar respuesta
            $response = [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'role' => $user['role']
                ]
            ];
            
            echo json_encode($response);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al procesar login',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Obtener usuario actual - GET /api/auth/me
     */
    public function me() {
        try {
            $userData = requireAuth();
            
            // Obtener usuario actualizado de la base de datos
            $stmt = $this->db->prepare('SELECT id, email, name, role FROM users WHERE id = ? LIMIT 1');
            $stmt->execute([$userData['userId']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                return;
            }
            
            echo json_encode(['user' => $user]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener usuario',
                'message' => $e->getMessage()
            ]);
        }
    }
}