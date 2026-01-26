<?php
/**
 * Controlador de órdenes de servicio
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
                FROM ordenes o
                LEFT JOIN clientes c ON o.cliente_id = c.id
                LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
                ORDER BY o.created_at DESC
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
                       v.marca, v.modelo, v.anio, v.placas
                FROM ordenes o
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
            
            // 3. Generar folio
            $folio = $this->generateFolio();
            
            // 4. Insertar orden
            $stmt = $this->db->prepare('
                INSERT INTO ordenes (
                    folio, cliente_id, vehiculo_id, fecha_ingreso,
                    kilometraje, nivel_gasolina, problema_reportado,
                    observaciones_iniciales, estado, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $folio,
                $cliente_id,
                $vehiculo_id,
                $data['fecha_ingreso'] ?? date('Y-m-d H:i:s'),
                $data['kilometraje'] ?? null,
                $data['nivel_gasolina'] ?? null,
                $data['problema_reportado'] ?? '',
                $data['observaciones_iniciales'] ?? '',
                $data['estado'] ?? 'abierta',
                $userData['userId']
            ]);
            
            $orden_id = $this->db->lastInsertId();
            
            // 5. Insertar inspección visual
            if (isset($data['inspeccion']) && !empty($data['inspeccion'])) {
                $this->insertInspeccion($orden_id, $data['inspeccion']);
            }
            
            // 6. Insertar servicios
            if (isset($data['servicios']) && !empty($data['servicios'])) {
                $this->insertServicios($orden_id, $data['servicios']);
            }
            
            // 7. Insertar refacciones
            if (isset($data['refacciones']) && !empty($data['refacciones'])) {
                $this->insertRefacciones($orden_id, $data['refacciones']);
            }
            
            // 8. Insertar mano de obra
            if (isset($data['mano_obra']) && !empty($data['mano_obra'])) {
                $this->insertManoObra($orden_id, $data['mano_obra']);
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
            $stmt = $this->db->prepare('SELECT id FROM ordenes WHERE id = ?');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Orden no encontrada']);
                return;
            }
            
            // Iniciar transacción
            $this->db->beginTransaction();
            
            // 1. Actualizar cliente si cambió
            if (isset($data['cliente'])) {
                $cliente_id = $this->upsertCliente($data['cliente']);
            }
            
            // 2. Actualizar vehículo si cambió
            if (isset($data['vehiculo'])) {
                $vehiculo_id = $this->upsertVehiculo($data['vehiculo'], $cliente_id ?? null);
            }
            
            // 3. Actualizar orden
            $updateFields = [];
            $updateValues = [];
            
            $allowedFields = [
                'fecha_ingreso', 'kilometraje', 'nivel_gasolina',
                'problema_reportado', 'observaciones_iniciales',
                'diagnostico', 'recomendaciones', 'estado',
                'fecha_salida', 'total'
            ];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = ?";
                    $updateValues[] = $data[$field];
                }
            }
            
            if (!empty($updateFields)) {
                $updateValues[] = $userData['userId'];
                $updateValues[] = $id;
                
                $sql = 'UPDATE ordenes SET ' . implode(', ', $updateFields) . 
                       ', updated_by = ?, updated_at = NOW() WHERE id = ?';
                       
                $stmt = $this->db->prepare($sql);
                $stmt->execute($updateValues);
            }
            
            // 4. Actualizar datos relacionados si se enviaron
            if (isset($data['inspeccion'])) {
                $this->db->prepare('DELETE FROM inspeccion_visual WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['inspeccion'])) {
                    $this->insertInspeccion($id, $data['inspeccion']);
                }
            }
            
            if (isset($data['servicios'])) {
                $this->db->prepare('DELETE FROM servicios WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['servicios'])) {
                    $this->insertServicios($id, $data['servicios']);
                }
            }
            
            if (isset($data['refacciones'])) {
                $this->db->prepare('DELETE FROM refacciones WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['refacciones'])) {
                    $this->insertRefacciones($id, $data['refacciones']);
                }
            }
            
            if (isset($data['mano_obra'])) {
                $this->db->prepare('DELETE FROM mano_obra WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['mano_obra'])) {
                    $this->insertManoObra($id, $data['mano_obra']);
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
            
            $stmt = $this->db->prepare('DELETE FROM ordenes WHERE id = ?');
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
        // Decodificar JSON fields
        if (isset($orden['problema_reportado']) && $this->isJson($orden['problema_reportado'])) {
            $orden['problema_reportado'] = json_decode($orden['problema_reportado'], true);
        }
        
        // Obtener inspección visual
        $stmt = $this->db->prepare('SELECT * FROM inspeccion_visual WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['inspeccion'] = $stmt->fetchAll();
        
        // Obtener servicios
        $stmt = $this->db->prepare('SELECT * FROM servicios WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['servicios'] = $stmt->fetchAll();
        
        // Obtener refacciones
        $stmt = $this->db->prepare('SELECT * FROM refacciones WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['refacciones'] = $stmt->fetchAll();
        
        // Obtener mano de obra
        $stmt = $this->db->prepare('SELECT * FROM mano_obra WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['mano_obra'] = $stmt->fetchAll();
        
        return $orden;
    }
    
    private function upsertCliente($clienteData) {
        // Buscar cliente existente por teléfono
        $stmt = $this->db->prepare('SELECT id FROM clientes WHERE telefono = ? LIMIT 1');
        $stmt->execute([$clienteData['telefono']]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Actualizar
            $stmt = $this->db->prepare('
                UPDATE clientes SET nombre = ?, email = ?, direccion = ?
                WHERE id = ?
            ');
            $stmt->execute([
                $clienteData['nombre'],
                $clienteData['email'] ?? null,
                $clienteData['direccion'] ?? null,
                $existing['id']
            ]);
            return $existing['id'];
        } else {
            // Insertar
            $stmt = $this->db->prepare('
                INSERT INTO clientes (nombre, telefono, email, direccion)
                VALUES (?, ?, ?, ?)
            ');
            $stmt->execute([
                $clienteData['nombre'],
                $clienteData['telefono'],
                $clienteData['email'] ?? null,
                $clienteData['direccion'] ?? null
            ]);
            return $this->db->lastInsertId();
        }
    }
    
    private function upsertVehiculo($vehiculoData, $cliente_id) {
        // Buscar vehículo existente por placas
        $stmt = $this->db->prepare('SELECT id FROM vehiculos WHERE placas = ? LIMIT 1');
        $stmt->execute([$vehiculoData['placas']]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Actualizar
            $stmt = $this->db->prepare('
                UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, 
                       color = ?, vin = ?, cliente_id = ?
                WHERE id = ?
            ');
            $stmt->execute([
                $vehiculoData['marca'],
                $vehiculoData['modelo'],
                $vehiculoData['anio'] ?? null,
                $vehiculoData['color'] ?? null,
                $vehiculoData['vin'] ?? null,
                $cliente_id,
                $existing['id']
            ]);
            return $existing['id'];
        } else {
            // Insertar
            $stmt = $this->db->prepare('
                INSERT INTO vehiculos (marca, modelo, anio, color, placas, vin, cliente_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $vehiculoData['marca'],
                $vehiculoData['modelo'],
                $vehiculoData['anio'] ?? null,
                $vehiculoData['color'] ?? null,
                $vehiculoData['placas'],
                $vehiculoData['vin'] ?? null,
                $cliente_id
            ]);
            return $this->db->lastInsertId();
        }
    }
    
    private function insertInspeccion($orden_id, $items) {
        $stmt = $this->db->prepare('
            INSERT INTO inspeccion_visual (orden_id, item, estado, observaciones)
            VALUES (?, ?, ?, ?)
        ');
        
        foreach ($items as $item) {
            $stmt->execute([
                $orden_id,
                $item['item'],
                $item['estado'],
                $item['observaciones'] ?? null
            ]);
        }
    }
    
    private function insertServicios($orden_id, $servicios) {
        $stmt = $this->db->prepare('
            INSERT INTO servicios (orden_id, descripcion, precio, cantidad)
            VALUES (?, ?, ?, ?)
        ');
        
        foreach ($servicios as $servicio) {
            $stmt->execute([
                $orden_id,
                $servicio['descripcion'],
                $servicio['precio'] ?? 0,
                $servicio['cantidad'] ?? 1
            ]);
        }
    }
    
    private function insertRefacciones($orden_id, $refacciones) {
        $stmt = $this->db->prepare('
            INSERT INTO refacciones (orden_id, descripcion, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($refacciones as $refaccion) {
            $stmt->execute([
                $orden_id,
                $refaccion['descripcion'],
                $refaccion['cantidad'] ?? 1,
                $refaccion['precio_unitario'] ?? 0,
                $refaccion['subtotal'] ?? 0
            ]);
        }
    }
    
    private function insertManoObra($orden_id, $manoObra) {
        $stmt = $this->db->prepare('
            INSERT INTO mano_obra (orden_id, descripcion, horas, precio_hora, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($manoObra as $trabajo) {
            $stmt->execute([
                $orden_id,
                $trabajo['descripcion'],
                $trabajo['horas'] ?? 1,
                $trabajo['precio_hora'] ?? 0,
                $trabajo['subtotal'] ?? 0
            ]);
        }
    }
    
    private function generateFolio() {
        $prefix = 'SAG-';
        $date = date('dmY');
        
        // Obtener el último folio del día
        $stmt = $this->db->prepare("
            SELECT folio FROM ordenes 
            WHERE folio LIKE ? 
            ORDER BY id DESC 
            LIMIT 1
        ");
        $stmt->execute([$prefix . $date . '%']);
        $lastFolio = $stmt->fetchColumn();
        
        if ($lastFolio) {
            $lastNumber = (int)substr($lastFolio, -1);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . $date . '-' . $newNumber;
    }
    
    private function isJson($string) {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}