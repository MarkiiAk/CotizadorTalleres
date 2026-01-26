-- Script para insertar usuario markiiak en la base de datos
-- Ejecutar en phpMyAdmin o MySQL CLI

USE saggarag_GestionPresupuestos;

-- Insertar usuario markiiak
-- Username: markiiak
-- Password: kndiani2593! (hasheado con bcrypt)
INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol, activo, fecha_creacion) 
VALUES (
    'markiiak',
    '$2y$10$8ZqVZ5fYHxKvP7iJ0QwMZeX5Y9mKNhLvRwJ1pQ2sT3uV4wX5yZ6aO',
    'Markii AK',
    'markiiak@saggarage.com',
    'admin',
    TRUE,
    NOW()
);

-- Verificar que se insertó correctamente
SELECT * FROM usuarios WHERE username = 'markiiak';

-- NOTA: Si ya existe este usuario, primero bórralo con:
-- DELETE FROM usuarios WHERE username = 'markiiak';