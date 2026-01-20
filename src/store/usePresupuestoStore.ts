import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Presupuesto, Servicio, Refaccion, ManoDeObra, ThemeMode, InspeccionVehiculo } from '../types';

interface PresupuestoState {
  // Estado del presupuesto
  presupuesto: Presupuesto;
  
  // Tema
  themeMode: ThemeMode;
  
  // Autoguardado
  autoSave: boolean;
  lastSaved: Date | null;
  
  // Acciones del presupuesto
  updateTaller: (data: Partial<Presupuesto['taller']>) => void;
  updateCliente: (data: Partial<Presupuesto['cliente']>) => void;
  updateVehiculo: (data: Partial<Presupuesto['vehiculo']>) => void;
  
  // Servicios
  addServicio: (servicio: Omit<Servicio, 'id'>) => void;
  updateServicio: (id: string, servicio: Partial<Servicio>) => void;
  deleteServicio: (id: string) => void;
  
  // Refacciones
  addRefaccion: (refaccion: Omit<Refaccion, 'id' | 'total'>) => void;
  updateRefaccion: (id: string, refaccion: Partial<Refaccion>) => void;
  deleteRefaccion: (id: string) => void;
  
  // Mano de obra
  addManoDeObra: (manoDeObra: Omit<ManoDeObra, 'id'>) => void;
  updateManoDeObra: (id: string, manoDeObra: Partial<ManoDeObra>) => void;
  deleteManoDeObra: (id: string) => void;
  
  // Resumen financiero
  updateAnticipo: (anticipo: number) => void;
  calcularResumen: () => void;
  
  // Tema
  toggleTheme: () => void;
  
  // Autoguardado
  toggleAutoSave: () => void;
  
  // Reset
  resetPresupuesto: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const generateFolio = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SAG-${year}${month}${day}-${random}`;
};

const initialInspeccion: InspeccionVehiculo = {
  exteriores: {
    lucesFrontales: true,
    cuartoLuces: true,
    antena: true,
    espejosLaterales: true,
    cristales: true,
    emblemas: true,
    llantas: true,
    taponRuedas: true,
    moldurasCompletas: true,
    taponGasolina: true,
    limpiadores: true,
  },
  interiores: {
    instrumentoTablero: true,
    calefaccion: true,
    sistemaSonido: true,
    bocinas: true,
    espejoRetrovisor: true,
    cinturones: true,
    botoniaGeneral: true,
    manijas: true,
    tapetes: true,
    vestiduras: true,
    otros: true,
  },
  danosAdicionales: [],
};

const initialPresupuesto: Presupuesto = {
  id: generateId(),
  folio: generateFolio(),
  fecha: new Date(),
  fechaEntrada: new Date(),
  taller: {
    nombre: 'SAG Garage',
    encargado: '',
    telefono: '',
    direccion: '',
  },
  cliente: {
    nombreCompleto: '',
    telefono: '',
    email: '',
    domicilio: '',
  },
  vehiculo: {
    marca: '',
    modelo: '',
    color: '',
    placas: '',
    kilometrajeEntrada: '',
    kilometrajeSalida: '',
    nivelGasolina: 50,
  },
  inspeccion: initialInspeccion,
  problemaReportado: '',
  diagnosticoTecnico: '',
  servicios: [],
  refacciones: [],
  manoDeObra: [],
  resumen: {
    servicios: 0,
    refacciones: 0,
    manoDeObra: 0,
    subtotal: 0,
    anticipo: 0,
    restante: 0,
  },
};

export const usePresupuestoStore = create<PresupuestoState>()(
  persist(
    (set, get) => ({
      presupuesto: initialPresupuesto,
      themeMode: 'light',
      autoSave: true,
      lastSaved: null,

      // Actualizar información del taller
      updateTaller: (data) => {
        set((state) => ({
          presupuesto: {
            ...state.presupuesto,
            taller: { ...state.presupuesto.taller, ...data },
          },
          lastSaved: new Date(),
        }));
      },

      // Actualizar información del cliente
      updateCliente: (data) => {
        set((state) => ({
          presupuesto: {
            ...state.presupuesto,
            cliente: { ...state.presupuesto.cliente, ...data },
          },
          lastSaved: new Date(),
        }));
      },

      // Actualizar información del vehículo
      updateVehiculo: (data) => {
        set((state) => ({
          presupuesto: {
            ...state.presupuesto,
            vehiculo: { ...state.presupuesto.vehiculo, ...data },
          },
          lastSaved: new Date(),
        }));
      },

      // Agregar servicio
      addServicio: (servicio) => {
        set((state) => {
          const newServicio: Servicio = {
            ...servicio,
            id: generateId(),
          };
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              servicios: [...state.presupuesto.servicios, newServicio],
            },
            lastSaved: new Date(),
          };
          // Calcular resumen después de actualizar
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Actualizar servicio
      updateServicio: (id, servicio) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              servicios: state.presupuesto.servicios.map((s) =>
                s.id === id ? { ...s, ...servicio } : s
              ),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Eliminar servicio
      deleteServicio: (id) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              servicios: state.presupuesto.servicios.filter((s) => s.id !== id),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Agregar refacción
      addRefaccion: (refaccion) => {
        set((state) => {
          const total = refaccion.cantidad * refaccion.costoUnitario;
          const newRefaccion: Refaccion = {
            ...refaccion,
            id: generateId(),
            total,
          };
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              refacciones: [...state.presupuesto.refacciones, newRefaccion],
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Actualizar refacción
      updateRefaccion: (id, refaccion) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              refacciones: state.presupuesto.refacciones.map((r) => {
                if (r.id === id) {
                  const updated = { ...r, ...refaccion };
                  updated.total = updated.cantidad * updated.costoUnitario;
                  return updated;
                }
                return r;
              }),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Eliminar refacción
      deleteRefaccion: (id) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              refacciones: state.presupuesto.refacciones.filter((r) => r.id !== id),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Agregar mano de obra
      addManoDeObra: (manoDeObra) => {
        set((state) => {
          const newManoDeObra: ManoDeObra = {
            ...manoDeObra,
            id: generateId(),
          };
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              manoDeObra: [...state.presupuesto.manoDeObra, newManoDeObra],
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Actualizar mano de obra
      updateManoDeObra: (id, manoDeObra) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              manoDeObra: state.presupuesto.manoDeObra.map((m) =>
                m.id === id ? { ...m, ...manoDeObra } : m
              ),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Eliminar mano de obra
      deleteManoDeObra: (id) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              manoDeObra: state.presupuesto.manoDeObra.filter((m) => m.id !== id),
            },
            lastSaved: new Date(),
          };
          setTimeout(() => get().calcularResumen(), 0);
          return newState;
        });
      },

      // Actualizar anticipo
      updateAnticipo: (anticipo) => {
        set((state) => {
          const newState = {
            presupuesto: {
              ...state.presupuesto,
              resumen: {
                ...state.presupuesto.resumen,
                anticipo,
                restante: state.presupuesto.resumen.subtotal - anticipo,
              },
            },
            lastSaved: new Date(),
          };
          return newState;
        });
      },

      // Calcular resumen financiero
      calcularResumen: () => {
        set((state) => {
          const serviciosTotal = state.presupuesto.servicios.reduce(
            (sum, s) => sum + s.precio,
            0
          );
          const refaccionesTotal = state.presupuesto.refacciones.reduce(
            (sum, r) => sum + r.total,
            0
          );
          const manoDeObraTotal = state.presupuesto.manoDeObra.reduce(
            (sum, m) => sum + m.precio,
            0
          );
          const subtotal = serviciosTotal + refaccionesTotal + manoDeObraTotal;
          const restante = subtotal - state.presupuesto.resumen.anticipo;

          return {
            presupuesto: {
              ...state.presupuesto,
              resumen: {
                servicios: serviciosTotal,
                refacciones: refaccionesTotal,
                manoDeObra: manoDeObraTotal,
                subtotal,
                anticipo: state.presupuesto.resumen.anticipo,
                restante,
              },
            },
          };
        });
      },

      // Toggle tema
      toggleTheme: () => {
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        }));
      },

      // Toggle autoguardado
      toggleAutoSave: () => {
        set((state) => ({
          autoSave: !state.autoSave,
        }));
      },

      // Reset presupuesto
      resetPresupuesto: () => {
        set({
          presupuesto: {
            ...initialPresupuesto,
            id: generateId(),
            fecha: new Date(),
          },
          lastSaved: null,
        });
      },
    }),
    {
      name: 'sag-garage-presupuesto-storage',
      partialize: (state) => ({
        presupuesto: state.presupuesto,
        themeMode: state.themeMode,
        autoSave: state.autoSave,
      }),
    }
  )
);
