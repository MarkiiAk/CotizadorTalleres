<?php
/**
 * Script para crear usuario markiiak directamente en la base de datos
 * Ejecutar desde el navegador: https://saggarage.com.mx/gestion/backend-php/crear-usuario-markiiak.php
 * O desde CLI: php crear-usuario-markiiak.php
 */

// Cargar configuración de base de datos
require_once __DIR__ . '/config/database.php';

// Datos del nuevo usuario
$username = 'markiiak';
$password = 'Kndiani2593!';
$email = 'markiiak@saggarage.com';
$nombre_completo = 'Markii Ak';
$rol = 'admin';

// Generar hash de contraseña
$password_hash = password_hash($password, PASSWORD_BCRYPT);

echo "<!DOCTYPE html>
<html>
<head>
    <title>Crear Usuario - markiiak</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #bee5eb; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🔐 Crear Usuario: markiiak</h1>
";

try {
    // Obtener conexión a la base de datos
    $db = Database::getInstance()->getConnection();
    
    echo "<div class='info'>";
    echo "<strong>📊 Información del usuario a crear:</strong><br>";
    echo "Usuario: <code>$username</code><br>";
    echo "Email: <code>$email</code><br>";
    echo "Nombre: <code>$nombre_completo</code><br>";
    echo "Rol: <code>$rol</code><br>";
    echo "Contraseña: <code>$password</code><br>";
    echo "Hash generado: <code>" . substr($password_hash, 0, 30) . "...</code>";
    echo "</div>";
    
    // Verificar si el usuario ya existe
    $stmt = $db->prepare('SELECT id, username FROM usuarios WHERE username = ? OR email = ?');
    $stmt->execute([$username, $email]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        echo "<div class='error'>";
        echo "<strong>⚠️ El usuario ya existe</strong><br>";
        echo "ID: {$existing['id']}<br>";
        echo "Username: {$existing['username']}<br><br>";
        echo "<strong>¿Quieres actualizar la contraseña?</strong><br>";
        echo "Ejecuta este UPDATE en phpMyAdmin:";
        echo "</div>";
        
        echo "<pre>";
        echo "UPDATE usuarios \n";
        echo "SET password_hash = '$password_hash'\n";
        echo "WHERE username = '$username';\n";
        echo "</pre>";
        
        echo "<div class='info'>";
        echo "<strong>O haz clic aquí para actualizar automáticamente:</strong><br>";
        echo "<a href='?action=update' class='btn'>Actualizar Contraseña</a>";
        echo "</div>";
        
        // Si se solicita actualizar
        if (isset($_GET['action']) && $_GET['action'] === 'update') {
            $stmt = $db->prepare('UPDATE usuarios SET password_hash = ? WHERE username = ?');
            $stmt->execute([$password_hash, $username]);
            
            echo "<div class='success'>";
            echo "<strong>✅ Contraseña actualizada correctamente</strong><br>";
            echo "Ya puedes iniciar sesión con:<br>";
            echo "Usuario: <code>$username</code><br>";
            echo "Contraseña: <code>$password</code>";
            echo "</div>";
        }
        
    } else {
        // Insertar nuevo usuario
        $stmt = $db->prepare('
            INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol, activo, fecha_creacion)
            VALUES (?, ?, ?, ?, ?, 1, NOW())
        ');
        
        $stmt->execute([$username, $email, $password_hash, $nombre_completo, $rol]);
        
        echo "<div class='success'>";
        echo "<strong>✅ Usuario creado exitosamente</strong><br>";
        echo "ID: " . $db->lastInsertId() . "<br><br>";
        echo "<strong>Credenciales de acceso:</strong><br>";
        echo "Usuario: <code>$username</code><br>";
        echo "Contraseña: <code>$password</code><br><br>";
        echo "<a href='https://saggarage.com.mx/gestion' class='btn'>Ir al Login</a>";
        echo "</div>";
        
        // Verificar inserción
        $stmt = $db->prepare('SELECT * FROM usuarios WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<div class='info'>";
        echo "<strong>📋 Datos guardados en la base de datos:</strong>";
        echo "<pre>" . print_r($user, true) . "</pre>";
        echo "</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<strong>❌ Error:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>Archivo:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Línea:</strong> " . $e->getLine();
    echo "</div>";
    
    echo "<div class='info'>";
    echo "<strong>💡 Solución alternativa:</strong><br>";
    echo "Ejecuta este SQL manualmente en phpMyAdmin:";
    echo "</div>";
    
    echo "<pre>";
    echo "INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol, activo, fecha_creacion)\n";
    echo "VALUES (\n";
    echo "    '$username',\n";
    echo "    '$email',\n";
    echo "    '$password_hash',\n";
    echo "    '$nombre_completo',\n";
    echo "    '$rol',\n";
    echo "    1,\n";
    echo "    NOW()\n";
    echo ");\n";
    echo "</pre>";
}

echo "
    </div>
</body>
</html>";
?>