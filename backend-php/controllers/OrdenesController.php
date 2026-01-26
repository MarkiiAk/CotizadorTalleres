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
                       v.marca, v.modelo, v.anio, v.placas
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
            
            // 3. Generar número de orden
            $numero_orden = $this->generateNumeroOrden();
            
            // 4. Insertar orden (usando nombres de campos del schema real)
            $stmt = $this->db->prepare('
                INSERT INTO ordenes_servicio (
                    numero_orden, cliente_id, vehiculo_id, fecha_ingreso,
                    kilometraje, nivel_combustible, problema_reportado,
                    observaciones_cliente, estado, usuario_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $numero_orden,
                $cliente_id,
                $vehiculo_id,
                $data['fecha_ingreso'] ?? date('Y-m-d H:i:s'),
                $data['kilometraje'] ?? null,
                $data['nivel_gasolina'] ?? 0,
                $data['problema_reportado'] ?? '',
                $data['observaciones_iniciales'] ?? '',
                $data['estado'] ?? 'pendiente',
                $userData['userId']
            ]);
            
            $orden_id = $this->db->lastInsertId();
            
            // 5. Insertar servicios
            if (isset($data['servicios']) && !empty($data['servicios'])) {
                $this->insertServicios($orden_id, $data['servicios']);
            }
            
            // 6. Insertar refacciones
            if (isset($data['refacciones']) && !empty($data['refacciones'])) {
                $this->insertRefacciones($orden_id, $data['refacciones']);
            }
            
            // 7. Insertar mano de obra (usando tabla servicios_orden del schema)
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
            $stmt = $this->db->prepare('SELECT id FROM ordenes_servicio WHERE id = ?');
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
                'fecha_ingreso', 'kilometraje', 'nivel_combustible',
                'problema_reportado', 'diagnostico',
                'estado', 'fecha_completada', 'total'
            ];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = ?";
                    $updateValues[] = $data[$field];
                }
            }
            
            if (!empty($updateFields)) {
                $updateValues[] = $id;
                
                $sql = 'UPDATE ordenes_servicio SET ' . implode(', ', $updateFields) . 
                       ', ultima_modificacion = NOW() WHERE id = ?';
                       
                $stmt = $this->db->prepare($sql);
                $stmt->execute($updateValues);
            }
            
            // 4. Actualizar datos relacionados si se enviaron
            if (isset($data['servicios'])) {
                $this->db->prepare('DELETE FROM servicios_orden WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['servicios'])) {
                    $this->insertServicios($id, $data['servicios']);
                }
            }
            
            if (isset($data['refacciones'])) {
                $this->db->prepare('DELETE FROM refacciones_orden WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['refacciones'])) {
                    $this->insertRefacciones($id, $data['refacciones']);
                }
            }
            
            if (isset($data['mano_obra'])) {
                $this->db->prepare('DELETE FROM servicios_orden WHERE orden_id = ?')->execute([$id]);
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
        // Decodificar JSON fields
        if (isset($orden['problema_reportado']) && $this->isJson($orden['problema_reportado'])) {
            $orden['problema_reportado'] = json_decode($orden['problema_reportado'], true);
        }
        
        // Obtener servicios (servicios_orden en el schema)
        $stmt = $this->db->prepare('SELECT * FROM servicios_orden WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['servicios'] = $stmt->fetchAll();
        
        // Obtener refacciones (refacciones_orden en el schema)
        $stmt = $this->db->prepare('SELECT * FROM refacciones_orden WHERE orden_id = ?');
        $stmt->execute([$orden['id']]);
        $orden['refacciones'] = $stmt->fetchAll();
        
        return $orden;
    }
    
    private function upsertCliente($clienteData) {
        // Mapear campos del frontend al backend
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
            $stmt->execute([
                $nombre,
                $email,
                $direccion,
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
                $nombre,
                $telefono,
                $email,
                $direccion
            ]);
            return $this->db->lastInsertId();
        }
    }
    
    private function upsertVehiculo($vehiculoData, $cliente_id) {
        // Mapear campos del frontend al backend
        $marca = $vehiculoData['marca'] ?? null;
        $modelo = $vehiculoData['modelo'] ?? null;
        $anio = $vehiculoData['anio'] ?? null;
        $color = $vehiculoData['color'] ?? null;
        $placas = $vehiculoData['placas'] ?? null;
        $numeroSerie = $vehiculoData['vin'] ?? $vehiculoData['numero_serie'] ?? null;
        
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
                       color = ?, numero_serie = ?, cliente_id = ?
                WHERE id = ?
            ');
            $stmt->execute([
                $marca,
                $modelo,
                $anio,
                $color,
                $numeroSerie,
                $cliente_id,
                $existing['id']
            ]);
            return $existing['id'];
        } else {
            // Insertar
            $stmt = $this->db->prepare('
                INSERT INTO vehiculos (marca, modelo, anio, color, placas, numero_serie, cliente_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $marca,
                $modelo,
                $anio,
                $color,
                $placas,
                $numeroSerie,
                $cliente_id
            ]);
            return $this->db->lastInsertId();
        }
    }
    
    private function insertServicios($orden_id, $servicios) {
        $stmt = $this->db->prepare('
            INSERT INTO servicios_orden (orden_id, descripcion, precio_unitario, cantidad, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($servicios as $servicio) {
            $cantidad = $servicio['cantidad'] ?? 1;
            $precio = $servicio['precio'] ?? 0;
            $subtotal = $cantidad * $precio;
            
            $stmt->execute([
                $orden_id,
                $servicio['descripcion'],
                $precio,
                $cantidad,
                $subtotal
            ]);
        }
    }
    
    private function insertRefacciones($orden_id, $refacciones) {
        $stmt = $this->db->prepare('
            INSERT INTO refacciones_orden (orden_id, descripcion, cantidad, precio_unitario, subtotal)
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
            INSERT INTO servicios_orden (orden_id, descripcion, precio_unitario, cantidad, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($manoObra as $trabajo) {
            $horas = $trabajo['horas'] ?? 1;
            $precioHora = $trabajo['precio_hora'] ?? 0;
            $subtotal = $horas * $precioHora;
            
            $stmt->execute([
                $orden_id,
                $trabajo['descripcion'],
                $precioHora,
                $horas,
                $subtotal
            ]);
        }
    }
    
    private function generateNumeroOrden() {
        $prefix = 'OS-';
        $year = date('Y');
        $month = date('m');
        
        // Obtener el último número de orden del mes
        $stmt = $this->db->prepare("
            SELECT numero_orden FROM ordenes_servicio 
            WHERE numero_orden LIKE ? 
            ORDER BY id DESC 
            LIMIT 1
        ");
        $stmt->execute([$prefix . $year . $month . '%']);
        $lastNumero = $stmt->fetchColumn();
        
        if ($lastNumero) {
            $lastNumber = (int)substr($lastNumero, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . $year . $month . '-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
    
    private function isJson($string) {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}