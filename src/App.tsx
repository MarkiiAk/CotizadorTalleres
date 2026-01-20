import { useEffect } from 'react';
import { Sun, Moon, FileText, Download, RotateCcw, Save } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { usePresupuestoStore } from './store/usePresupuestoStore';
import {
  ClienteSection,
  VehiculoSection,
  InspeccionSection,
  ProblemaSection,
  ServiciosSection,
  RefaccionesSection,
  ManoObraSection,
  ResumenSection,
  GarantiaSection,
} from './components/sections';
import { Button } from './components/ui';
import { PDFDocument } from './components/PDFDocument';

function App() {
  const { presupuesto, themeMode, toggleTheme, resetPresupuesto, autoSave, lastSaved } = usePresupuestoStore();

  // Aplicar el tema al documento
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Calcular resumen al cargar
  useEffect(() => {
    usePresupuestoStore.getState().calcularResumen();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      // Generar el PDF usando react-pdf/renderer
      const blob = await pdf(<PDFDocument presupuesto={presupuesto} />).toBlob();
      
      // Crear un enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SAG_Garage_Presupuesto_${presupuesto.folio}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar el presupuesto? Esta acción no se puede deshacer.')) {
      resetPresupuesto();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Sin guardar';
    const now = new Date();
    const diff = now.getTime() - new Date(lastSaved).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Guardado hace un momento';
    if (minutes === 1) return 'Guardado hace 1 minuto';
    if (minutes < 60) return `Guardado hace ${minutes} minutos`;
    return new Date(lastSaved).toLocaleString('es-MX');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  SAG Garage
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de Presupuestos
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-3">
              {/* Indicador de guardado automático */}
              {autoSave && (
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Save size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatLastSaved()}
                  </span>
                </div>
              )}

              {/* Toggle tema */}
              <Button
                variant="secondary"
                onClick={toggleTheme}
                icon={themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                className="!p-3"
                title={`Cambiar a modo ${themeMode === 'light' ? 'oscuro' : 'claro'}`}
              />

              {/* Generar PDF */}
              <Button
                variant="success"
                onClick={handleGeneratePDF}
                icon={<Download size={20} />}
                className="hidden md:flex"
              >
                Generar PDF
              </Button>

              {/* Reset */}
              <Button
                variant="danger"
                onClick={handleReset}
                icon={<RotateCcw size={20} />}
                className="hidden md:flex"
              >
                Reiniciar
              </Button>
            </div>
          </div>

          {/* Botones móviles */}
          <div className="flex md:hidden gap-2 mt-3">
            <Button
              variant="success"
              onClick={handleGeneratePDF}
              icon={<Download size={18} />}
              className="flex-1 !text-sm"
            >
              PDF
            </Button>
            <Button
              variant="danger"
              onClick={handleReset}
              icon={<RotateCcw size={18} />}
              className="flex-1 !text-sm"
            >
              Reiniciar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Información del Vehículo - Primero y a todo lo ancho */}
          <VehiculoSection />

          {/* Información del Cliente - Después y a todo lo ancho */}
          <ClienteSection />

          {/* Inspección Visual del Vehículo */}
          <InspeccionSection />

          {/* Problema y Diagnóstico */}
          <ProblemaSection />

          {/* Servicios */}
          <ServiciosSection />

          {/* Refacciones y Mano de Obra */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RefaccionesSection />
            <ManoObraSection />
          </div>

          {/* Resumen Financiero */}
          <ResumenSection />

          {/* Garantía */}
          <GarantiaSection />
        </div>
      </main>


      {/* Footer */}
      <footer className="mt-12 py-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 no-print">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1">SAG Garage - Sistema de Presupuestos</p>
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
            <p className="mt-2 text-xs">
              Desarrollado con ❤️ usando React + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
