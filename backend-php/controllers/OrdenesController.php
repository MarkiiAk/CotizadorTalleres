<?php
/**
 * Controlador de órdenes de servicio
 * Basado en CREAR-TABLAS-CPANEL.sql
 * SIN campo 'vin' (no existe en la BD actual de cPanel)
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
            
            // 4. Mapear datos del vehículo desde frontend
            $vehiculoData = $data['vehiculo'] ?? [];
            $kilometraje = $vehiculoData['kilometrajeEntrada'] ?? $vehiculoData['kilometraje'] ?? null;
            $nivelGasolina = $vehiculoData['nivelGasolina'] ?? 0;
            
            // 5. Insertar orden
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
                $data['fechaEntrada'] ?? date('Y-m-d H:i:s'),
                $kilometraje,
                $nivelGasolina,
                $data['problemaReportado'] ?? '',
                $data['observaciones_iniciales'] ?? '',
                'abierta',
                $userData['userId']
            ]);
            
            $orden_id = $this->db->lastInsertId();
            
            // 6. Insertar inspección visual
            if (isset($data['inspeccion']) && !empty($data['inspeccion'])) {
                $this->insertInspeccion($orden_id, $data['inspeccion']);
            }
            
            // 7. Insertar servicios
            if (isset($data['servicios']) && !empty($data['servicios'])) {
                $this->insertServicios($orden_id, $data['servicios']);
            }
            
            // 8. Insertar refacciones
            if (isset($data['refacciones']) && !empty($data['refacciones'])) {
                $this->insertRefacciones($orden_id, $data['refacciones']);
            }
            
            // 9. Insertar mano de obra
            if (isset($data['manoDeObra']) && !empty($data['manoDeObra'])) {
                $this->insertManoObra($orden_id, $data['manoDeObra']);
            }
            
            // 10. Calcular y actualizar total
            if (isset($data['resumen']['total'])) {
                $this->db->prepare('UPDATE ordenes SET total = ? WHERE id = ?')
                         ->execute([$data['resumen']['total'], $orden_id]);
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
            
            // Actualizar campos básicos si se enviaron
            $updateFields = [];
            $updateValues = [];
            
            $fieldMapping = [
                'diagnostico' => 'diagnostico',
                'recomendaciones' => 'recomendaciones',
                'estado' => 'estado',
                'total' => 'total'
            ];
            
            foreach ($fieldMapping as $dataKey => $dbField) {
                if (isset($data[$dataKey])) {
                    $updateFields[] = "$dbField = ?";
                    $updateValues[] = $data[$dataKey];
                }
            }
            
            if (!empty($updateFields)) {
                $updateValues[] = $userData['userId'];
                $updateValues[] = $id;
                
                $sql = 'UPDATE ordenes SET ' . implode(', ', $updateFields) . 
                       ', updated_by = ? WHERE id = ?';
                       
                $stmt = $this->db->prepare($sql);
                $stmt->execute($updateValues);
            }
            
            // Actualizar datos relacionados si se enviaron
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
            
            if (isset($data['manoDeObra'])) {
                $this->db->prepare('DELETE FROM mano_obra WHERE orden_id = ?')->execute([$id]);
                if (!empty($data['manoDeObra'])) {
                    $this->insertManoObra($id, $data['manoDeObra']);
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
        $orden['manoDeObra'] = $stmt->fetchAll();
        
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
            // Actualizar (SIN vin)
            $stmt = $this->db->prepare('
                UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, 
                       color = ?, cliente_id = ?
                WHERE id = ?
            ');
            $stmt->execute([$marca, $modelo, $anio, $color, $cliente_id, $existing['id']]);
            return $existing['id'];
        } else {
            // Insertar (SIN vin)
            $stmt = $this->db->prepare('
                INSERT INTO vehiculos (marca, modelo, anio, color, placas, cliente_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$marca, $modelo, $anio, $color, $placas, $cliente_id]);
            return $this->db->lastInsertId();
        }
    }
    
    private function insertInspeccion($orden_id, $inspeccionData) {
        $stmt = $this->db->prepare('
            INSERT INTO inspeccion_visual (orden_id, item, estado, observaciones)
            VALUES (?, ?, ?, ?)
        ');
        
        // Procesar exteriores
        if (isset($inspeccionData['exteriores'])) {
            foreach ($inspeccionData['exteriores'] as $item => $valor) {
                $estado = $valor ? 'bueno' : 'malo';
                $stmt->execute([$orden_id, $item, $estado, null]);
            }
        }
        
        // Procesar interiores
        if (isset($inspeccionData['interiores'])) {
            foreach ($inspeccionData['interiores'] as $item => $valor) {
                $estado = $valor ? 'bueno' : 'malo';
                $stmt->execute([$orden_id, $item, $estado, null]);
            }
        }
        
        // Procesar daños adicionales
        if (isset($inspeccionData['danosAdicionales'])) {
            foreach ($inspeccionData['danosAdicionales'] as $dano) {
                $stmt->execute([
                    $orden_id,
                    $dano['ubicacion'] ?? 'Sin ubicación',
                    'malo',
                    ($dano['tipo'] ?? '') . ': ' . ($dano['descripcion'] ?? '')
                ]);
            }
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
    
    private function insertManoObra($orden_id, $manoObra) {
        $stmt = $this->db->prepare('
            INSERT INTO mano_obra (orden_id, descripcion, horas, precio_hora, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ');
        
        foreach ($manoObra as $trabajo) {
            $horas = $trabajo['horas'] ?? 1;
            $precioHora = $trabajo['precio'] ?? $trabajo['precio_hora'] ?? 0;
            $subtotal = $horas * $precioHora;
            
            $stmt->execute([
                $orden_id,
                $trabajo['descripcion'],
                $horas,
                $precioHora,
                $subtotal
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
            // Extraer número del final
            preg_match('/-(\d+)$/', $lastFolio, $matches);
            $lastNumber = isset($matches[1]) ? (int)$matches[1] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . $date . '-' . $newNumber;
    }
}