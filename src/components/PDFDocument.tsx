import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Presupuesto } from '../types';

// 🎨 PALETA PREMIUM - SILICON VALLEY INSPIRED
const COLORS = {
  black: '#0A0A0A',
  darkGray: '#2D2D2D',
  mediumGray: '#8E8E93',
  lightGray: '#E8E8E8',
  ultraLightGray: '#F9F9F9',
  white: '#FFFFFF',
  accent: '#B87333', // Oro rosa/cobre - LUJO
  success: '#28A745',
  border: '#E5E5E5',
};

// Estilos ULTRA-PREMIUM
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.white,
    color: COLORS.darkGray,
  },
  
  // ===== HEADER PREMIUM =====
  header: {
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: `0.5px solid ${COLORS.border}`,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  titleSection: {
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.mediumGray,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  folio: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  date: {
    fontSize: 9,
    color: COLORS.mediumGray,
    textAlign: 'right',
  },
  
  // ===== CARDS PREMIUM =====
  cardRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 25,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 4,
    padding: 20,
    border: `0.5px solid ${COLORS.border}`,
  },
  cardTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 15,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.mediumGray,
    width: 80,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 9,
    color: COLORS.black,
    flex: 1,
    fontFamily: 'Helvetica',
  },
  
  // ===== SECCIONES AMPLIAS =====
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 15,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  problemCard: {
    backgroundColor: COLORS.ultraLightGray,
    padding: 20,
    borderRadius: 4,
    border: `0.5px solid ${COLORS.border}`,
  },
  problemLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.mediumGray,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  problemText: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.6,
    marginBottom: 15,
  },
  
  // ===== TABLAS MINIMALISTAS =====
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottom: `0.5px solid ${COLORS.border}`,
    backgroundColor: COLORS.ultraLightGray,
  },
  tableRowAlt: {
    backgroundColor: COLORS.white,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  tableCellBold: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  
  // Columnas de tabla
  col60: { width: '60%' },
  col20: { width: '20%', textAlign: 'right' },
  col10: { width: '10%', textAlign: 'center' },
  
  // ===== RESUMEN FINANCIERO - EL MÁS IMPORTANTE =====
  financialSummary: {
    marginTop: 30,
    marginBottom: 30,
    padding: 25,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    border: `1px solid ${COLORS.accent}`,
  },
  summaryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 20,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 9,
    color: COLORS.mediumGray,
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  summaryDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  summarySubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 2,
  },
  summarySubtotalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
  },
  summarySubtotalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTop: `2px solid ${COLORS.accent}`,
    paddingHorizontal: 5,
  },
  summaryTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  summaryTotalValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    letterSpacing: -1,
  },
  summaryAnticipo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  summaryAnticipoLabel: {
    fontSize: 9,
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  summaryAnticipoValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.success,
  },
  summaryRestante: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 2,
  },
  summaryRestanteLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  summaryRestanteValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  
  // ===== FIRMAS ELEGANTES =====
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingTop: 30,
    gap: 40,
  },
  signatureBox: {
    flex: 1,
  },
  signatureLine: {
    borderTop: `1px solid ${COLORS.black}`,
    paddingTop: 10,
    marginTop: 50,
  },
  signatureLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 8,
    color: COLORS.mediumGray,
    textAlign: 'center',
  },
  
  // ===== PÁGINA DE GARANTÍAS =====
  garantiaHeader: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: `0.5px solid ${COLORS.border}`,
  },
  garantiaTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  garantiaSubtitle: {
    fontSize: 10,
    color: COLORS.mediumGray,
    letterSpacing: 0.5,
  },
  garantiaCard: {
    backgroundColor: COLORS.ultraLightGray,
    padding: 20,
    marginBottom: 15,
    borderRadius: 4,
    border: `0.5px solid ${COLORS.border}`,
  },
  garantiaCardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  garantiaText: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  garantiaList: {
    marginLeft: 15,
    marginTop: 8,
  },
  garantiaListItem: {
    fontSize: 8,
    color: COLORS.darkGray,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  footer: {
    textAlign: 'center',
    fontSize: 7,
    color: COLORS.mediumGray,
    marginTop: 30,
    paddingTop: 20,
    borderTop: `0.5px solid ${COLORS.border}`,
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
      minimumFractionDigits: 2,
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
      {/* ========== PÁGINA 1: PRESUPUESTO ========== */}
      <Page size="A4" style={styles.page}>
        {/* Header Premium */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/logo.png" style={styles.logo} />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>Orden de Servicio</Text>
            <Text style={styles.mainTitle}>Presupuesto</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.folio}>#{presupuesto.folio}</Text>
            <Text style={styles.date}>{formatDate(presupuesto.fecha)}</Text>
          </View>
        </View>

        {/* Cliente y Vehículo - Cards Premium */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cliente</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{presupuesto.cliente.nombreCompleto || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{presupuesto.cliente.telefono || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{presupuesto.cliente.email || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Domicilio</Text>
              <Text style={styles.infoValue}>{presupuesto.cliente.domicilio || '—'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehículo</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marca</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.marca || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Modelo</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.modelo || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Color</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.color || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placas</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.placas || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kilometraje</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.kilometrajeEntrada ? `${presupuesto.vehiculo.kilometrajeEntrada} km` : '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Combustible</Text>
              <Text style={styles.infoValue}>{presupuesto.vehiculo.nivelGasolina}%</Text>
            </View>
          </View>
        </View>

        {/* Problema y Diagnóstico */}
        {(presupuesto.problemaReportado || presupuesto.diagnosticoTecnico) && (
          <View style={styles.section}>
            <View style={styles.problemCard}>
              {presupuesto.problemaReportado && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.problemLabel}>Problema Reportado</Text>
                  <Text style={styles.problemText}>{presupuesto.problemaReportado}</Text>
                </View>
              )}
              {presupuesto.diagnosticoTecnico && (
                <View>
                  <Text style={styles.problemLabel}>Diagnóstico Técnico</Text>
                  <Text style={styles.problemText}>{presupuesto.diagnosticoTecnico}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Servicios - Tabla Premium */}
        {presupuesto.servicios && presupuesto.servicios.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Servicios</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col60]}>Descripción</Text>
                <Text style={[styles.tableHeaderText, styles.col20]}>Precio</Text>
              </View>
              {presupuesto.servicios.map((servicio, idx) => (
                <View key={idx} style={idx % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col60]}>{servicio.descripcion}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, styles.col20]}>
                    {formatCurrency(servicio.precio)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Refacciones - Tabla Premium */}
        {presupuesto.refacciones && presupuesto.refacciones.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Refacciones</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col60]}>Descripción</Text>
                <Text style={[styles.tableHeaderText, styles.col10]}>Cant.</Text>
                <Text style={[styles.tableHeaderText, styles.col20]}>P. Unit.</Text>
                <Text style={[styles.tableHeaderText, styles.col20]}>Total</Text>
              </View>
              {presupuesto.refacciones.map((refaccion, idx) => {
                const precioUnitario = refaccion.total / refaccion.cantidad;
                return (
                  <View key={idx} style={idx % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
                    <Text style={[styles.tableCell, styles.col60]}>{refaccion.nombre}</Text>
                    <Text style={[styles.tableCell, styles.col10]}>{refaccion.cantidad}</Text>
                    <Text style={[styles.tableCell, styles.col20]}>{formatCurrency(precioUnitario)}</Text>
                    <Text style={[styles.tableCell, styles.tableCellBold, styles.col20]}>
                      {formatCurrency(refaccion.total)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Mano de Obra - Tabla Premium */}
        {presupuesto.manoDeObra && presupuesto.manoDeObra.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Mano de Obra</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col60]}>Descripción</Text>
                <Text style={[styles.tableHeaderText, styles.col20]}>Precio</Text>
              </View>
              {presupuesto.manoDeObra.map((trabajo, idx) => (
                <View key={idx} style={idx % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col60]}>{trabajo.descripcion}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, styles.col20]}>
                    {formatCurrency(trabajo.precio)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* RESUMEN FINANCIERO - LA ESTRELLA DEL SHOW */}
        <View style={styles.financialSummary} wrap={false}>
          <Text style={styles.summaryTitle}>Resumen Financiero</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicios</Text>
            <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.servicios || 0)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Refacciones</Text>
            <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.refacciones || 0)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mano de Obra</Text>
            <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.manoDeObra || 0)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summarySubtotal}>
            <Text style={styles.summarySubtotalLabel}>Subtotal</Text>
            <Text style={styles.summarySubtotalValue}>{formatCurrency(presupuesto.resumen?.subtotal || 0)}</Text>
          </View>

          {presupuesto.resumen?.incluirIVA && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA (16%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen.iva || 0)}</Text>
            </View>
          )}

          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              {formatCurrency(presupuesto.resumen?.incluirIVA ? presupuesto.resumen.total : presupuesto.resumen?.subtotal || 0)}
            </Text>
          </View>

          {presupuesto.resumen?.anticipo > 0 && (
            <>
              <View style={styles.summaryAnticipo}>
                <Text style={styles.summaryAnticipoLabel}>Anticipo Recibido</Text>
                <Text style={styles.summaryAnticipoValue}>{formatCurrency(presupuesto.resumen.anticipo)}</Text>
              </View>
              
              <View style={styles.summaryRestante}>
                <Text style={styles.summaryRestanteLabel}>Saldo Pendiente</Text>
                <Text style={styles.summaryRestanteValue}>{formatCurrency(presupuesto.resumen.restante)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Firmas Elegantes */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Cliente</Text>
              <Text style={styles.signatureName}>{presupuesto.cliente.nombreCompleto}</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>SAG Garage</Text>
              <Text style={styles.signatureName}>Autorización del Servicio</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          SAG Garage • Servicio Automotriz de Alta Calidad
        </Text>
      </Page>

      {/* ========== PÁGINA 2: GARANTÍAS ========== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.garantiaHeader}>
          <Text style={styles.garantiaTitle}>Póliza de Garantía</Text>
          <Text style={styles.garantiaSubtitle}>SAG GARAGE</Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>1. Cobertura de la Garantía</Text>
          <Text style={styles.garantiaText}>
            Todas las reparaciones y servicios realizados en SAG Garage cuentan con garantía de 30 días naturales 
            a partir de la fecha de entrega del vehículo. En partes eléctricas en ningún caso hay garantía.
          </Text>
          <Text style={styles.garantiaText}>
            La garantía cubre únicamente las piezas y mano de obra relacionadas con la reparación realizada.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>2. Lugar de la Garantía</Text>
          <Text style={styles.garantiaText}>
            La garantía se hará válida únicamente en las instalaciones de SAG Garage. El cliente deberá presentar 
            esta póliza junto con la factura o comprobante del servicio.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>3. Exclusiones</Text>
          <Text style={styles.garantiaText}>La garantía quedará sin efecto en los siguientes casos:</Text>
          <View style={styles.garantiaList}>
            <Text style={styles.garantiaListItem}>
              • Si el vehículo es manipulado por terceros después del servicio realizado
            </Text>
            <Text style={styles.garantiaListItem}>
              • Si el daño proviene de mal uso, accidentes, modificaciones no autorizadas o falta de mantenimiento
            </Text>
            <Text style={styles.garantiaListItem}>
              • Si el cliente no respeta las recomendaciones de uso y cuidado emitidas por el taller
            </Text>
            <Text style={styles.garantiaListItem}>
              • Daños ocasionados por condiciones externas (inundaciones, sobrecalentamiento, combustible adulterado, etc.)
            </Text>
            <Text style={styles.garantiaListItem}>
              • Reparaciones, modificaciones o alteraciones posteriores realizadas por talleres ajenos
            </Text>
            <Text style={styles.garantiaListItem}>
              • Falta de mantenimiento preventivo recomendado por el Taller
            </Text>
          </View>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>4. Responsabilidad del Cliente</Text>
          <Text style={styles.garantiaText}>
            El cliente deberá notificar cualquier anomalía inmediatamente y dentro del plazo de la garantía. 
            El vehículo deberá entregarse en las instalaciones del taller para su revisión.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>5. Tiempo de Revisión</Text>
          <Text style={styles.garantiaText}>
            El taller contará con un plazo razonable de hasta 5 días hábiles para revisar y diagnosticar el vehículo 
            antes de determinar la procedencia de la garantía.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>6. Alcance de la Garantía</Text>
          <Text style={styles.garantiaText}>
            La garantía aplica únicamente a la reparación realizada y no cubre daños colaterales o piezas no 
            intervenidas por SAG Garage.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>7. Horarios de Atención</Text>
          <Text style={styles.garantiaText}>Las garantías solo podrán hacerse válidas dentro de los horarios de atención del taller:</Text>
          <View style={styles.garantiaList}>
            <Text style={styles.garantiaListItem}>• Lunes a viernes de 9:00 a.m. a 6:00 p.m.</Text>
            <Text style={styles.garantiaListItem}>• Sábados de 10:00 a.m. a 2:00 p.m.</Text>
            <Text style={styles.garantiaListItem}>• No se atenderán reclamaciones fuera de este horario</Text>
          </View>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>8. Traslado del Vehículo</Text>
          <Text style={styles.garantiaText}>
            La póliza de garantía no incluye de ninguna manera el traslado del vehículo desde el lugar donde se 
            presente la falla hasta el taller. El cliente es responsable de llevar el vehículo a las instalaciones 
            de SAG Garage.
          </Text>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>9. Responsabilidad Limitada</Text>
          <Text style={styles.garantiaText}>
            La garantía se limita a la reparación o reposición del trabajo realizado.
          </Text>
          <Text style={styles.garantiaText}>El Taller no será responsable por:</Text>
          <View style={styles.garantiaList}>
            <Text style={styles.garantiaListItem}>• Daños indirectos, o en consecuencia de pérdidas económicas</Text>
            <Text style={styles.garantiaListItem}>• Gastos de traslado, grúa, hospedaje o similares</Text>
          </View>
        </View>

        <View style={styles.garantiaCard}>
          <Text style={styles.garantiaCardTitle}>10. Aceptación</Text>
          <Text style={styles.garantiaText}>
            Al firmar la orden de servicio y recibir el vehículo, el Cliente acepta los presentes términos y condiciones.
          </Text>
        </View>

        <Text style={styles.footer}>
          SAG Garage • Términos y Condiciones de Garantía
        </Text>
      </Page>
    </Document>
  );
};