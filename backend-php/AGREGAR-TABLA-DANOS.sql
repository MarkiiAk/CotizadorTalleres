-- =====================================================
-- AGREGAR TABLA PARA DAÑOS ADICIONALES DEL VEHÍCULO
-- Ejecuta esto en phpMyAdmin -> SQL
-- =====================================================

USE saggarag_GestionPresupuestos;

-- Crear tabla para daños adicionales
CREATE TABLE IF NOT EXISTS danos_vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ✅ TABLA CREADA EXITOSAMENTE
-- =====================================================

-- Para verificar:
-- DESCRIBE danos_vehiculo;