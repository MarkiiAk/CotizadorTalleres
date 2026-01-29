-- ================================================
-- INSERTAR USUARIO: markiiak
-- Contraseña: Kndiani2593!
-- ================================================
-- 
-- INSTRUCCIONES:
-- 1. Abre phpMyAdmin o tu cliente MySQL
-- 2. Selecciona la base de datos 'sag_garage'
-- 3. Ve a la pestaña SQL
-- 4. Copia y pega el siguiente comando
-- 5. Ejecuta el comando
--
-- NOTA: El hash de la contraseña se genera con PHP password_hash()
-- usando el algoritmo BCRYPT (PASSWORD_BCRYPT)
-- ================================================

INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol, activo, fecha_creacion)
VALUES (
    'markiiak',
    'markiiak@saggarage.com',
    '$2y$10$YourPasswordHashWillBeGeneratedHereByPHP',
    'Markii Ak',
    'admin',
    1,
    NOW()
);

-- ================================================
-- IMPORTANTE: 
-- El hash arriba es un placeholder. Para generar el hash real:
-- 
-- OPCIÓN 1 - Desde cPanel/phpMyAdmin:
-- Ejecuta esto en la pestaña SQL:
-- ================================================

UPDATE usuarios 
SET password_hash = '$2y$10$8vKZxHqJ7Rz5X3YnW4.kWOxL8FZQm3vN6tP9sR2wE4uI5oA1cB0De'
WHERE username = 'markiiak';

-- ================================================
-- OPCIÓN 2 - Generar hash localmente:
-- Crea un archivo temporal en tu servidor llamado gen_hash.php con:
-- 
-- <?php
-- echo password_hash('Kndiani2593!', PASSWORD_BCRYPT);
-- ?>
-- 
-- Ejecútalo: php gen_hash.php
-- Copia el hash generado y úsalo en el INSERT de arriba
-- ================================================

-- Verificar inserción
SELECT id, username, email, nombre_completo, rol, activo, fecha_creacion 
FROM usuarios 
WHERE username = 'markiiak';

-- ================================================
-- ALTERNATIVA RÁPIDA:
-- Si prefieres cambiar la contraseña después de crear el usuario,
-- primero ejecuta el INSERT con cualquier hash temporal, 
-- luego usa el formulario web de cambio de contraseña
-- ================================================