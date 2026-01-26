-- =====================================================
-- CREAR TABLAS PARA SAG GARAGE EN CPANEL
-- Base de datos: saggarag_GestionPresupuestos
-- =====================================================

-- IMPORTANTE: Ejecuta este script en phpMyAdmin de cPanel
-- Ve a phpMyAdmin -> Selecciona la base de datos -> SQL -> Pega este código

USE saggarag_GestionPresupuestos;

-- =====================================================
-- 1. TABLA: clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABLA: vehiculos
-- =====================================================
CREATE TABLE IF NOT EXISTS vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio YEAR,
    color VARCHAR(50),
    placas VARCHAR(20),
    vin VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id),
    INDEX idx_placas (placas)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABLA: ordenes (PRINCIPAL)
-- =====================================================
CREATE TABLE IF NOT EXISTS ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folio VARCHAR(50) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    
    -- Fechas
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_salida DATETIME NULL,
    
    -- Datos del vehículo al ingresar
    kilometraje INT,
    nivel_gasolina DECIMAL(5,2),
    
    -- Problema y diagnóstico
    problema_reportado TEXT,
    observaciones_iniciales TEXT,
    diagnostico TEXT,
    recomendaciones TEXT,
    
    -- Estado y totales
    estado ENUM('abierta', 'en_proceso', 'cerrada', 'entregada') DEFAULT 'abierta',
    total DECIMAL(10,2) DEFAULT 0.00,
    
    -- Auditoría
    created_by INT NOT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE RESTRICT,
    
    INDEX idx_folio (folio),
    INDEX idx_cliente (cliente_id),
    INDEX idx_vehiculo (vehiculo_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_ingreso (fecha_ingreso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABLA: inspeccion_visual
-- =====================================================
CREATE TABLE IF NOT EXISTS inspeccion_visual (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    item VARCHAR(100) NOT NULL,
    estado ENUM('bueno', 'regular', 'malo', 'no_aplica') DEFAULT 'bueno',
    observaciones TEXT,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABLA: servicios
-- =====================================================
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cantidad INT DEFAULT 1,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABLA: refacciones
-- =====================================================
CREATE TABLE IF NOT EXISTS refacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(8,2) NOT NULL DEFAULT 1.00,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABLA: mano_obra
-- =====================================================
CREATE TABLE IF NOT EXISTS mano_obra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    horas DECIMAL(8,2) NOT NULL DEFAULT 1.00,
    precio_hora DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ✅ TABLAS CREADAS EXITOSAMENTE
-- =====================================================

-- Para verificar que todo se creó correctamente, ejecuta:
-- SHOW TABLES;