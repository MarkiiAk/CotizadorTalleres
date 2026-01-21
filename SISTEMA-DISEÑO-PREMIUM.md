# Sistema de Diseño Premium - SAG Garage

## 🎨 Paleta de Colores

### Color Principal - Verde Neón SAG
Basado en el verde neón vibrante característico de la marca SAG Garage, inspirado en diseño de nivel Apple/Silicon Valley.

**Escala de Verde Primary:**
- `primary-50`: #f0ffe5 - Backgrounds sutiles
- `primary-100`: #dcffc7 - Badges y highlights
- `primary-200`: #bdff94 - Borders activos
- `primary-300`: #8fff56 - Estados hover
- `primary-400`: #66ff1f - Verde neón base
- `primary-500`: #4ae600 - **Color principal** ⭐
- `primary-600`: #37b800 - Gradientes
- `primary-700`: #2a8b00 - Textos sobre fondos claros
- `primary-800`: #246e07 - Elementos oscuros
- `primary-900`: #1f5c0b - Máximo contraste
- `primary-950`: #0d3302 - Textos sobre primary

### Colores Secundarios - Grises Premium
Inspirados en la paleta de grises de sistemas premium (iOS, macOS).

**Escala Secondary (Slate):**
- Desde `secondary-50` (#f8fafc) hasta `secondary-950` (#020617)
- Perfectos para textos, bordes y backgrounds neutros

### Color Acento - Dorado Premium
Para highlights especiales y elementos de valor.

**Escala Accent (Amber):**
- Desde `accent-50` (#fffbeb) hasta `accent-950` (#451a03)
- Usar con moderación para elementos premium

### Colores de Estado

**Success (Verde):**
- `success-light`: #4ade80
- `success`: #22c55e
- `success-dark`: #16a34a

**Warning (Ámbar):**
- `warning-light`: #fbbf24
- `warning`: #f59e0b
- `warning-dark`: #d97706

**Error (Rojo):**
- `error-light`: #f87171
- `error`: #ef4444
- `error-dark`: #dc2626

**Info (Azul):**
- `info-light`: #60a5fa
- `info`: #3b82f6
- `info-dark`: #2563eb

---

## 🌓 Modos de Tema

### Light Mode
- Background principal: Gradiente de #f8fafc a #e2e8f0
- Tarjetas: Blanco con sombras sutiles
- Texto: #1e293b (secondary-800)
- Bordes: Grises claros

### Dark Mode
- Background principal: Gradiente de #0f172a a #1e293b
- Tarjetas: #1e293b con sombras oscuras
- Texto: #f1f5f9 (secondary-100)
- Verde más vibrante para mejor contraste: #66ff1f

---

## 🎭 Componentes Premium

### Botones

```tsx
// Primario - Principal CTA
<button className="btn-primary">
  Acción Principal
</button>

// Secundario - Acciones normales
<button className="btn-secondary">
  Acción Secundaria
</button>

// Outline - Acciones terciarias
<button className="btn-outline">
  Acción Terciaria
</button>

// Ghost - Acciones sutiles
<button className="btn-ghost">
  Acción Sutil
</button>

// Danger - Acciones destructivas
<button className="btn-danger">
  Eliminar
</button>

// Success - Confirmaciones
<button className="btn-success">
  Confirmar
</button>
```

### Tarjetas

```tsx
// Tarjeta estándar
<div className="card">
  Contenido
</div>

// Tarjeta con hover effect
<div className="card-hover">
  Contenido interactivo
</div>

// Tarjeta con efecto glow (verde neón)
<div className="card-glow">
  Contenido destacado
</div>

// Tarjeta glass effect
<div className="glass">
  Contenido con efecto cristal
</div>
```

### Inputs

```tsx
// Input estándar
<input className="input" />

// Input con error
<input className="input-error" />

// Input con éxito
<input className="input-success" />

// Label
<label className="label">Campo</label>

// Label requerido
<label className="label label-required">Campo Obligatorio</label>
```

### Badges

```tsx
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
<span className="badge-info">Info</span>
```

---

## ✨ Efectos Especiales

### Sombras

**Light Mode:**
- `shadow-soft`: Sombra muy sutil para elevación mínima
- `shadow-medium`: Sombra estándar para tarjetas
- `shadow-hard`: Sombra fuerte para modales/popups
- `shadow-xl`: Sombra máxima
- `shadow-2xl`: Sombra épica
- `shadow-glow`: Efecto glow verde neón ⚡
- `shadow-glow-sm`: Glow pequeño
- `shadow-glow-lg`: Glow grande

**Dark Mode:**
- `shadow-dark-sm`, `shadow-dark-md`, `shadow-dark-lg`

### Animaciones

```tsx
// Fade in/out
<div className="animate-fade-in">Aparece suavemente</div>

// Slide animations
<div className="animate-slide-up">Sube desde abajo</div>
<div className="animate-slide-down">Baja desde arriba</div>
<div className="animate-slide-left">Entra desde derecha</div>
<div className="animate-slide-right">Entra desde izquierda</div>

// Scale
<div className="animate-scale-in">Crece al aparecer</div>

// Custom
<div className="animate-pulse-glow">Pulsa con glow verde</div>
<div className="float-animation">Flota suavemente</div>
<div className="glow-animation">Efecto glow continuo</div>
```

### Gradientes

```tsx
// Texto con gradiente
<h1 className="text-gradient">Texto Premium</h1>

// Background gradiente
<div className="bg-gradient-primary">
  Con gradiente verde
</div>
```

---

## 📐 Espaciado

```tsx
// Contenedor principal
<div className="container-custom">
  Contenido con max-width y padding responsive
</div>

// Títulos de sección
<h2 className="section-title">Título Principal</h2>
<p className="section-subtitle">Subtítulo descriptivo</p>
```

---

## 🎯 Principios de Diseño

### 1. **Minimalismo Funcional**
- Espacios en blanco generosos
- Jerarquía visual clara
- Elementos solo cuando son necesarios

### 2. **Transiciones Suaves**
- Todas las interacciones tienen transiciones Apple-style
- Timing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Duraciones: 150ms (fast), 250ms (normal), 350ms (slow)

### 3. **Consistencia Visual**
- Border radius consistente (0.75rem - 1.5rem)
- Espaciado en múltiplos de 8px
- Tipografía limitada (2-3 tamaños por sección)

### 4. **Accesibilidad**
- Contraste WCAG AA mínimo
- Focus visible en todos los elementos interactivos
- Soporte para `prefers-reduced-motion`

### 5. **Verde Neón con Elegancia**
- Usar el verde principal con moderación
- Combinar con grises premium para balance
- Efecto glow solo en CTAs principales

---

## 🚀 Uso Recomendado

### Botones Principales
- Usar `btn-primary` solo para la acción principal de cada página/sección
- Máximo 1-2 botones primarios visibles al mismo tiempo

### Tarjetas
- Usar `card` para agrupaciones de información
- `card-hover` para elementos clickeables
- `card-glow` solo para destacar información crítica

### Verde Neón
- Usar para CTAs principales
- Indicadores de estado activo
- Highlights importantes
- ⚠️ No abusar - menos es más

### Dark Mode
- Automático según preferencia del sistema
- Toggle manual disponible en la UI
- Colores ajustados para mejor contraste nocturno

---

## 📱 Responsive

Todos los componentes son completamente responsive:
- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Tipografía escalable
- Espaciado adaptativo

---

## 🎨 Variables CSS Personalizadas

Disponibles en `:root` para uso directo:

```css
--color-primary: #4ae600
--bg-light: #ffffff
--bg-dark: #0f172a
--shadow-glow: 0 0 20px rgba(74, 230, 0, 0.4)
--transition-normal: 250ms cubic-bezier(0.16, 1, 0.3, 1)
/* Y más... */
```

---

## 💡 Consejos Finales

1. **Prioriza la legibilidad** sobre la estética
2. **Usa el verde estratégicamente** para guiar la atención
3. **Mantén la consistencia** en toda la aplicación
4. **Piensa en mobile primero** al diseñar nuevas vistas
5. **Prueba en dark mode** cada nuevo componente

---

**Creado con 💚 para SAG Garage**
*Sistema de diseño nivel Silicon Valley*
