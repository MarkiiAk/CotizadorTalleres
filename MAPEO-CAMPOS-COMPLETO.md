# 📋 MAPEO COMPLETO DE CAMPOS - SAG GARAGE

## 🔍 ANÁLISIS: Kilometrajes

### ❌ PROBLEMA IDENTIFICADO

**Frontend envía:**
```typescript
vehiculo: {
  kilometrajeEntrada: string;  // ✅ Existe en frontend
  kilometrajeSalida: string;   // ✅ Existe en frontend
}
```

**Base de datos tiene:**
```sql
-- Tabla: vehiculos
kilometraje INT  -- ❌ Solo UN campo genérico
```

**Backend NO ESTÁ GUARDANDO los kilometrajes de entrada/salida porque:**
1. ❌ La tabla `vehiculos` solo tiene UN campo `kilometraje` genérico
2. ❌ La tabla `ordenes_servicio` NO tiene campos de kilometraje
3. ❌ El backend PHP solo guarda datos en `vehiculos.kilometraje` (si acaso)

---

## 📊 MAPEO COMPLETO DE CAMPOS

### 1. INFORMACIÓN DEL CLIENTE

| Frontend | Backend PHP | Base de Datos | Tabla | Observaciones |
|----------|-------------|---------------|-------|---------------|
| `cliente.nombreCompleto` | `$clienteData['nombreCompleto']` | `nombre` | `clientes` | ✅ Mapea correctamente |
| `cliente.telefono` | `$clienteData['telefono']` | `telefono` | `clientes` | ✅ Se usa para buscar cliente existente |
| `cliente.email` | `$clienteData['email']` | `email` | `clientes` | ✅ Guardado |
| `cliente.domicilio` | `$clienteData['domicilio']` | `direccion` | `clientes` | ✅ Mapea domicilio → direccion |

---

### 2. INFORMACIÓN DEL VEHÍCULO

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `vehiculo.marca` | `$vehiculoData['marca']` | `marca` | `vehiculos` | ✅ Guardado |
| `vehiculo.modelo` | `$vehiculoData['modelo']` | `modelo` | `vehiculos` | ✅ Guardado |
| `vehiculo.color` | `$vehiculoData['color']` | `color` | `vehiculos` | ✅ Guardado |
| `vehiculo.placas` | `$vehiculoData['placas']` | `placas` | `vehiculos` | ✅ Se usa para buscar vehículo |
| `vehiculo.kilometrajeEntrada` | ❌ **NO SE GUARDA** | ❌ **NO EXISTE** | - | ⚠️ **PERDIDO** |
| `vehiculo.kilometrajeSalida` | ❌ **NO SE GUARDA** | ❌ **NO EXISTE** | - | ⚠️ **PERDIDO** |
| `vehiculo.nivelGasolina` | `$vehiculoData['nivelGasolina']` | `nivel_combustible` | `ordenes_servicio` | ✅ Guardado en orden |

---

### 3. PROBLEMA Y DIAGNÓSTICO

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `problemaReportado` | `$data['problemaReportado']` | `problema_reportado` | `ordenes_servicio` | ✅ Guardado |
| `diagnosticoTecnico` | `$data['diagnosticoTecnico']` | `diagnostico` | `ordenes_servicio` | ✅ Guardado (corregido) |

---

### 4. INSPECCIÓN DEL VEHÍCULO

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `inspeccion.exteriores.antena` | `$exteriores['antena']` | `tiene_antena` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.exteriores.gato` | `$exteriores['gato']` | `tiene_gato` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.exteriores.llantaRefaccion` | `$exteriores['llantaRefaccion']` | `tiene_llanta_refaccion` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.exteriores.herramienta` | `$exteriores['herramienta']` | `tiene_herramienta` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.exteriores.extinguidor` | `$exteriores['extinguidor']` | `tiene_extinguidor` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.interiores.radio` | `$interiores['radio']` | `tiene_radio` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.interiores.encendedor` | `$interiores['encendedor']` | `tiene_encendedor` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.interiores.tapetes` | `$interiores['tapetes']` | `tiene_tapetes` | `ordenes_servicio` | ✅ Guardado |
| `inspeccion.interiores.documentos` | `$interiores['documentos']` | `tiene_documentos` | `ordenes_servicio` | ✅ Guardado |
| Otros campos de inspección | ❌ **NO MAPEADOS** | ❌ **NO EXISTEN** | - | ⚠️ Solo algunos campos |

---

### 5. SERVICIOS Y MANO DE OBRA

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `servicios[]` | `$data['servicios']` | Múltiples registros | `servicios_orden` | ✅ Guardado (corregido) |
| `servicios[].descripcion` | `$servicio['descripcion']` | `descripcion` | `servicios_orden` | ✅ Guardado |
| `servicios[].precio` | `$servicio['precio']` | `precio_unitario` | `servicios_orden` | ✅ Guardado |
| `manoDeObra[]` | `$data['manoDeObra']` | Múltiples registros | `servicios_orden` | ✅ Guardado |
| `manoDeObra[].descripcion` | `$servicio['descripcion']` | `descripcion` | `servicios_orden` | ✅ Guardado |
| `manoDeObra[].precio` | `$servicio['precio']` | `precio_unitario` | `servicios_orden` | ✅ Guardado |

---

### 6. REFACCIONES

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `refacciones[]` | `$data['refacciones']` | Múltiples registros | `refacciones_orden` | ✅ Guardado |
| `refacciones[].nombre` | `$refaccion['nombre']` | `descripcion` | `refacciones_orden` | ✅ Mapea nombre → descripcion |
| `refacciones[].cantidad` | `$refaccion['cantidad']` | `cantidad` | `refacciones_orden` | ✅ Guardado |
| `refacciones[].precioVenta` | `$refaccion['precioVenta']` | `precio_unitario` | `refacciones_orden` | ✅ Guardado |
| `refacciones[].total` | `$refaccion['total']` | `subtotal` | `refacciones_orden` | ✅ Guardado |
| `refacciones[].precioCosto` | ❌ **NO SE GUARDA** | ❌ **NO EXISTE** | - | ⚠️ Solo precio de venta |
| `refacciones[].margenGanancia` | ❌ **NO SE GUARDA** | ❌ **NO EXISTE** | - | ⚠️ No se guarda el % |

---

### 7. RESUMEN FINANCIERO

| Frontend | Backend PHP | Base de Datos | Tabla | Estado |
|----------|-------------|---------------|-------|--------|
| `resumen.servicios` | - | - | - | ❌ No se guarda (calculado) |
| `resumen.refacciones` | `$resumenData['refacciones']` | `subtotal_refacciones` | `ordenes_servicio` | ✅ Guardado |
| `resumen.manoDeObra` | `$resumenData['manoDeObra']` | `subtotal_mano_obra` | `ordenes_servicio` | ✅ Guardado |
| `resumen.subtotal` | - | - | - | ❌ No se guarda (calculado) |
| `resumen.incluirIVA` | - | - | - | ❌ No se guarda |
| `resumen.iva` | - | `iva` | `ordenes_servicio` | ⚠️ Campo existe pero no se usa |
| `resumen.total` | `$resumenData['total']` | `total` | `ordenes_servicio` | ✅ Guardado |
| `resumen.anticipo` | - | - | - | ❌ No se guarda |
| `resumen.restante` | - | - | - | ❌ No se guarda |

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **Kilometrajes NO se están guardando**

**Problema:**
- Frontend tiene: `kilometrajeEntrada` y `kilometrajeSalida`
- Base de datos NO tiene estos campos
- Se pierden estos datos importantes

**Solución necesaria:**
Agregar campos a la tabla `ordenes_servicio`:
```sql
ALTER TABLE ordenes_servicio 
ADD COLUMN kilometraje_entrada VARCHAR(20) AFTER diagnostico,
ADD COLUMN kilometraje_salida VARCHAR(20) AFTER kilometraje_entrada;
```

### 2. **Muchos campos de inspección NO se guardan**

Solo se guardan 9 de ~22 campos de inspección. El resto se pierde.

### 3. **Información financiera incompleta**

No se guarda:
- Anticipo
- Restante
- Si incluye IVA o no
- Margen de ganancia de refacciones
- Precio de costo de refacciones

---

## ✅ SOLUCIÓN RECOMENDADA

### Opción A: Agregar campos faltantes a la BD (Recomendado)

```sql
ALTER TABLE ordenes_servicio 
ADD COLUMN kilometraje_entrada VARCHAR(20) AFTER diagnostico,
ADD COLUMN kilometraje_salida VARCHAR(20) AFTER kilometraje_entrada,
ADD COLUMN anticipo DECIMAL(10,2) DEFAULT 0.00 AFTER total,
ADD COLUMN saldo_pendiente DECIMAL(10,2) DEFAULT 0.00 AFTER anticipo,
ADD COLUMN incluye_iva BOOLEAN DEFAULT FALSE AFTER saldo_pendiente;
```

### Opción B: Guardar como JSON en campo existente

Usar el campo `notas_internas` o crear un campo `datos_adicionales TEXT` para guardar JSON con los datos faltantes.

---

## 📝 RESUMEN EJECUTIVO

**Campos que SÍ se guardan correctamente:**
- ✅ Cliente (nombre, teléfono, email, dirección)
- ✅ Vehículo básico (marca, modelo, color, placas)
- ✅ Problema reportado y diagnóstico técnico
- ✅ 9 campos de inspección básicos
- ✅ Nivel de gasolina
- ✅ Servicios y mano de obra
- ✅ Refacciones (nombre, cantidad, precio venta, total)
- ✅ Totales (subtotal MO, subtotal refacciones, total)

**Campos que NO se guardan (SE PIERDEN):**
- ❌ **Kilometraje de entrada**
- ❌ **Kilometraje de salida**
- ❌ Anticipo y saldo pendiente
- ❌ Si incluye IVA
- ❌ 13 campos adicionales de inspección
- ❌ Daños adicionales del vehículo
- ❌ Precio de costo y margen de refacciones

---

**Fecha de análisis:** 27/01/2026
**Analista:** Cline AI