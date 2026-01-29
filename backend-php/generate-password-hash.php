<?php
/**
 * Script para generar hashes de contraseñas
 * Uso: php generate-password-hash.php
 */

// Configurar la contraseña que quieres hashear
$password = '050899';

// Generar hash con bcrypt (cost 10)
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

echo "\n";
echo "===========================================\n";
echo "GENERADOR DE HASH DE CONTRASEÑA\n";
echo "===========================================\n";
echo "\n";
echo "Contraseña: " . $password . "\n";
echo "Hash generado:\n";
echo $hash . "\n";
echo "\n";
echo "===========================================\n";
echo "\n";
echo "INSERT SQL:\n";
echo "INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol, activo)\n";
echo "VALUES ('saggarage', '$hash', 'SAG Garage Usuario', 'saggarage@saggarage.com', 'admin', 1);\n";
echo "\n";
echo "===========================================\n";
echo "\n";

// Verificar que el hash funciona
if (password_verify($password, $hash)) {
    echo "✅ Verificación: El hash es válido\n";
} else {
    echo "❌ Error: El hash NO es válido\n";
}
echo "\n";
?>