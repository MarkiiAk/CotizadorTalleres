import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { Card, Input } from '../ui';
import { usePresupuestoStore } from '../../store/usePresupuestoStore';

interface ClienteSectionProps {
  disabled?: boolean;
}

export const ClienteSection: React.FC<ClienteSectionProps> = ({ disabled = false }) => {
  const { presupuesto, updateCliente } = usePresupuestoStore();
  const { cliente } = presupuesto;

  const handleChange = (field: keyof typeof cliente) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateCliente({ [field]: e.target.value });
  };

  return (
    <Card
      title="Información del Cliente"
      subtitle="Datos de contacto del propietario del vehículo"
      className="p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre Completo"
          placeholder="Ej: Juan Pérez García"
          value={cliente.nombreCompleto}
          onChange={handleChange('nombreCompleto')}
          icon={<User size={20} />}
          required
          disabled={disabled}
        />
        
        <Input
          label="Teléfono"
          placeholder="Ej: 555-123-4567"
          value={cliente.telefono}
          onChange={handleChange('telefono')}
          icon={<Phone size={20} />}
          required
          disabled={disabled}
        />
        
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          value={cliente.email}
          onChange={handleChange('email')}
          icon={<Mail size={20} />}
          disabled={disabled}
        />
      </div>
    </Card>
  );
};
