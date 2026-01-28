-- =====================================================
-- AGREGAR CAMPO 'tipo' A servicios_orden
-- Para distinguir entre 'servicio' y 'mano_obra'
-- =====================================================

-- IMPORTANTE: Ejecutar en phpMyAdmin de cPanel
-- Base de datos: saggarag_GestionPresupuestos

USE saggarag_GestionPresupuestos;

-- Agregar campo 'tipo' para distinguir servicios de mano de obra
ALTER TABLE servicios_orden 
ADD COLUMN tipo ENUM('servicio', 'mano_obra') DEFAULT 'mano_obra' 
AFTER orden_id;

-- Verificar que se agregó correctamente
DESCRIBE servicios_orden;

-- =====================================================
-- ✅ Después de ejecutar este script:
-- 1. Actualiza el código backend PHP para guardar el tipo
-- 2. Prueba crear/editar órdenes
-- =====================================================