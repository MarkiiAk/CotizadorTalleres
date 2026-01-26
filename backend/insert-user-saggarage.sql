-- =====================================================
-- INSERTAR USUARIO: saggarage
-- Base de datos: saggarag_GestionPresupuestos
-- =====================================================

-- Usuario: saggarage
-- Contraseña: 050899
-- Rol: admin
-- Estado: activo

INSERT INTO `usuarios` (`username`, `password_hash`, `nombre_completo`, `email`, `rol`, `activo`, `fecha_creacion`, `ultima_modificacion`) 
VALUES (
    'saggarage',
    '$2b$10$QA99BEkgi1ooYWBmf.rknOQAq8TSQQegRiO7lzZOO6YH1uM.1wOC.',
    'SAG Garage Usuario',
    'saggarage@saggarage.com',
    'admin',
    1,
    NOW(),
    NOW()
);

-- =====================================================
-- VERIFICAR INSERCIÓN
-- =====================================================
-- Ejecuta este query después de insertar para verificar:
-- SELECT id, username, nombre_completo, email, rol, activo FROM usuarios WHERE username = 'saggarage';