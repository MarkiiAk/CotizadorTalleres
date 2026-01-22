import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Presupuesto } from '../types';
import { POLIZA_GARANTIA } from '../constants/garantia';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    marginBottom: 20,
    borderBottom: '3px solid #2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 3,
  },
  smallText: {
    fontSize: 9,
    color: '#6b7280',
  },
  // Grids
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  // Cards
  card: {
    border: '1px solid #d1d5db',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1px solid #d1d5db',
  },
  infoRow: {
    marginBottom: 4,
    fontSize: 9,
  },
  label: {
    fontWeight: 'bold',
  },
  // Tables
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #d1d5db',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 4,
    fontSize: 9,
  },
  col1: { width: '60%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '10%', textAlign: 'center' },
  col4: { width: '20%', textAlign: 'right' },
  col5: { width: '20%', textAlign: 'right' },
  // Resumen
  resumenBox: {
    border: '2px solid #2563eb',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#eff6ff',
    marginBottom: 15,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
  },
  resumenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '2px solid #2563eb',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  // Firmas
  firmasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 20,
    borderTop: '2px solid #d1d5db',
  },
  firmaBox: {
    width: '45%',
    textAlign: 'center',
  },
  firmaLine: {
    borderTop: '2px solid #000',
    paddingTop: 5,
    marginTop: 40,
  },
  // Garantía
  headerGarantia: {
    marginBottom: 20,
    borderBottom: '3px solid #dc2626',
    paddingBottom: 10,
  },
  titleGarantia: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 5,
  },
  garantiaCard: {
    border: '1px solid #d1d5db',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  garantiaTitle: {
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 5,
    fontSize: 10,
  },
  garantiaText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  list: {
    marginLeft: 15,
    marginTop: 5,
  },
  listItem: {
    fontSize: 9,
    marginBottom: 2,
    color: '#374151',
  },
  footer: {
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
    marginTop: 20,
  },
});

interface PDFDocumentProps {
  presupuesto: Presupuesto;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({ presupuesto }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      {/* PÁGINA 1: PRESUPUESTO */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SAG GARAGE</Text>
          <Text style={styles.subtitle}>Orden de Servicio y Presupuesto</Text>
          <Text style={styles.smallText}>Folio: {presupuesto.folio}</Text>
          <Text style={styles.smallText}>Fecha de emisión: {formatDate(presupuesto.fecha)}</Text>
        </View>

        {/* Información del Cliente y Vehículo */}
        <View style={styles.row}>
          <View style={[styles.column, styles.card]}>
            <Text style={styles.cardTitle}>Información del Cliente</Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Nombre: </Text>
              <Text>{presupuesto.cliente.nombreCompleto || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Teléfono: </Text>
              <Text>{presupuesto.cliente.telefono || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Email: </Text>
              <Text>{presupuesto.cliente.email || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Domicilio: </Text>
              <Text>{presupuesto.cliente.domicilio || 'N/A'}</Text>
            </Text>
          </View>

          <View style={[styles.column, styles.card]}>
            <Text style={styles.cardTitle}>Información del Vehículo</Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Marca: </Text>
              <Text>{presupuesto.vehiculo.marca || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Modelo: </Text>
              <Text>{presupuesto.vehiculo.modelo || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Color: </Text>
              <Text>{presupuesto.vehiculo.color || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Placas: </Text>
              <Text>{presupuesto.vehiculo.placas || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Kms: </Text>
              <Text>{presupuesto.vehiculo.kilometrajeEntrada || 'N/A'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Gasolina: </Text>
              <Text>{presupuesto.vehiculo.nivelGasolina}%</Text>
            </Text>
          </View>
        </View>

        {/* Problema y Diagnóstico */}
        {(presupuesto.problemaReportado || presupuesto.diagnosticoTecnico) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Problema y Diagnóstico</Text>
            {presupuesto.problemaReportado && (
              <View style={{ marginBottom: 5 }}>
                <Text style={styles.label}>Descripción del Problema:</Text>
                <Text style={styles.garantiaText}>{presupuesto.problemaReportado}</Text>
              </View>
            )}
            {presupuesto.diagnosticoTecnico && (
              <View>
                <Text style={styles.label}>Diagnóstico Técnico:</Text>
                <Text style={styles.garantiaText}>{presupuesto.diagnosticoTecnico}</Text>
              </View>
            )}
          </View>
        )}

        {/* Servicios */}
        {presupuesto.servicios && presupuesto.servicios.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Servicios a Realizar</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Servicio</Text>
                <Text style={styles.col2}>Precio</Text>
              </View>
              {presupuesto.servicios.map((servicio, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.col1}>{servicio.descripcion}</Text>
                  <Text style={styles.col2}>{formatCurrency(servicio.precio)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Refacciones */}
        {presupuesto.refacciones && presupuesto.refacciones.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Refacciones</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Descripción</Text>
                <Text style={styles.col3}>Cant.</Text>
                <Text style={styles.col4}>P. Unit.</Text>
                <Text style={styles.col5}>Total</Text>
              </View>
              {presupuesto.refacciones.map((refaccion, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.col1}>{refaccion.nombre}</Text>
                  <Text style={styles.col3}>{refaccion.cantidad}</Text>
                  <Text style={styles.col4}>{formatCurrency(refaccion.precioVenta)}</Text>
                  <Text style={styles.col5}>{formatCurrency(refaccion.total)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mano de Obra */}
        {presupuesto.manoDeObra && presupuesto.manoDeObra.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mano de Obra</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Descripción</Text>
                <Text style={styles.col2}>Precio</Text>
              </View>
              {presupuesto.manoDeObra.map((trabajo, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.col1}>{trabajo.descripcion}</Text>
                  <Text style={styles.col2}>{formatCurrency(trabajo.precio)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Resumen Financiero */}
        <View style={styles.resumenBox}>
          <Text style={styles.cardTitle}>Resumen Financiero</Text>
          <View style={styles.resumenRow}>
            <Text>Servicios:</Text>
            <Text style={styles.label}>{formatCurrency(presupuesto.resumen?.servicios || 0)}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text>Refacciones:</Text>
            <Text style={styles.label}>{formatCurrency(presupuesto.resumen?.refacciones || 0)}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text>Mano de Obra:</Text>
            <Text style={styles.label}>{formatCurrency(presupuesto.resumen?.manoDeObra || 0)}</Text>
          </View>
          <View style={[styles.resumenRow, { marginTop: 5, paddingTop: 5, borderTop: '1px solid #d1d5db' }]}>
            <Text>Subtotal:</Text>
            <Text style={styles.label}>{formatCurrency(presupuesto.resumen?.subtotal || 0)}</Text>
          </View>
          {presupuesto.resumen?.incluirIVA && (
            <>
              <View style={styles.resumenRow}>
                <Text>IVA (16%):</Text>
                <Text style={styles.label}>{formatCurrency(presupuesto.resumen.iva || 0)}</Text>
              </View>
              <View style={styles.resumenTotal}>
                <Text>TOTAL CON IVA:</Text>
                <Text>{formatCurrency(presupuesto.resumen.total || 0)}</Text>
              </View>
            </>
          )}
          {!presupuesto.resumen?.incluirIVA && (
            <View style={styles.resumenTotal}>
              <Text>TOTAL:</Text>
              <Text>{formatCurrency(presupuesto.resumen?.subtotal || 0)}</Text>
            </View>
          )}
          {presupuesto.resumen?.anticipo > 0 && (
            <>
              <View style={[styles.resumenRow, { color: '#16a34a', marginTop: 5 }]}>
                <Text>Anticipo:</Text>
                <Text style={styles.label}>{formatCurrency(presupuesto.resumen.anticipo)}</Text>
              </View>
              <View style={[styles.resumenTotal, { color: '#dc2626' }]}>
                <Text>Saldo Pendiente:</Text>
                <Text>{formatCurrency(presupuesto.resumen.restante)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Firmas */}
        <View style={styles.firmasContainer}>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine}>
              <Text style={styles.label}>Firma del Cliente</Text>
              <Text style={styles.smallText}>{presupuesto.cliente.nombreCompleto}</Text>
            </View>
          </View>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLine}>
              <Text style={styles.label}>Firma de SAG Garage</Text>
              <Text style={styles.smallText}>Autorización del Servicio</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PÁGINA 2: PÓLIZA DE GARANTÍA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerGarantia}>
          <Text style={styles.titleGarantia}>PÓLIZA DE GARANTÍA</Text>
          <Text style={styles.subtitle}>SAG Garage - Términos y Condiciones</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>1. Cobertura de la garantía</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.cobertura}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>2. Lugar de la garantía</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.lugarGarantia}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>3. Exclusiones</Text>
          <Text style={styles.garantiaText}>La garantía quedará sin efecto en los siguientes casos:</Text>
          <View style={styles.list}>
            {POLIZA_GARANTIA.exclusiones.map((exclusion, idx) => (
              <Text key={idx} style={styles.listItem}>• {exclusion}</Text>
            ))}
          </View>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>4. Responsabilidad del cliente</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.responsabilidadCliente}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>5. Tiempo de revisión</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.tiempoRevision}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>6. Alcance de la garantía</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.alcance}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>7. Horarios de atención</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.horarios}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>8. Traslado del vehículo</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.traslado}</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>9. Responsabilidad limitada</Text>
          <Text style={styles.garantiaText}>El Taller no será responsable por:</Text>
          <View style={styles.list}>
            {POLIZA_GARANTIA.responsabilidadLimitada.map((item, idx) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}
          </View>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaTitle}>10. Ajustes sin costo</Text>
          <Text style={styles.garantiaText}>{POLIZA_GARANTIA.ajustesSinCosto}</Text>
        </View>

        {/* Aceptación */}
        <View style={{ marginTop: 20, paddingTop: 15, borderTop: '2px solid #d1d5db' }}>
          <View style={{ backgroundColor: '#f3f4f6', padding: 15, borderRadius: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 10 }}>
              {POLIZA_GARANTIA.aceptacion}
            </Text>
            <View style={styles.firmasContainer}>
              <View style={styles.firmaBox}>
                <View style={[styles.firmaLine, { marginTop: 30 }]}>
                  <Text style={styles.label}>Firma del Cliente</Text>
                  <Text style={styles.smallText}>He leído y acepto los términos</Text>
                </View>
              </View>
              <View style={styles.firmaBox}>
                <Text style={styles.label}>Fecha:</Text>
                <View style={[styles.firmaLine, { marginTop: 25 }]}>
                  <Text style={{ fontSize: 9 }}>{formatDate(new Date())}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>SAG Garage - Sistema de Presupuestos</Text>
          <Text>© {new Date().getFullYear()} Todos los derechos reservados</Text>
        </View>
      </Page>
    </Document>
  );
};
