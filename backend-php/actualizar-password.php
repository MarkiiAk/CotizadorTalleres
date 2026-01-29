<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizar Contraseña - SAG Garage</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .subtitle {
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        label {
            display: block;
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s;
        }
        
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            animation: slideIn 0.5s;
        }
        
        .error {
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            animation: shake 0.5s;
        }
        
        .info {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #ffc107;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .icon {
            font-size: 48px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔐</div>
        <h1>Actualizar Contraseña</h1>
        <p class="subtitle">SAG Garage - Sistema de Gestión</p>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Procesar formulario
    require_once __DIR__ . '/config/database.php';
    
    $username = trim($_POST['username'] ?? '');
    $new_password = $_POST['password'] ?? '';
    
    // Validaciones
    if (empty($username) || empty($new_password)) {
        echo '<div class="error"><strong>❌ Error:</strong> Usuario y contraseña son requeridos.</div>';
    } elseif (strlen($new_password) < 8) {
        echo '<div class="error"><strong>❌ Error:</strong> La contraseña debe tener al menos 8 caracteres.</div>';
    } else {
        try {
            $db = Database::getInstance()->getConnection();
            
            // Verificar si el usuario existe
            $stmt = $db->prepare('SELECT id, username, email FROM usuarios WHERE username = ?');
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if (!$user) {
                echo '<div class="error"><strong>❌ Usuario no encontrado:</strong> El usuario "' . htmlspecialchars($username) . '" no existe en la base de datos.</div>';
            } else {
                // Generar hash de la nueva contraseña
                $password_hash = password_hash($new_password, PASSWORD_BCRYPT);
                
                // Actualizar contraseña
                $stmt = $db->prepare('UPDATE usuarios SET password_hash = ?, fecha_actualizacion = NOW() WHERE username = ?');
                $stmt->execute([$password_hash, $username]);
                
                echo '<div class="success">';
                echo '<strong>✅ Contraseña actualizada correctamente</strong><br><br>';
                echo '<strong>Usuario:</strong> ' . htmlspecialchars($user['username']) . '<br>';
                echo '<strong>Email:</strong> ' . htmlspecialchars($user['email']) . '<br><br>';
                echo '<a href="https://saggarage.com.mx/gestion" class="back-link" style="color: white; text-decoration: underline;">→ Ir al Login</a>';
                echo '</div>';
                
                // Limpiar variables sensibles
                $new_password = null;
                $password_hash = null;
                unset($_POST);
            }
            
        } catch (Exception $e) {
            echo '<div class="error"><strong>❌ Error de base de datos:</strong> ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
} else {
    // Mostrar formulario
    ?>
    <div class="warning">
        <strong>⚠️ Importante:</strong> Esta herramienta actualiza la contraseña de un usuario existente. No se almacenan datos sensibles en este archivo.
    </div>
    
    <form method="POST" action="">
        <div class="form-group">
            <label for="username">👤 Usuario</label>
            <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Ingresa el nombre de usuario"
                required 
                autocomplete="off"
            >
        </div>
        
        <div class="form-group">
            <label for="password">🔑 Nueva Contraseña</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Mínimo 8 caracteres"
                required
                minlength="8"
            >
        </div>
        
        <button type="submit" class="btn">Actualizar Contraseña</button>
    </form>
    
    <a href="https://saggarage.com.mx/gestion" class="back-link">← Volver al Login</a>
    <?php
}
?>
    </div>
</body>
</html>