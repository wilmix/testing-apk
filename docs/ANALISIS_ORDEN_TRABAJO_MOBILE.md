# 📱 Análisis UX/UI: Adaptación de OrdenTrabajo a React Native

## 🎯 Objetivo
Transformar un formulario web complejo (`OrdenTrabajo.tsx`) en una experiencia mobile optimizada para **field workers** (técnicos en campo) con enfoque en:
- ⏱️ **Rapidez**: Minimizar tiempo de entrada de datos
- 📱 **Touch-friendly**: Botones grandes, inputs amplios, sin precisión
- 🌐 **Offline-first**: Funcionar sin conexión
- ⚡ **Validación real-time**: Feedback inmediato visual
- 🎯 **Progressive disclosure**: Mostrar solo campos necesarios

---

## 📊 Comparativa: Web vs Mobile

### OrdenTrabajo.tsx (Web - MUI)
```
ESTRUCTURA:
├─ Cabecera (4 campos: 2 dates + cliente + dirección/agencia)
├─ Detalles Extintores (dinámico, múltiples items)
│  ├─ Número extintor
│  ├─ Capacidad unidad (dropdown)
│  ├─ Capacidad valor (dropdown dependiente)
│  ├─ Marca (dropdown)
│  └─ Tipo (dropdown)
├─ Observaciones (TextArea)
└─ Préstamo extintores (Checkbox + cantidad condicional)

CARACTERÍSTICAS:
✓ Grid layout 6/12 columnas
✓ Dropdowns nativos MUI
✓ Autocomplete para cliente
✓ Validación en submit
✓ Card containers para secciones
```

### Problemas en Mobile
❌ Grid 6/12 → tamaño micro en mobile  
❌ Dropdowns nativos MUI no optimizados touch  
❌ Autocomplete complejo para pantalla pequeña  
❌ Scroll horizontal involuntario  
❌ Validación tardía (en submit)  
❌ Sin persistencia local  

---

## 🏗️ Arquitectura Propuesta

### Stack Tecnológico
```
STORAGE (Offline-first):
├─ react-native-mmkv (Principal) ⭐
│  └─ Velocidad: ~30x vs AsyncStorage
│  └─ Sincrónico + asincrónico
│  └─ Encriptación opcional
│  └─ Hooks nativos para React
└─ @react-native-async-storage (Fallback)

FORMS & VALIDATION:
├─ React Hooks (useState, useReducer)
├─ zod (Schema validation)
└─ Custom hooks para MMKV + validación

UI COMPONENTS:
├─ react-native-element-dropdown
│  └─ Search en dropdowns
│  └─ Touch-optimized
│  └─ Customizable
├─ React Native DatePicker (nativo)
├─ Componentes base custom

FEEDBACK:
├─ react-native built-in (Alert, Toast concept)
└─ Visual validation (border colors, icons)
```

### Patrones de Diseño
```
PROGRESIVO:
1. Header mínimo (cliente + fecha entrega)
2. Al seleccionar cliente → mostrar dirección/agencia
3. Al confirmar cabecera → detalles
4. Al llenar detalles → observaciones + préstamo

VALIDACIÓN REAL-TIME:
- Tipo: required, format, existencia en BD
- Feedback: 🟢 (válido) 🟡 (warning) 🔴 (error)
- Sin bloquear, solo indicar estado

OFFLINE:
- Guardar en MMKV mientras se completa
- Sincronizar cuando hay conexión
- Indicador de estado: "sin guardar" / "guardando" / "guardado"

TOUCH-FRIENDLY:
- Botones ≥48px
- Inputs ≥44px altura
- Espaciado ≥16px
- Single column layout
```

---

## 📐 Wireframe Conceptual (Flujo Progresivo)

```
PASO 1 - HEADER MÍNIMO
┌─────────────────────────┐
│ Nueva Orden de Trabajo  │
├─────────────────────────┤
│ [Seleccionar Cliente] ↓ │ ← Dropdown searchable
│  (MMKV cached options)  │
│                         │
│ [Fecha Entrega: hoy] 🗓 │ ← Date picker nativo
├─────────────────────────┤
│ [Continuar →]           │ ← Validar cliente seleccionado
└─────────────────────────┘

PASO 2 - UBICACIÓN (Condicional)
Si cliente = "BANCO SOLIDARIO S.A.":
┌─────────────────────────┐
│ [Seleccionar Agencia] ↓ │ ← Dropdown (7 opciones)
└─────────────────────────┘

Si otro cliente:
┌─────────────────────────┐
│ [Dirección]             │ ← TextInput
│ [Teléfono]              │ ← TextInput
└─────────────────────────┘

PASO 3 - DETALLES EXTINTORES
┌─────────────────────────┐
│ Extintor #1             │
├─────────────────────────┤
│ [#Extintor]             │ ← TextInput
│ [Unidad] ↓              │ ← Dropdown (3 opciones: KILOS, LIBRAS, LITROS)
│ [Capacidad] ↓           │ ← Dropdown dependiente de Unidad
│ [Marca] ↓               │ ← Dropdown search (11 marcas)
│ [Tipo] ↓                │ ← Dropdown (6 tipos)
├─────────────────────────┤
│ [+ Agregar]  [Eliminar] │
└─────────────────────────┘

PASO 4 - OBSERVACIONES & PRÉSTAMO
┌─────────────────────────┐
│ [Observaciones]         │ ← TextArea expandible
│                         │
│                         │
├─────────────────────────┤
│ ☐ Préstamo extintores   │ ← Checkbox
│   (Si checked)          │
│   [Cantidad: 0] + -     │ ← Stepper o number input
├─────────────────────────┤
│ [Limpiar]  [Crear]      │
└─────────────────────────┘
```

---

## 🔄 Hooks Reutilizables

### 1. `useFormData`
```typescript
useFormData<T>(
  storageKey: string,
  initialValue: T,
  schema: ZodSchema
): {
  data: T
  errors: Partial<Record<keyof T, string>>
  isDirty: boolean
  isSaving: boolean
  updateField: (field: keyof T, value: any) => void
  validateField: (field: keyof T) => boolean
  save: () => Promise<void>
  reset: () => void
}
```

### 2. `useOfflineStorage`
```typescript
useOfflineStorage(key: string): {
  value: string | null
  save: (data: any) => void
  load: () => any
  clear: () => void
  status: 'offline' | 'syncing' | 'synced'
}
```

### 3. `useFieldVisibility`
```typescript
useFieldVisibility(
  dependencies: Record<string, any>
): (field: string) => boolean
```

Ejemplos:
- Mostrar dirección/agencia solo si cliente seleccionado
- Mostrar cantidad préstamo solo si checkbox marcado
- Mostrar capacidad valor solo si unidad seleccionada

---

## 📦 Estructura de Carpetas

```
src/
├─ components/
│  ├─ OrdenTrabajo/
│  │  ├─ OrdenTrabajoMobile.tsx        (Componente principal)
│  │  ├─ FormSectionHeader.tsx         (Section titles)
│  │  └─ DetalleItem.tsx               (Item extintor dinámico)
│  ├─ FormFields/
│  │  ├─ FormInput.tsx                 (TextInput base)
│  │  ├─ FormDropdown.tsx              (Element Dropdown wrapper)
│  │  ├─ FormDatePicker.tsx            (Date picker wrapper)
│  │  └─ FormSwitch.tsx                (Checkbox base)
│  └─ Feedback/
│     ├─ ValidationIcon.tsx            (🟢🟡🔴)
│     └─ Toast.tsx                     (Notificaciones)
├─ hooks/
│  ├─ useFormData.ts
│  ├─ useOfflineStorage.ts
│  ├─ useFieldVisibility.ts
│  └─ useMMKVStorage.ts
├─ services/
│  ├─ storageService.ts                (MMKV + AsyncStorage)
│  ├─ validationService.ts             (Zod schemas)
│  └─ ordenTrabajoService.ts           (Business logic)
├─ constants/
│  └─ ordenTrabajoConstants.ts         (MARCAS, TIPOS, etc)
├─ types/
│  └─ ordenTrabajo.ts                  (TypeScript types)
└─ utils/
   └─ validators.ts                    (Custom validators)
```

---

## 🎬 Plan de Implementación (7 Pasos)

### Fase 1️⃣: Setup Inicial
- [ ] Instalar dependencias
- [ ] Configurar MMKV storage
- [ ] Crear estructura de carpetas
- [ ] TypeScript types

### Fase 2️⃣: Hooks Base
- [ ] `useMMKVStorage` hook
- [ ] `useFormData` hook
- [ ] `useFieldVisibility` hook
- [ ] Validación con zod

### Fase 3️⃣: Componentes UI Base
- [ ] `FormInput`, `FormDropdown`, `FormDatePicker`
- [ ] `ValidationIcon`, feedback visual
- [ ] Estilos consistentes (colores, tamaños)

### Fase 4️⃣: Orden Trabajo - Header
- [ ] Cliente autocomplete (options cached en MMKV)
- [ ] Fecha entrega date picker
- [ ] Validación real-time
- [ ] Persistencia en MMKV

### Fase 5️⃣: Orden Trabajo - Detalles
- [ ] Formulario dinámico items
- [ ] Dropdowns dependientes (Unidad → Capacidad)
- [ ] Add/Remove items
- [ ] Validación por item

### Fase 6️⃣: Orden Trabajo - Final
- [ ] Observaciones textarea
- [ ] Préstamo con reveal condicional
- [ ] Submit + validación completa
- [ ] Feedback visual (loading, success, error)

### Fase 7️⃣: Testing & Optimización
- [ ] Offline functionality
- [ ] Performance scrolling
- [ ] Responsive design
- [ ] UX testing

---

## ✅ Criterios de Aceptación por Fase

### Fase 4 (Header)
```
✓ Cliente seleccionable vía dropdown con search
✓ Fecha de entrega con date picker nativo
✓ Validación real-time: cliente requerido
✓ Guardado automático en MMKV cada 2 segundos
✓ Botón continuar deshabilitado sin cliente
✓ Visual: botones ≥48px, inputs ≥44px
✓ Funciona sin internet
```

### Fase 5 (Detalles)
```
✓ Agregar/eliminar items de extintores
✓ Cascada: seleccionar unidad → actualiza opciones capacidad
✓ Dropdown marca y tipo con search funcionan
✓ Validación por item: número extintor requerido
✓ Visual: scroll fluido, items claros
✓ Persistencia de items en MMKV
```

### Fase 6 (Final)
```
✓ Observaciones textarea expandible
✓ Checkbox préstamo → reveal cantidad
✓ Stepper cantidad (min 1, max 99)
✓ Submit validación completa
✓ Success toast + limpiar form
✓ Manejo error submit (offline → queue)
```

---

## 🛠️ Comandos Instalación

```bash
# Dependencias principales
npx expo install react-native-mmkv
npx expo install react-native-element-dropdown
npx expo install zod
npx expo install @react-native-community/datetimepicker

# Opcional para mejor UX
npx expo install expo-haptics  # Feedback háptico
npx expo install react-native-reanimated  # Animaciones smooth
```

---

## 🚀 Roadmap

```
SEMANA 1:
├─ Lunes: Setup + Hooks base (Fases 1-2)
├─ Martes-Miércoles: Componentes UI (Fase 3)
├─ Jueves-Viernes: Header form (Fase 4) ✅ APPROVAL POINT

SEMANA 2:
├─ Lunes-Martes: Detalles dinámicos (Fase 5) ✅ APPROVAL POINT
├─ Miércoles-Jueves: Final + Submit (Fase 6) ✅ APPROVAL POINT
└─ Viernes: Testing y optimización (Fase 7) ✅ APPROVAL POINT
```

---

## 📌 Consideraciones Especiales

### Offline-First
- MMKV almacena formularios en progreso
- Al recuperar conexión, sincronizar con API
- Indicador visual: "⚠️ sin conexión" o "✓ sincronizado"

### Performance
- Lazy load de opciones (MARCAS, TIPOS) en MMKV
- No renderizar todos los items si están hidden
- Memoizar componentes form para evitar re-renders

### Accesibilidad
- Labels claros y readable
- Touch targets ≥48x48px
- Alto contraste en validación
- Estructura lógica de tabs

### Localización
- Español por defecto (ya en constants)
- Dates en formato local (es_ES)
- Mensajes de validación en español

---

## 📝 Notas Técnicas

1. **MMKV vs AsyncStorage**: MMKV es ~30x más rápido, sincrónico, pero requiere compilación nativa. Para Expo es compatible.

2. **Validación con Zod**: Schema-based, type-safe, permite mensajes custom en español.

3. **Element Dropdown vs Picker**: Element Dropdown soporta search, mejor UX mobile que Picker nativo.

4. **Date Picker**: Usar `@react-native-community/datetimepicker` (nativo) con fallback a picker custom.

5. **Cascada Campos**: Usar `useEffect` en `useFormData` para recalcular opciones dependientes.

---

## 🎯 Próximos Pasos

1. ✅ Leer y aprobar este análisis
2. ⏭️ Crear archivo de setup (Fase 1)
3. ⏭️ Implementar hooks (Fase 2)
4. ⏭️ Crear componentes UI (Fase 3)
5. ⏭️ Fase 4 Header (primera iteración testeable)

**¿Aprobado para proceder con Fase 1-3?**
