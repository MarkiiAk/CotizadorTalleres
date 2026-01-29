import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Presupuesto } from '../types';

// 🎨 PALETA SAG GARAGE - Basada en diseño de referencia
const COLORS = {
  // Verdes SAG
  primary: '#8BC34A', // Verde limón principal
  primaryDark: '#689F38',
  
  // Headers y acentos
  headerDark: '#37474F', // Azul gris oscuro para tablas
  headerLight: '#455A64',
  
  // Azul para totales importantes
  accentBlue: '#2196F3',
  accentBlueDark: '#1976D2',
  
  // Escala de grises
  black: '#212121',
  darkGray: '#424242',
  mediumGray: '#757575',
  lightGray: '#E0E0E0',
  ultraLightGray: '#F5F5F5',
  white: '#FFFFFF',
  
  // Estados
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.white,
    color: COLORS.darkGray,
  },
  
  // ===== HEADER SAG GARAGE =====
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `3px solid ${COLORS.primaryDark}`,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleSection: {
    flex: 1,
  },
  companyName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.95,
  },
  addressSection: {
    textAlign: 'right',
  },
  addressText: {
    fontSize: 8,
    color: COLORS.white,
    marginBottom: 2,
    opacity: 0.95,
  },
  dateTimeSection: {
    position: 'absolute',
    top: 20,
    right: 20,
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 8,
    color: COLORS.mediumGray,
    marginBottom: 1,
  },
  dateValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
  },
  
  // ===== CONTENIDO =====
  content: {
    padding: 30,
  },
  
  // ===== CARDS CLIENTE Y VEHÍCULO =====
  cardsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 25,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 3,
    padding: 15,
    border: `1px solid ${COLORS.lightGray}`,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accentBlue,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 9,
    color: COLORS.darkGray,
    width: '35%',
  },
  cardValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
    flex: 1,
  },
  
  // ===== TABLAS =====
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: COLORS.headerDark,
    padding: 10,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  
  // Headers de tabla
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentBlue,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  // Filas de tabla
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottom: `1px solid ${COLORS.lightGray}`,
    backgroundColor: COLORS.white,
  },
  tableRowAlt: {
    backgroundColor: COLORS.ultraLightGray,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  tableCellBold: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  
  // Anchos de columna
  col50: { width: '50%' },
  col60: { width: '60%' },
  col30: { width: '30%' },
  col25: { width: '25%' },
  col20: { width: '20%' },
  col15: { width: '15%' },
  col10: { width: '10%' },
  colRight: { textAlign: 'right' },
  colCenter: { textAlign: 'center' },
  
  // ===== TÉRMINOS Y RESUMEN =====
  bottomSection: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  termsSection: {
    flex: 1,
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  termsText: {
    fontSize: 8,
    color: COLORS.mediumGray,
    lineHeight: 1.4,
  },
  
  // ===== RESUMEN FINANCIERO =====
  summarySection: {
    width: '45%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${COLORS.lightGray}`,
  },
  summaryLabel: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.black,
  },
  
  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: COLORS.black,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 2,
  },
  totalValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  
  // Proyecto/Anticipo
  proyectoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottom: `1px solid ${COLORS.lightGray}`,
    fontStyle: 'italic',
  },
  proyectoLabel: {
    fontSize: 9,
    color: COLORS.mediumGray,
  },
  proyectoValue: {
    fontSize: 10,
    color: COLORS.mediumGray,
  },
  
  // Saldo Restante - EL MÁS IMPORTANTE
  saldoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.accentBlue,
    marginTop: 2,
  },
  saldoLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  saldoValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
});

interface PDFDocumentProps {
  presupuesto: Presupuesto;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({ presupuesto }) => {
  const TALLER_INFO = {
    nombre: 'SAG GARAGE',
    encargado: 'JOSÉ FRANCISCO GUDIÑO MACÍAS',
    telefono: '5513422917',
    direccion: 'PRIVADA NICOLAS BRAVO 6, SAN MATEO NOPALA, NAUCALPAN.',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: string | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER SAG GARAGE */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src="/logo.png" style={styles.logo} />
            <View style={styles.titleSection}>
              <Text style={styles.companyName}>{TALLER_INFO.nombre}</Text>
              <Text style={styles.ownerName}>{TALLER_INFO.encargado}</Text>
            </View>
          </View>
          <View style={styles.addressSection}>
            <Text style={styles.addressText}>FECHA: {formatDate(presupuesto.fecha)}</Text>
            <Text style={styles.addressText}>HORA: {formatTime(presupuesto.fecha)}</Text>
            <Text style={styles.addressText}>{TALLER_INFO.direccion}</Text>
            <Text style={styles.addressText}>{TALLER_INFO.telefono}</Text>
          </View>
        </View>

        {/* CONTENIDO */}
        <View style={styles.content}>
          {/* CARDS CLIENTE Y VEHÍCULO */}
          <View style={styles.cardsRow}>
            {/* CLIENTE */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>CLIENTE</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>SR. {presupuesto.cliente.nombreCompleto?.toUpperCase() || 'N/A'}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardValue}>{presupuesto.cliente.telefono || 'N/A'}</Text>
              </View>
              {presupuesto.cliente.domicilio && (
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>{presupuesto.cliente.domicilio}</Text>
                </View>
              )}
            </View>

            {/* VEHÍCULO */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>VEHÍCULO</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardValue}>
                  {presupuesto.vehiculo.marca} {presupuesto.vehiculo.modelo}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Placas:</Text>
                <Text style={styles.cardValue}>{presupuesto.vehiculo.placas || 'N/A'}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Color:</Text>
                <Text style={styles.cardValue}>{presupuesto.vehiculo.color || 'N/A'} I Km:</Text>
              </View>
            </View>
          </View>

          {/* 1. SERVICIOS */}
          {presupuesto.servicios && presupuesto.servicios.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>1. SERVICIOS</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col60]}>DESCRIPCIÓN</Text>
                <Text style={[styles.tableHeaderText, styles.col20, styles.colRight]}>IMPORTE</Text>
              </View>
              {presupuesto.servicios.map((servicio, idx) => (
                <View key={idx} style={idx % 2 === 0 ? styles.tableRow : [styles.tableRow, styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.col60]}>{servicio.descripcion.toUpperCase()}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, styles.col20, styles.colRight]}>
                    {formatCurrency(servicio.precio)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* 2. REFACCIONES */}
          {presupuesto.refacciones && presupuesto.refacciones.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>2. REFACCIONES</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col50]}>DESCRIPCIÓN</Text>
                <Text style={[styles.tableHeaderText, styles.col15, styles.colCenter]}>CANT.</Text>
                <Text style={[styles.tableHeaderText, styles.col20, styles.colRight]}>P. UNITARIO</Text>
                <Text style={[styles.tableHeaderText, styles.col20, styles.colRight]}>TOTAL</Text>
              </View>
              {presupuesto.refacciones.map((refaccion, idx) => {
                const precioUnitario = refaccion.total / refaccion.cantidad;
                return (
                  <View key={idx} style={idx % 2 === 0 ? styles.tableRow : [styles.tableRow, styles.tableRowAlt]}>
                    <Text style={[styles.tableCell, styles.col50]}>{refaccion.nombre.toUpperCase()}</Text>
                    <Text style={[styles.tableCell, styles.col15, styles.colCenter]}>{refaccion.cantidad}</Text>
                    <Text style={[styles.tableCell, styles.col20, styles.colRight]}>{formatCurrency(precioUnitario)}</Text>
                    <Text style={[styles.tableCell, styles.tableCellBold, styles.col20, styles.colRight]}>
                      {formatCurrency(refaccion.total)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* 3. MANO DE OBRA */}
          {presupuesto.manoDeObra && presupuesto.manoDeObra.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>3. MANO DE OBRA</Text>
              </View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col60]}>DESCRIPCIÓN</Text>
                <Text style={[styles.tableHeaderText, styles.col20, styles.colRight]}>IMPORTE</Text>
              </View>
              {presupuesto.manoDeObra.map((trabajo, idx) => (
                <View key={idx} style={idx % 2 === 0 ? styles.tableRow : [styles.tableRow, styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.col60]}>{trabajo.descripcion.toUpperCase()}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold, styles.col20, styles.colRight]}>
                    {formatCurrency(trabajo.precio)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TÉRMINOS Y RESUMEN */}
          <View style={styles.bottomSection}>
            {/* TÉRMINOS Y CONDICIONES */}
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>TÉRMINOS Y CONDICIONES:</Text>
              <Text style={styles.termsText}>
                Este documento es un presupuesto informativo y tiene una vigencia de 15 días. Los
                precios de refacciones están sujetos a cambio sin previo aviso. Toda reparación requiere
                un anticipo del 50%. La garantía en mano de obra es de 30 días naturales. No nos
                hacemos responsables por objetos de valor dejados dentro del vehículo.
              </Text>
            </View>

            {/* RESUMEN FINANCIERO */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Servicios:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.servicios || 0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Refacciones:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.refacciones || 0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Mano de Obra:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(presupuesto.resumen?.manoDeObra || 0)}</Text>
              </View>

              {/* TOTAL */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(presupuesto.resumen?.incluirIVA ? presupuesto.resumen.total : presupuesto.resumen?.subtotal || 0)}
                </Text>
              </View>

              {/* PROYECTO (Anticipo) */}
              <View style={styles.proyectoRow}>
                <Text style={styles.proyectoLabel}>PROYECTO:</Text>
              </View>
              <View style={styles.proyectoRow}>
                <Text style={styles.proyectoLabel}>(-) Anticipo recibido:</Text>
                <Text style={styles.proyectoValue}>{formatCurrency(presupuesto.resumen?.anticipo || 0)}</Text>
              </View>

              {/* SALDO RESTANTE - LA ESTRELLA */}
              <View style={styles.saldoRow}>
                <Text style={styles.saldoLabel}>SALDO RESTANTE:</Text>
                <Text style={styles.saldoValue}>{formatCurrency(presupuesto.resumen?.restante || 0)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};