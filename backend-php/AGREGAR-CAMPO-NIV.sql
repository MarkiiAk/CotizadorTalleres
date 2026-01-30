-- =====================================================
-- AGREGAR CAMPO NIV A TABLA VEHICULOS
-- =====================================================

-- Este script agrega el campo NIV (VIN) a la tabla vehiculos
-- Ejecutar en phpMyAdmin de cPanel

USE saggarag_GestionPresupuestos;

-- Agregar columna niv a la tabla vehiculos
ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS niv VARCHAR(50) NULL 
AFTER placas;

-- Verificar que se agregó correctamente
DESCRIBE vehiculos;

-- =====================================================
-- ✅ COLUMNA NIV AGREGADA A TABLA VEHICULOS
-- =====================================================