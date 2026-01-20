# 🚗 SAG Garage - Sistema de Presupuestos

Sistema moderno de generación de presupuestos para taller mecánico SAG Garage, desarrollado con las mejores prácticas de UX y tecnologías web modernas.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz hermosa y profesional inspirada en los mejores UX de Silicon Valley
- 🌓 **Tema Oscuro/Claro**: Cambia entre modos según tu preferencia
- 💾 **Autoguardado**: Tus datos se guardan automáticamente en el navegador
- 📱 **Responsive**: Funciona perfectamente en móviles, tablets y desktop
- ⚡ **Performance**: Optimizado para cargar rápidamente
- 🔒 **TypeScript**: Código robusto y mantenible con tipado estático
- 📄 **Gestión de Garantía**: Sistema completo de póliza de garantía integrado

## 🛠️ Tecnologías

- **React 18** - Framework UI moderno
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Framework CSS utility-first
- **Zustand** - State management ligero
- **Lucide React** - Iconos modernos
- **React PDF** - Generación de PDFs (próximamente)

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn

## 🚀 Instalación

1. **Navega al directorio del proyecto:**
   ```bash
   cd sag-garage-presupuestos
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:5173
   ```

## 📦 Scripts Disponibles

```bash
# Desarrollo - Inicia servidor local con hot reload
npm run dev

# Build - Genera versión optimizada para producción
npm run build

# Preview - Previsualiza la build de producción
npm run preview

# Lint - Verifica el código
npm run lint
```

## 🏗️ Estructura del Proyecto

```
sag-garage-presupuestos/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── sections/      # Secciones del formulario
│   │       ├── ClienteSection.tsx
│   │       ├── VehiculoSection.tsx
│   │       ├── ServiciosSection.tsx
│   │       ├── RefaccionesSection.tsx
│   │       ├── ManoObraSection.tsx
│   │       ├── ResumenSection.tsx
│   │       ├── GarantiaSection.tsx
│   │       └── index.ts
│   ├── constants/         # Constantes de la aplicación
│   │   ├── garantia.ts
│   │   └── servicios.ts
│   ├── store/             # Estado global (Zustand)
│   │   └── usePresupuestoStore.ts
│   ├── types/             # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML base
├── package.json           # Dependencias
├── tailwind.config.js     # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
└── vite.config.ts         # Configuración Vite
```

## 🎯 Funcionalidades

### 1. Información del Cliente
- Captura datos completos del cliente
- Validación de campos requeridos
- Interfaz intuitiva

### 2. Información del Vehículo
- Marca, modelo, color
- Placas y kilometraje
- Diseño moderno con iconos

### 3. Servicios
- Catálogo predefinido de servicios
- Servicios personalizados
- Gestión dinámica

### 4. Refacciones
- Descripción, cantidad y costo
- Cálculo automático de totales
- Lista editable

### 5. Mano de Obra
- Conceptos de trabajo
- Precios personalizados
- Interfaz clara

### 6. Resumen Financiero
- Desglose por categorías
- Cálculo de anticipo
- Saldo restante
- Visualización profesional

### 7. Póliza de Garantía
- Términos completos
- Expandible/colapsable
- Aceptación del cliente
- Información del PDF original

## 🌐 Deployment en Neubox

Este proyecto está optimizado para funcionar en hosting **Neubox**:

1. **Build del proyecto:**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `dist/` a tu hosting Neubox**

3. **Configura el dominio** para apuntar a la carpeta dist

## 💡 Características Técnicas

### State Management
- **Zustand** para estado global eficiente
- Persistencia automática en localStorage
- Cálculos reactivos en tiempo real

### Diseño UX/UI
- Transiciones suaves y animaciones
- Feedback visual claro
- Diseño accesible (WCAG)
- Micro-interacciones pulidas

### Performance
- Code splitting automático
- Lazy loading de componentes
- Optimización de bundle size
- Fast Refresh en desarrollo

## 🔮 Próximas Funcionalidades

- [ ] Generación de PDF completa
- [ ] Firma digital del cliente
- [ ] Exportar a Excel
- [ ] Sistema de plantillas
- [ ] Historial de presupuestos
- [ ] Modo impresión optimizado

## 📝 Notas

- Los datos se guardan automáticamente en el navegador (localStorage)
- El tema (oscuro/claro) se recuerda entre sesiones
- Compatible con todos los navegadores modernos

## 🤝 Soporte

Para soporte o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para SAG Garage**
