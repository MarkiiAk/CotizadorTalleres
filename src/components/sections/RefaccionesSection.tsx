import React, { useState } from 'react';
import { Plus, X, Package } from 'lucide-react';
import { Card, Input, Button } from '../ui';
import { usePresupuestoStore } from '../../store/usePresupuestoStore';

interface RefaccionesSectionProps {
  disabled?: boolean;
}

export const RefaccionesSection: React.FC<RefaccionesSectionProps> = ({ disabled = false }) => {
  const { presupuesto, addRefaccion, deleteRefaccion } = usePresupuestoStore();
  const { refacciones } = presupuesto;
  
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');

  const handleAddRefaccion = () => {
    const cantidadNum = parseInt(cantidad);
    const costoNum = parseFloat(costoUnitario);

    if (nombre && cantidadNum > 0 && costoNum > 0) {
      addRefaccion({
        nombre,
        cantidad: cantidadNum,
        costoUnitario: costoNum,
      });
      
      // Reset form
      setNombre('');
      setCantidad('');
      setCostoUnitario('');
      setShowForm(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  return (
    <Card
      title="Refacciones"
      subtitle="Agrega las refacciones necesarias para la reparación"
      className="p-6"
    >
      {/* Lista de refacciones agregadas */}
      {refacciones.length > 0 && (
        <div className="mb-6 space-y-3">
          {refacciones.map((refaccion) => (
            <div
              key={refaccion.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3 flex-1">
                <Package className="text-primary-600 dark:text-primary-400" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {refaccion.nombre}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>Cant: {refaccion.cantidad}</span>
                    <span>Unitario: {formatCurrency(refaccion.costoUnitario)}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Total: {formatCurrency(refaccion.total)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => deleteRefaccion(refaccion.id)}
                icon={<X size={16} />}
                className="!p-2"
                disabled={disabled}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Botón para mostrar formulario */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-white dark:bg-gray-900
                     border-2 border-green-500 dark:border-green-400
                     text-green-600 dark:text-green-400 font-medium rounded-lg
                     hover:bg-green-50 dark:hover:bg-green-950/30
                     active:bg-green-100 dark:active:bg-green-950/50
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-900"
        >
          <Plus size={20} />
          <span>Agregar Refacción</span>
        </button>
      )}

      {/* Formulario para agregar refacción */}
      {showForm && (
        <div className="space-y-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Refacción"
              placeholder="Ej: Filtro de aceite"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={disabled}
            />

            <Input
              label="Cantidad"
              type="number"
              placeholder="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
              disabled={disabled}
            />

            <Input
              label="Costo Unitario"
              type="number"
              placeholder="0.00"
              value={costoUnitario}
              onChange={(e) => setCostoUnitario(e.target.value)}
              min="0"
              step="0.01"
              required
              disabled={disabled}
            />
          </div>

          {cantidad && costoUnitario && parseInt(cantidad) > 0 && parseFloat(costoUnitario) > 0 && (
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Total estimado:</span>{' '}
                {formatCurrency(parseInt(cantidad) * parseFloat(costoUnitario))}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="success"
              onClick={handleAddRefaccion}
              icon={<Plus size={20} />}
              disabled={
                disabled ||
                !nombre ||
                !cantidad ||
                !costoUnitario ||
                parseInt(cantidad) <= 0 ||
                parseFloat(costoUnitario) <= 0
              }
            >
              Agregar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setNombre('');
                setCantidad('');
                setCostoUnitario('');
              }}
              disabled={disabled}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {refacciones.length === 0 && !showForm && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay refacciones agregadas. Haz clic en "Agregar Refacción" para comenzar.
        </p>
      )}
    </Card>
  );
};
