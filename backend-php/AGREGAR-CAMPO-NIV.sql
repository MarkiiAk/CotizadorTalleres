-- ================================================================
-- Script para agregar campo NIV (Número de Identificación Vehicular)
-- a la tabla ordenes_servicio
-- ================================================================
-- Fecha: 2026-01-30
-- Descripción: Agrega columna 'niv' para almacenar el VIN del vehículo
-- ================================================================

-- Agregar columna NIV a la tabla ordenes_servicio
ALTER TABLE ordenes_servicio
ADD COLUMN niv VARCHAR(17) NULL COMMENT 'Número de Identificación Vehicular (VIN)' AFTER placas;

-- Verificar que se agregó correctamente
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'ordenes_servicio'
    AND COLUMN_NAME = 'niv';

-- ================================================================
-- NOTAS:
-- - El VIN estándar tiene 17 caracteres
-- - Campo opcional (NULL permitido)
-- - Posicionado después del campo 'placas' para mantener
--   agrupados todos los datos del vehículo
-- ================================================================