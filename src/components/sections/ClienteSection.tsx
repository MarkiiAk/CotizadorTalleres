import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { Card, Input } from '../ui';
import { usePresupuestoStore } from '../../store/usePresupuestoStore';

export const ClienteSection: React.FC = () => {
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
        />
        
        <Input
          label="Teléfono"
          type="tel"
          placeholder="Ej: 55 1234 5678"
          value={cliente.telefono}
          onChange={handleChange('telefono')}
          icon={<Phone size={20} />}
          required
        />
        
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="Ej: cliente@ejemplo.com"
          value={cliente.email}
          onChange={handleChange('email')}
          icon={<Mail size={20} />}
        />
        
        <Input
          label="Domicilio"
          placeholder="Ej: Calle Principal #123, Col. Centro"
          value={cliente.domicilio}
          onChange={handleChange('domicilio')}
          icon={<MapPin size={20} />}
        />
      </div>
    </Card>
  );
};
