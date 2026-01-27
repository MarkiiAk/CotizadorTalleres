-- =====================================================
-- SCHEMA COMPLETO PARA SAG GARAGE - GESTIÓN DE PRESUPUESTOS
-- Base de datos: saggarag_GestionPresupuestos
-- =====================================================

-- Usar la base de datos
USE saggarag_GestionPresupuestos;

-- =====================================================
-- TABLA 1: usuarios
-- Gestión de usuarios del sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(200),
    email VARCHAR(150) UNIQUE,
    rol ENUM('admin', 'tecnico', 'recepcionista') DEFAULT 'tecnico',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 2: clientes
-- Información de los clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    rfc VARCHAR(20),
    notas TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_visita TIMESTAMP NULL,
    
    INDEX idx_nombre (nombre),
    INDEX idx_telefono (telefono),
    INDEX idx_email (email),
    FULLTEXT idx_busqueda (nombre, telefono, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 3: vehiculos
-- Información de los vehículos
-- =====================================================
CREATE TABLE IF NOT EXISTS vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio YEAR,
    color VARCHAR(50),
    numero_serie VARCHAR(50),
    placas VARCHAR(20),
    kilometraje INT,
    tipo_combustible ENUM('gasolina', 'diesel', 'electrico', 'hibrido'),
    numero_cilindros INT,
    transmision ENUM('manual', 'automatica'),
    notas TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id),
    INDEX idx_placas (placas),
    INDEX idx_marca_modelo (marca, modelo),
    FULLTEXT idx_busqueda (marca, modelo, placas, numero_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 4: ordenes_servicio
-- Órdenes de servicio principales
-- =====================================================
CREATE TABLE IF NOT EXISTS ordenes_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_orden VARCHAR(50) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    
    -- Información del problema
    problema_reportado TEXT NOT NULL,
    diagnostico TEXT,
    
{error: "Error al crear orden",…}
error
: 
"Error al crear orden"
message
: 
"SQLSTATE[42S22]: Column not found: 1054 Unknown column 'folio' in 'SELECT'"
    -- Datos de inspección
    nivel_combustible DECIMAL(5,2) DEFAULT 0,
    tiene_radio BOOLEAN DEFAULT FALSE,
    tiene_encendedor BOOLEAN DEFAULT FALSE,
    tiene_gato BOOLEAN DEFAULT FALSE,
    tiene_llanta_refaccion BOOLEAN DEFAULT FALSE,
    tiene_herramienta BOOLEAN DEFAULT FALSE,
    tiene_antena BOOLEAN DEFAULT FALSE,
    tiene_tapetes BOOLEAN DEFAULT FALSE,
    tiene_extinguidor BOOLEAN DEFAULT FALSE,
    tiene_documentos BOOLEAN DEFAULT FALSE,
    objetos_valor TEXT,
    
    -- Totales
    subtotal_mano_obra DECIMAL(10,2) DEFAULT 0.00,
    subtotal_refacciones DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    iva DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) DEFAULT 0.00,
    
    -- Estado y fechas
    estado ENUM('pendiente', 'en_proceso', 'completada', 'cancelada', 'entregada') DEFAULT 'pendiente',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_promesa_entrega TIMESTAMP NULL,
    fecha_completada TIMESTAMP NULL,
    fecha_entregada TIMESTAMP NULL,
    
    -- Garantía
    garantia_dias INT DEFAULT 30,
    garantia_observaciones TEXT,
    
    -- Notas adicionales
    notas_internas TEXT,
    observaciones_cliente TEXT,
    
    ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    
    INDEX idx_numero_orden (numero_orden),
    INDEX idx_cliente (cliente_id),
    INDEX idx_vehiculo (vehiculo_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_ingreso (fecha_ingreso),
    INDEX idx_fecha_promesa (fecha_promesa_entrega),
    FULLTEXT idx_busqueda (numero_orden, problema_reportado, diagnostico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 5: servicios_predefinidos
-- Catálogo de servicios comunes
-- =====================================================
CREATE TABLE IF NOT EXISTS servicios_predefinidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_sugerido DECIMAL(10,2) DEFAULT 0.00,
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    FULLTEXT idx_busqueda (nombre, descripcion, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 6: servicios_orden
-- Servicios/Mano de obra aplicados a una orden
-- =====================================================
CREATE TABLE IF NOT EXISTS servicios_orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad DECIMAL(8,2) DEFAULT 1.00,
    subtotal DECIMAL(10,2) NOT NULL,
    notas TEXT,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 7: refacciones_orden
-- Refacciones/Piezas aplicadas a una orden
-- =====================================================
CREATE TABLE IF NOT EXISTS refacciones_orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(8,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    numero_parte VARCHAR(100),
    proveedor VARCHAR(200),
    notas TEXT,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    INDEX idx_orden (orden_id),
    INDEX idx_numero_parte (numero_parte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 8: historial_cambios
-- Auditoría de cambios en las órdenes
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_cambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_cambio ENUM('creacion', 'modificacion', 'cambio_estado', 'eliminacion') NOT NULL,
    campo_modificado VARCHAR(100),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    descripcion TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_orden (orden_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_cambio),
    INDEX idx_tipo (tipo_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 9: pagos
-- Registro de pagos recibidos
-- =====================================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'cheque', 'otro') NOT NULL,
    referencia VARCHAR(100),
    notas TEXT,
    usuario_registro_id INT NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_orden (orden_id),
    INDEX idx_fecha (fecha_pago),
    INDEX idx_metodo (metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA 10: configuracion_sistema
-- Configuraciones generales del sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    tipo_dato ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    descripcion TEXT,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol) 
VALUES ('admin', '$2b$10$rKzWzW5h0qF4kYxKx0qF5OqF5OqF5OqF5OqF5OqF5OqF5OqF5Oq', 'Administrador SAG', 'admin@saggarage.com', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Insertar servicios predefinidos comunes
INSERT INTO servicios_predefinidos (nombre, descripcion, precio_sugerido, categoria) VALUES
('Cambio de aceite', 'Cambio de aceite y filtro', 350.00, 'Mantenimiento'),
('Afinación menor', 'Cambio de bujías y filtros básicos', 800.00, 'Mantenimiento'),
('Afinación mayor', 'Afinación completa con cambio de componentes', 1500.00, 'Mantenimiento'),
('Balanceo y rotación', 'Balanceo y rotación de llantas', 400.00, 'Llantas'),
('Alineación', 'Alineación y balanceo', 500.00, 'Llantas'),
('Cambio de frenos', 'Cambio de balatas o pastillas', 600.00, 'Frenos'),
('Diagnóstico computarizado', 'Escaneo de códigos de error', 200.00, 'Diagnóstico'),
('Cambio de batería', 'Instalación de batería nueva', 100.00, 'Eléctrico'),
('Reparación de suspensión', 'Reparación de amortiguadores', 1200.00, 'Suspensión'),
('Servicio de aire acondicionado', 'Recarga y mantenimiento de A/C', 800.00, 'Clima')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Insertar configuraciones iniciales
INSERT INTO configuracion_sistema (clave, valor, tipo_dato, descripcion) VALUES
('iva_porcentaje', '16', 'number', 'Porcentaje de IVA a aplicar'),
('garantia_dias_default', '30', 'number', 'Días de garantía por defecto'),
('nombre_taller', 'SAG GARAGE', 'string', 'Nombre del taller'),
('direccion_taller', '', 'string', 'Dirección del taller'),
('telefono_taller', '', 'string', 'Teléfono del taller'),
('email_taller', 'contacto@saggarage.com', 'string', 'Email del taller'),
('formato_numero_orden', 'OS-{YEAR}{MONTH}-{NUMBER}', 'string', 'Formato para números de orden')
ON DUPLICATE KEY UPDATE clave = clave;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para órdenes con información completa
CREATE OR REPLACE VIEW vista_ordenes_completa AS
SELECT 
    o.id,
    o.numero_orden,
    o.fecha_ingreso,
    o.fecha_promesa_entrega,
    o.estado,
    o.total,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    v.marca AS vehiculo_marca,
    v.modelo AS vehiculo_modelo,
    v.anio AS vehiculo_anio,
    v.placas AS vehiculo_placas,
    u.nombre_completo AS usuario_nombre,
    o.problema_reportado
FROM ordenes_servicio o
INNER JOIN clientes c ON o.cliente_id = c.id
INNER JOIN vehiculos v ON o.vehiculo_id = v.id
INNER JOIN usuarios u ON o.usuario_id = u.id;

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
