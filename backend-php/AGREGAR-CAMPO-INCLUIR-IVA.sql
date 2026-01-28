-- =====================================================
-- AGREGAR CAMPOS DE RESUMEN COMPLETO A ordenes_servicio
-- Para guardar incluirIVA y subtotales de servicios
-- =====================================================

-- IMPORTANTE: Ejecutar en phpMyAdmin de cPanel
-- Base de datos: saggarag_GestionPresupuestos

USE saggarag_GestionPresupuestos;

-- 1. Agregar campo para saber si incluye IVA
ALTER TABLE ordenes_servicio 
ADD COLUMN incluir_iva TINYINT(1) DEFAULT 0 
AFTER descuento;

-- 2. Agregar campo para subtotal de servicios (separado de mano de obra)
ALTER TABLE ordenes_servicio 
ADD COLUMN subtotal_servicios DECIMAL(10,2) DEFAULT 0.00 
AFTER subtotal_mano_obra;

-- 3. Agregar campo para anticipo
ALTER TABLE ordenes_servicio 
ADD COLUMN anticipo DECIMAL(10,2) DEFAULT 0.00 
AFTER total;

-- Verificar que se agregaron correctamente
DESCRIBE ordenes_servicio;

-- =====================================================
-- ✅ Después de ejecutar este script:
-- 1. El backend podrá guardar si incluye IVA o no
-- 2. El GET devolverá incluirIVA correctamente
-- 3. El checkbox se mostrará palomeado cuando corresponda
-- =====================================================