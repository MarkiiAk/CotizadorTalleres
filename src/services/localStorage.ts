import { Orden } from '../types';

const STORAGE_KEYS = {
  USER: 'sag_garage_user',
  TOKEN: 'sag_garage_token',
  ORDENES: 'sag_garage_ordenes',
};

// Usuario por defecto
const DEFAULT_USER = {
  id: '1',
  username: 'admin',
  password: 'admin123', // En producción esto debería estar hasheado
  nombre: 'Administrador',
};

export const localStorageService = {
  // Autenticación
  login: (username: string, password: string): Promise<{ token: string; user: any }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
          const token = `token_${Date.now()}_${Math.random()}`;
          const user = {
            id: DEFAULT_USER.id,
            username: DEFAULT_USER.username,
            nombre: DEFAULT_USER.nombre,
          };
          
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
          
          resolve({ token, user });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 300);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        resolve();
      }, 100);
    });
  },

  verifyToken: (): Promise<{ user: any }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            resolve({ user });
          } catch {
            reject(new Error('Token inválido'));
          }
        } else {
          reject(new Error('No autenticado'));
        }
      }, 200);
    });
  },

  // Generar folio en formato SAG-DDMMYYYY-ID
  generateFolio: (ordenes: Orden[]): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    // Obtener el siguiente ID numérico
    const nextId = ordenes.length + 1;
    
    return `SAG-${day}${month}${year}-${nextId}`;
  },

  // Órdenes
  getOrdenes: (): Promise<Orden[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ordenesStr = localStorage.getItem(STORAGE_KEYS.ORDENES);
        if (ordenesStr) {
          try {
            const ordenes = JSON.parse(ordenesStr);
            resolve(ordenes);
          } catch {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      }, 200);
    });
  },

  getOrden: (id: string): Promise<Orden | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ordenesStr = localStorage.getItem(STORAGE_KEYS.ORDENES);
        if (ordenesStr) {
          try {
            const ordenes: Orden[] = JSON.parse(ordenesStr);
            const orden = ordenes.find((o) => o.id === id);
            resolve(orden || null);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  createOrden: (ordenData: Omit<Orden, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Orden> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ordenesStr = localStorage.getItem(STORAGE_KEYS.ORDENES);
        const ordenes: Orden[] = ordenesStr ? JSON.parse(ordenesStr) : [];
        
        // Generar folio en el nuevo formato
        const folio = localStorageService.generateFolio(ordenes);
        
        const newOrden: Orden = {
          ...ordenData,
          id: `ORD-${Date.now()}`,
          folio,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        };
        
        ordenes.push(newOrden);
        localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(ordenes));
        
        resolve(newOrden);
      }, 300);
    });
  },

  updateOrden: (id: string, ordenData: Partial<Orden>): Promise<Orden> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ordenesStr = localStorage.getItem(STORAGE_KEYS.ORDENES);
        if (!ordenesStr) {
          reject(new Error('No se encontraron órdenes'));
          return;
        }
        
        const ordenes: Orden[] = JSON.parse(ordenesStr);
        const index = ordenes.findIndex((o) => o.id === id);
        
        if (index === -1) {
          reject(new Error('Orden no encontrada'));
          return;
        }
        
        ordenes[index] = {
          ...ordenes[index],
          ...ordenData,
          id,
          fechaActualizacion: new Date().toISOString(),
        };
        
        localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(ordenes));
        resolve(ordenes[index]);
      }, 300);
    });
  },

  deleteOrden: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ordenesStr = localStorage.getItem(STORAGE_KEYS.ORDENES);
        if (!ordenesStr) {
          reject(new Error('No se encontraron órdenes'));
          return;
        }
        
        const ordenes: Orden[] = JSON.parse(ordenesStr);
        const filteredOrdenes = ordenes.filter((o) => o.id !== id);
        
        localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(filteredOrdenes));
        resolve();
      }, 300);
    });
  },
};
