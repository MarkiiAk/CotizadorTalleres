-- =====================================================
-- AGREGAR CAMPOS DE INSPECCIÓN FALTANTES
-- Ejecuta esto en phpMyAdmin -> SQL
-- =====================================================

USE saggarag_GestionPresupuestos;

-- Agregar campos de EXTERIORES que faltan
ALTER TABLE ordenes_servicio
ADD COLUMN IF NOT EXISTS tiene_luces_frontales BOOLEAN DEFAULT TRUE AFTER nivel_combustible,
ADD COLUMN IF NOT EXISTS tiene_cuarto_luces BOOLEAN DEFAULT TRUE AFTER tiene_luces_frontales,
ADD COLUMN IF NOT EXISTS tiene_espejos_laterales BOOLEAN DEFAULT TRUE AFTER tiene_antena,
ADD COLUMN IF NOT EXISTS tiene_cristales BOOLEAN DEFAULT TRUE AFTER tiene_espejos_laterales,
ADD COLUMN IF NOT EXISTS tiene_emblemas BOOLEAN DEFAULT TRUE AFTER tiene_cristales,
ADD COLUMN IF NOT EXISTS tiene_llantas BOOLEAN DEFAULT TRUE AFTER tiene_emblemas,
ADD COLUMN IF NOT EXISTS tiene_tapon_ruedas BOOLEAN DEFAULT TRUE AFTER tiene_llanta_refaccion,
ADD COLUMN IF NOT EXISTS tiene_molduras_completas BOOLEAN DEFAULT TRUE AFTER tiene_tapon_ruedas,
ADD COLUMN IF NOT EXISTS tiene_tapon_gasolina BOOLEAN DEFAULT TRUE AFTER tiene_molduras_completas,
ADD COLUMN IF NOT EXISTS tiene_limpiadores BOOLEAN DEFAULT TRUE AFTER tiene_tapon_gasolina;

-- Agregar campos de INTERIORES que faltan
ALTER TABLE ordenes_servicio
ADD COLUMN IF NOT EXISTS tiene_instrumento_tablero BOOLEAN DEFAULT TRUE AFTER tiene_documentos,
ADD COLUMN IF NOT EXISTS tiene_calefaccion BOOLEAN DEFAULT TRUE AFTER tiene_instrumento_tablero,
ADD COLUMN IF NOT EXISTS tiene_sistema_sonido BOOLEAN DEFAULT TRUE AFTER tiene_calefaccion,
ADD COLUMN IF NOT EXISTS tiene_bocinas BOOLEAN DEFAULT TRUE AFTER tiene_sistema_sonido,
ADD COLUMN IF NOT EXISTS tiene_espejo_retrovisor BOOLEAN DEFAULT TRUE AFTER tiene_bocinas,
ADD COLUMN IF NOT EXISTS tiene_cinturones BOOLEAN DEFAULT TRUE AFTER tiene_espejo_retrovisor,
ADD COLUMN IF NOT EXISTS tiene_botonia_general BOOLEAN DEFAULT TRUE AFTER tiene_cinturones,
ADD COLUMN IF NOT EXISTS tiene_manijas BOOLEAN DEFAULT TRUE AFTER tiene_botonia_general,
ADD COLUMN IF NOT EXISTS tiene_vestiduras BOOLEAN DEFAULT TRUE AFTER tiene_tapetes,
ADD COLUMN IF NOT EXISTS tiene_otros BOOLEAN DEFAULT TRUE AFTER tiene_vestiduras;

-- =====================================================
-- ✅ CAMPOS AGREGADOS EXITOSAMENTE
-- =====================================================

-- Para verificar los nuevos campos:
-- DESCRIBE ordenes_servicio;