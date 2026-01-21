import React from 'react';
import { Car, Palette, CreditCard, Gauge } from 'lucide-react';
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
            <Car size={20} className="text-green-600" />
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
            <Gauge size={20} className="text-green-600" />
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
                <input
                  type="date"
                  value={(() => {
                    const fecha = presupuesto.fechaEntrada;
                    if (!fecha) return '';
                    try {
                      const dateObj = fecha instanceof Date ? fecha : new Date(fecha as any);
                      if (isNaN(dateObj.getTime())) return '';
                      // Usar fecha local en lugar de UTC
                      const year = dateObj.getFullYear();
                      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                      const day = String(dateObj.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    } catch {
                      return '';
                    }
                  })()}
                  onChange={(e) => {
                    const store = usePresupuestoStore.getState();
                    store.presupuesto.fechaEntrada = e.target.value ? new Date(e.target.value + 'T00:00:00') : new Date();
                    usePresupuestoStore.setState({ presupuesto: store.presupuesto });
                  }}
                  disabled={disabled}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-0 focus:border-green-600 dark:focus:border-green-500 transition-all duration-200 ease-out disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Salida
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={(() => {
                    const fecha = presupuesto.fechaSalida;
                    if (!fecha) return '';
                    try {
                      const dateObj = fecha instanceof Date ? fecha : new Date(fecha as any);
                      if (isNaN(dateObj.getTime())) return '';
                      // Usar fecha local en lugar de UTC
                      const year = dateObj.getFullYear();
                      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                      const day = String(dateObj.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    } catch {
                      return '';
                    }
                  })()}
                  onChange={(e) => {
                    const store = usePresupuestoStore.getState();
                    store.presupuesto.fechaSalida = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                    usePresupuestoStore.setState({ presupuesto: store.presupuesto });
                  }}
                  disabled={disabled}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-0 focus:border-green-600 dark:focus:border-green-500 transition-all duration-200 ease-out disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de gasolina */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-green-600" />
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
