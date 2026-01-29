<?php
// Script temporal para generar hash de contraseña
$password = 'Kndiani2593!';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "================================================\n";
echo "GENERADOR DE USUARIO - MARKIIAK\n";
echo "================================================\n\n";
echo "Contraseña: $password\n";
echo "Hash: $hash\n\n";

// Generar el INSERT statement
$sql = "-- ================================================
-- INSERTAR USUARIO: markiiak
-- Contraseña: Kndiani2593!
-- ================================================

INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol, activo, fecha_creacion)
VALUES (
    'markiiak',
    'markiiak@saggarage.com',
    '$hash',
    'Markii Ak',
    'admin',
    1,
    NOW()
);

-- Verificar inserción
SELECT id, username, email, nombre_completo, rol, activo, fecha_creacion 
FROM usuarios 
WHERE username = 'markiiak';
";

echo "SQL GENERADO:\n";
echo "================================================\n";
echo $sql;
echo "================================================\n\n";

// Guardar en archivo
$filename = 'AGREGAR-USUARIO-MARKIIAK.sql';
file_put_contents($filename, $sql);
echo "✅ Archivo guardado: $filename\n";
?>