a-- Script para insertar usuario markiiak en la base de datos
-- Ejecutar en phpMyAdmin o MySQL CLI

USE saggarag_GestionPresupuestos;

-- Insertar usuario markiiak
-- Password: kndiani2593! (hasheado con bcrypt)
INSERT INTO users (email, password, name, role, created_at) 
VALUES (
    'markiiak@saggarage.com',
    '$2y$10$8ZqVZ5fYHxKvP7iJ0QwMZeX5Y9mKNhLvRwJ1pQ2sT3uV4wX5yZ6aO',
    'Markii AK',
    'admin',
    NOW()
);

-- Verificar que se insertó correctamente
SELECT * FROM users WHERE email = 'markiiak@saggarage.com';

-- NOTA: Si ya existe este usuario, primero bórralo con:
-- DELETE FROM users WHERE email = 'markiiak@saggarage.com';