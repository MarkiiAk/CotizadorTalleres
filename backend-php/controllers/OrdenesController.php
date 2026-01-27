<?php
/**
 * Controlador de órdenes de servicio
 * Basado en database-schema.sql REAL
 */

class OrdenesController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtener todas las órdenes - GET /api/ordenes
     */
    public function getAll() {
        try {
            requireAuth();
            
            $stmt = $this->db->query('
                SELECT o.*, 
                       c.nombre as cliente_nombre,
                       c.telefono as cliente_telefono,
                       v.marca, v.modelo, v.anio, v.placas
                FROM ordenes_servicio o
                LEFT JOIN clientes c ON o.cliente_id = c.id
                LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
                ORDER BY o.fecha_ingreso DESC
            ');
            
            $ordenes = $stmt->fetchAll();
            
            // Procesar cada orden para incluir datos relacionados
            foreach ($ordenes as &$orden) {
                $orden = $this->enrichOrdenData($orden);
            }
            
            echo json_encode($ordenes);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener órdenes',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Obtener una orden por ID - GET /api/ordenes/:id
     */
    public function getById($id) {
        try {
            requireAuth();
            
            $stmt = $this->db->prepare('
                SELECT o.*, 
                       c.nombre as cliente_nombre,
                       c.telefono as cliente_telefono,
                       c.email as cliente_email,
                       c.direccion as cliente_direccion,
                       v.marca, v.modelo, v.anio, v.placas, v.color
                FROM ordenes_servicio o
                LEFT JOIN clientes c ON o.cliente_id = c.id
                LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
                WHERE o.id = ?
            ');
            $stmt->execute([$id]);
            $orden = $stmt->fetch();
            
            if (!$orden) {
                http_response_code(404);
                echo json_encode(['error' => 'Orden no encontrada']);
                return;
            }
            
            $orden = $this->enrichOrdenData($orden);
            
            echo json_encode($orden);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener orden',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Crear nueva orden - POST /api/ordenes
     */
    public function create() {
        try {
            $userData = requireAuth();
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Iniciar transacción
            $this->db->beginTransaction();
            
            // 1. Insertar o actualizar cliente
            $cliente_id = $this->upsertCliente($data['cliente']);
            
            // 2. Insertar o actualizar vehículo
            $vehiculo_id = $this->upsertVehiculo($data['vehiculo'], $cliente_id);
            
            // 3. Generar numero_orden
            $numero_orden = $this->generateNumeroOrden();
            
            // 4. Preparar datos de inspección desde frontend
            $inspeccionData = $data['inspeccion'] ?? [];
            $exteriores = $inspeccionData['exteriores'] ?? [];
            $interiores = $inspeccionData['interiores'] ?? [];
            
            // 5. Insertar orden con TODOS los campos del schema
            $stmt = $this->db->prepare('
                INSERT INTO ordenes_servicio (
                    numero_orden, cliente_id, vehiculo_id, usuario_id,
                    problema_reportado,
                    nivel_combustible,
                    tiene_radio, tiene_encendedor, tiene_gato,
                    tiene_llanta_refaccion, tiene_herramienta, tiene_antena,
                    tiene_tapetes, tiene_extinguidor, tiene_documentos,
                    subtotal_mano_obra, subtotal_refacciones, total,
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $vehiculoData = $data['vehiculo'] ?? [];
            $resumenData = $data['resumen'] ?? [];
            
            $stmt->execute([
                $numero_orden,
                $cliente_id,
                $vehiculo_id,
                $userData['userId'],
                $data['problemaReportado'] ?? '',
                $vehiculoData['nivelGasolina'] ?? 0,
                isset($interiores['radio']) && $interiores['radio'] ? 1 : 0,
                isset($interiores['encendedor']) && $interiores['encendedor'] ? 1 : 0,
                isset($exteriores['gato']) && $exteriores['gato'] ? 1 : 0,
                isset($exteriores['llantaRefaccion']) && $exteriores['llantaRefaccion'] ? 1 : 0,
                isset($exteriores['herramienta']) && $exteriores['herramienta'] ? 1 : 0,
                isset($exteriores['antena']) && $exteriores['antena'] ? 1 : 0,
                isset($interiores['tapetes']) && $interiores['tapetes'] ? 1 : 0,
                isset($exteriores['extinguidor']) && $exteriores['extinguidor'] ? 1 : 0,
                isset($interiores['documentos']) && $interiores['documentos'] ? 1 : 0,
                $resumenData['subtotalManoObra'] ?? 0,
                $resumenData['subtotalRefacciones'] ?? 0,
                $resumenData['total'] ?? 0,
                'abierta'
            ]);
            
            $orden_id = $this->db->lastInsertId();
            
            // 6. Insertar servicios/mano de obra en servicios_orden
            if (isset($data['manoDeObra']) && !empty($data['manoDeObra'])) {
                $this->insertServiciosOrden($orden_id, $data['manoDeObra']);
            }
            
            // 7. Insertar refacciones en refacciones_orden
            if (isset($data['refacciones']) && !empty($data['refacciones'])) {
                $this->insertRefaccionesOrden($orden_id, $data['refacciones']);
            }
            
            // Commit transacción
            $this->db->commit();
            
            // Retornar orden completa
            http_response_code(201);
            $this->getById($orden_id);
            
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al crear orden',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Actualizar orden - PUT /api/ordenes/:id
     */
    public function update($id) {
        try {
            $userData = requireAuth();
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Verificar que la orden existe
            $stmt = $this->db->prepare('SELECT id FROM ordenes_servicio WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Orden no encontrada']);
                return;
            }
            
            // Iniciar transacción
            $this->db->beginTransaction();
            
            // Actualizar campos si se enviaron
            $updateFields = [];
            $updateValues = [];
            
            if (isset($data['diagnostico'])) {
                $updateFields[] = 'diagnostico = ?';
                $updateValues[] = $data['diagnostico'];
            }
            if (isset($data['estado'])) {
                $updateFields[] = 'estado = ?';
                $updateValues[] = $data['estado'];
            }
            if (isset($data['resumen']['total'])) {
                $updateFields[] = 'total = ?';
                $updateValues[] = $data['resumen']['total'];
            }
            
            if (!empty($updateFields)) {
                $updateValues[] = $id;
                $sql = 'UPDATE ordenes_servicio SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
                $stmt = $this->db->prepare($sql);
                $stmt->execute($updateValues);
            }
            
            // Actualizar servicios y refacciones si se enviaron
            if (isset($data['manoDeObra'])) {
                $this->db->prepare('DELETE FROM servicios_orden WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['manoDeObra'])) {
                    $this->insertServiciosOrden($id, $data['manoDeObra']);
                }
            }
            
            if (isset($data['refacciones'])) {
                $this->db->prepare('DELETE FROM refacciones_orden WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['refacciones'])) {
                    $this->insertRefaccionesOrden($id, $data['refacciones']);
                }
            }
            
            $this->db->commit();
            
            // Retornar orden actualizada
            $this->getById($id);
            
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al actualizar orden',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Eliminar orden - DELETE /api/ordenes/:id
     */
    public function delete($id) {
        try {
            requireAuth();
            
            $stmt = $this->db->prepare('DELETE FROM ordenes_servicio WHERE id = ?');
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Orden no encontrada']);
                return;
            }
            
            http_response_code(204);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al eliminar orden',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private function enrichOrdenData($orden) {
        // Obtener servicios/mano de obra
        $stmt = $this->db->prepare('SELECT * FROM servicios_orden WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['manoDeObra'] = $stmt->fetchAll();
        
        // Obtener refacciones
        $stmt = $this->db->prepare('SELECT * FROM refacciones_orden WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['refacciones'] = $stmt->fetchAll();
        
        return $orden;
    }
    
    private function upsertCliente($clienteData) {
        $nombre = $clienteData['nombreCompleto'] ?? $clienteData['nombre'] ?? null;
        $telefono = $clienteData['telefono'] ?? null;
        $email = $clienteData['email'] ?? null;
        $direccion = $clienteData['domicilio'] ?? $clienteData['direccion'] ?? null;
        
        if (!$nombre || !$telefono) {
            throw new Exception('Nombre y teléfono del cliente son requeridos');
        }
        
        // Buscar cliente existente por teléfono
        $stmt = $this->db->prepare('SELECT id FROM clientes WHERE telefono = ? LIMIT 1');
        $stmt->execute([$telefono]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Actualizar
            $stmt = $this->db->prepare('
                UPDATE clientes SET nombre = ?, email = ?, direccion = ?
                WHERE id = ?
            ');
            $stmt->execute([$nombre, $email, $direccion, $existing['id']]);
            return $existing['id'];
        } else {
            // Insertar
            $stmt = $this->db->prepare('
                INSERT INTO clientes (nombre, telefono, email, direccion)
                VALUES (?, ?, ?, ?)
            ');
            $stmt->execute([$nombre, $telefono, $email, $direccion]);
            return $this->db->lastInsertId();
        }
    }
    
    private function upsertVehiculo($vehiculoData, $cliente_id) {
        $marca = $vehiculoData['marca'] ?? null;
        $modelo = $vehiculoData['modelo'] ?? null;
        $anio = $vehiculoData['anio'] ?? null;
        $color = $vehiculoData['color'] ?? null;
        $placas = $vehiculoData['placas'] ?? null;
        
        if (!$marca || !$modelo || !$placas) {
            throw new Exception('Marca, modelo y placas del vehículo son requeridos');
        }
        
        // Buscar vehículo existente por placas
        $stmt = $this->db->prepare('SELECT id FROM vehiculos WHERE placas = ? LIMIT 1');
        $stmt->execute([$placas]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Actualizar
            $stmt = $this->db->prepare('
                UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, 
                       color = ?, cliente_id = ?
                WHERE id = ?
            ');
            $stmt->execute([$marca, $modelo, $anio, $color, $cliente_id, $existing['id']]);
            return $existing['id'];
        } else {
            // Insertar
            $stmt = $this->db->prepare('
                INSERT INTO vehiculos (marca, modelo, anio, color, placas, cliente_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$marca, $modelo, $anio, $color, $placas, $cliente_id]);
            return $this->db->lastInsertId();
        }
    }
    
    private function insertServiciosOrden($orden_id, $servicios) {
        $stmt = $this->db->prepare('
            INSERT INTO servicios_orden (orden_id, descripcion, precio_unitario, cantidad, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($servicios as $servicio) {
            $cantidad = $servicio['horas'] ?? $servicio['cantidad'] ?? 1;
            $precioUnitario = $servicio['precio'] ?? $servicio['precio_unitario'] ?? 0;
            $subtotal = $cantidad * $precioUnitario;
            
            $stmt->execute([
                $orden_id,
                $servicio['descripcion'],
                $precioUnitario,
                $cantidad,
                $subtotal
            ]);
        }
    }
    
    private function insertRefaccionesOrden($orden_id, $refacciones) {
        $stmt = $this->db->prepare('
            INSERT INTO refacciones_orden (orden_id, descripcion, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($refacciones as $refaccion) {
            $cantidad = $refaccion['cantidad'] ?? 1;
            $precioUnitario = $refaccion['precioVenta'] ?? $refaccion['precio_unitario'] ?? 0;
            $subtotal = $refaccion['total'] ?? ($cantidad * $precioUnitario);
            
            $stmt->execute([
                $orden_id,
                $refaccion['nombre'] ?? $refaccion['descripcion'],
                $cantidad,
                $precioUnitario,
                $subtotal
            ]);
        }
    }
    
    private function generateNumeroOrden() {
        $prefix = 'OS-';
        $year = date('Y');
        $month = date('m');
        
        // Obtener el último numero_orden del mes
        $stmt = $this->db->prepare("
            SELECT numero_orden FROM ordenes_servicio 
            WHERE numero_orden LIKE ? 
            ORDER BY id DESC 
            LIMIT 1
        ");
        $stmt->execute([$prefix . $year . $month . '%']);
        $lastOrden = $stmt->fetchColumn();
        
        if ($lastOrden) {
            // Extraer número del final
            preg_match('/-(\d+)$/', $lastOrden, $matches);
            $lastNumber = isset($matches[1]) ? (int)$matches[1] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . $year . $month . '-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}