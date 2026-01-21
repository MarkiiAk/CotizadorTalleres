import React from 'react';
import { Car, Palette, CreditCard, Gauge, Calendar } from 'lucide-react';
import { Card, Input, FuelGauge } from '../ui';
import { usePresupuestoStore } from '../../store/usePresupuestoStore';

interface VehiculoSectionProps {
  disabled?: boolean;
}

export const VehiculoSection: React.FC<VehiculoSectionProps> = ({ disabled = false }) => {
  const { presupuesto, updateVehiculo } = usePresupuestoStore();
  const { vehiculo } = presupuesto;

  const handleChange = (field: keyof typeof vehiculo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateVehiculo({ [field]: e.target.value });
  };

  const handleFuelChange = (level: number) => {
    updateVehiculo({ nivelGasolina: level });
  };

  return (
    <Card
      title="Información del Vehículo"
      subtitle="Datos del automóvil y condiciones de entrada"
      className="p-6"
    >
      <div className="space-y-8">
        {/* Datos básicos del vehículo */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Car size={20} className="text-primary-600" />
            Datos del Vehículo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Marca"
              placeholder="Ej: Toyota, Honda, Ford"
              value={vehiculo.marca}
              onChange={handleChange('marca')}
              icon={<Car size={20} />}
              required
              disabled={disabled}
            />
            
            <Input
              label="Modelo"
              placeholder="Ej: Corolla 2020"
              value={vehiculo.modelo}
              onChange={handleChange('modelo')}
              icon={<Car size={20} />}
              required
              disabled={disabled}
            />
            
            <Input
              label="Color"
              placeholder="Ej: Blanco, Negro, Rojo"
              value={vehiculo.color}
              onChange={handleChange('color')}
              icon={<Palette size={20} />}
              disabled={disabled}
            />
            
            <Input
              label="Placas"
              placeholder="Ej: ABC-123-D"
              value={vehiculo.placas}
              onChange={handleChange('placas')}
              icon={<CreditCard size={20} />}
              required
              disabled={disabled}
            />
          </div>
        </div>

        {/* Kilometraje y fechas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-primary-600" />
            Kilometraje y Fechas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Kms de Entrada"
              placeholder="Ej: 50,000 km"
              value={vehiculo.kilometrajeEntrada}
              onChange={handleChange('kilometrajeEntrada')}
              icon={<Gauge size={20} />}
              required
              disabled={disabled}
            />
            
            <Input
              label="Kms de Salida"
              placeholder="Ej: 50,050 km"
              value={vehiculo.kilometrajeSalida}
              onChange={handleChange('kilometrajeSalida')}
              icon={<Gauge size={20} />}
              disabled={disabled}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Entrada
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={(() => {
                    const fecha = presupuesto.fechaEntrada;
                    if (!fecha) return '';
                    try {
                      const dateObj = fecha instanceof Date ? fecha : new Date(fecha as any);
                      if (isNaN(dateObj.getTime())) return '';
                      return dateObj.toISOString().split('T')[0];
                    } catch {
                      return '';
                    }
                  })()}
                  onChange={(e) => {
                    const store = usePresupuestoStore.getState();
                    store.presupuesto.fechaEntrada = e.target.value ? new Date(e.target.value) : new Date();
                    usePresupuestoStore.setState({ presupuesto: store.presupuesto });
                  }}
                  disabled={disabled}
                  className="pl-10 w-full px-4 py-2.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Salida 
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={(() => {
                    const fecha = presupuesto.fechaSalida;
                    if (!fecha) return '';
                    try {
                      const dateObj = fecha instanceof Date ? fecha : new Date(fecha as any);
                      if (isNaN(dateObj.getTime())) return '';
                      return dateObj.toISOString().split('T')[0];
                    } catch {
                      return '';
                    }
                  })()}
                  onChange={(e) => {
                    const store = usePresupuestoStore.getState();
                    store.presupuesto.fechaSalida = e.target.value ? new Date(e.target.value) : undefined;
                    usePresupuestoStore.setState({ presupuesto: store.presupuesto });
                  }}
                  disabled={disabled}
                  className="pl-10 w-full px-4 py-2.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de gasolina */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-primary-600" />
            Estado de Gasolina
          </h3>
          <div className="max-w-md">
            <FuelGauge
              level={vehiculo.nivelGasolina}
              onChange={handleFuelChange}
              label="Nivel de Gasolina al Ingreso"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
