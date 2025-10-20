# 🚀 PLAN DE ACCIÓN: Orden de Trabajo Mobile - Fases Testeable y Aprobables

## 📍 Estado: LISTO PARA COMENZAR

**Fecha Inicio**: Hoy  
**Timeline Estimado**: 25-32 horas = ~4-5 días jornada completa  
**Approval Points**: 4 checkpoints testables

---

## FASE 1: SETUP INICIAL (2-3 horas) ⏱️

### 🎯 Objetivo
Preparar el proyecto base con dependencias instaladas y estructura de carpetas lista.

### 📋 Tareas

#### Tarea 1.1: Instalar Dependencias (30 min)
```bash
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-element-dropdown
npx expo install zod
npx expo install @react-native-community/datetimepicker
```

**Aceptación**: ✅ `npm list` muestra las 4 librerías instaladas

---

#### Tarea 1.2: Crear Estructura de Carpetas (20 min)
```
src/
├─ hooks/
│  ├─ useStorage.ts          # Hook AsyncStorage
│  ├─ useFormData.ts              # Hook validación + persistencia
│  └─ useFieldVisibility.ts       # Hook campos condicionales
├─ components/
│  ├─ FormFields/
│  │  ├─ FormInput.tsx            # Input base
│  │  ├─ FormDropdown.tsx         # Dropdown base
│  │  └─ FormDatePicker.tsx       # Date picker
│  ├─ Feedback/
│  │  └─ ValidationIcon.tsx       # Icono validación (🟢🟡🔴)
│  └─ OrdenTrabajo/
│     ├─ OrdenTrabajoMobile.tsx   # Form principal
│     └─ DetalleItem.tsx          # Item dinámico extintor
├─ services/
│  ├─ validationService.ts        # Schemas Zod
│  └─ ordenTrabajoService.ts      # Business logic
├─ constants/
│  └─ ordenTrabajoConstants.ts    # MARCAS, TIPOS, CLIENTES
├─ types/
│  └─ ordenTrabajo.ts             # TypeScript types
└─ utils/
   └─ formatters.ts               # Funciones utilitarias
```

**Aceptación**: ✅ Estructura creada, no hay errores al compilar

---

#### Tarea 1.3: Definir TypeScript Types (30 min)
Crear `src/types/ordenTrabajo.ts` con:
- `DetalleExtintor` (id, número, capacidad unidad, capacidad valor, marca, tipo)
- `OrdenTrabajoFormData` (cliente, fecha, ubicación, detalles[], observaciones, préstamo)
- `FormState` (data, errors, isLoading, lastSavedAt)
- `ValidationStatus` (valid, errors, touched)

**Aceptación**: ✅ TypeScript compila sin errores

---

#### Tarea 1.4: Crear Constants (20 min)
Copiar de `OrdenTrabajo.tsx`:
- CAPACIDAD_UNIDADES: ['KILOS', 'LIBRAS', 'LITROS']
- CAPACIDAD_VALORES: { KILOS: [...], LIBRAS: [...], LITROS: [...] }
- MARCAS: [...11 marcas]
- TIPOS: ['ABC', 'BC', 'CO2', 'POLVO QUÍMICO SECO', 'ESPUMA', 'AGUA']
- CLIENTES: [...11 clientes]
- AGENCIAS_BANCO_SOLIDARIO: [...agencias]

**Aceptación**: ✅ Constants importables, TypeScript tipado

---

#### Tarea 1.5: Crear Schemas Zod (20 min)
En `src/services/validationService.ts`:
- `DetalleExtintorSchema`: validar número (1-999), unidad (requerido), capacidad (requerido), marca (requerido), tipo (requerido)
- `OrdenTrabajoSchema`: validar cliente (requerido), fecha (válida), detalles (mín 1 item), tipo validación completa
- `createValidator(schema)`: función reutilizable que retorna `{ valid, errors }`

**Aceptación**: ✅ Schemas validables, mensajes en español

---

### ✅ Criterios de Aceptación - FASE 1

```
✓ npm start compila sin errores
✓ Estructura de carpetas completa
✓ TypeScript types definidos (no any)
✓ Constants importables desde src/constants
✓ Schemas Zod compilables y testables
✓ npm run type-check pasa sin errores
✓ README.md actualizado con instrucciones setup

PRÓXIMO PASO: Hacer PULL REQUEST para aprobación
```

---

---

## FASE 2: IMPLEMENTAR HOOKS BASE (3-4 horas) ⏱️

### 🎯 Objetivo
Crear los 3 hooks reutilizables que serán el corazón de la app.

### 📋 Tareas

#### Tarea 2.1: `useStorage` Hook (45 min)
En `src/hooks/useStorage.ts`:

**Funcionalidad**:
- Guardar/cargar datos de AsyncStorage
- Sincronización automática
- Manejo de tipos genéricos `<T>`

**API**:
```typescript
const [value, setValue] = useStorage<T>(key: string, defaultValue: T)
```

**Aceptación**: 
✅ Hook se puede importar sin errores  
✅ `setValue()` guarda en AsyncStorage (verificable en console)  
✅ Valores persisten al recargar app  
✅ TypeScript inferencia correcta

---

#### Tarea 2.2: `useFormData` Hook (90 min)
En `src/hooks/useFormData.ts`:

**Funcionalidad**:
- - Guardar automáticamente en AsyncStorage
- Validar con Zod schemas
- Retornar campos no tocados sin errores

**API**:
```typescript
const { data, errors, touched, updateField, reset, validate } = useFormData(
  storageKey: string,
  initialValue: T,
  schema: ZodSchema,
  options?: { autoSave: boolean, debounceMs: number }
)
```

**Comportamiento**:
- `updateField(field, value)`: valida + guarda en AsyncStorage
- `validate()`: valida completo, retorna `{ valid, errors }`
- `touched`: objeto con campos modificados por usuario
- Auto-save cada 2 segundos si `autoSave: true`

**Aceptación**:
✅ updateField() valida campo individual  
✅ Datos persisten en AsyncStorage  
✅ validate() retorna objeto correcto  
✅ reset() limpia todo

---

#### Tarea 2.3: `useFieldVisibility` Hook (60 min)
En `src/hooks/useFieldVisibility.ts`:

**Funcionalidad**:
- Mostrar/ocultar campos según reglas condicionales
- Regla default: "agencia" visible solo si cliente = "BANCO SOLIDARIO S.A."

**API**:
```typescript
const visibility = useFieldVisibility(formData, customRules?: VisibilityRule)
// visibility.agencia === true/false
```

**Aceptación**:
✅ `visibility.agencia` es true si cliente es BANCO SOLIDARIO  
✅ `visibility.agencia` es false para otros clientes  
✅ Se pueden agregar reglas custom  
✅ Retorna objeto booleano

---

#### Tarea 2.4: Crear Tests en App.tsx (30 min)

**En `App.tsx` testea**:
- ✅ useStorage guarda/carga datos
- ✅ useFormData valida campos
- ✅ useFormData toca campos correctos
- ✅ useFieldVisibility funciona
- ✅ Los 3 hooks juntos funcionan

**Aceptación**:
✅ App.tsx tiene pantalla de debug mostrando:
   - Data actual
   - Errors actuales
   - Touched fields
   - Valores MMKV
✅ Console logs muestra flujo correcto

---

### ✅ Criterios de Aceptación - FASE 2

```
✓ Los 3 hooks se importan sin errores
✓ useStorage persiste datos
✓ useFormData valida con Zod
✓ useFieldVisibility muestra/oculta campos
✓ Todos funcionan juntos en App.tsx
✓ TypeScript types correctos (no any)
✓ Console muestra flujo esperado
✓ Sin memory leaks o warnings React

PRÓXIMO PASO: Hacer PULL REQUEST para aprobación
```

---

---

## FASE 3: COMPONENTES BASE (2-3 horas) ⏱️

### 🎯 Objetivo
Crear componentes reutilizables para el formulario.

### 📋 Tareas

#### Tarea 3.1: `FormInput` Component (30 min)
En `src/components/FormFields/FormInput.tsx`:

**Props**:
- `label?: string`
- `value: string`
- `onChangeText: (text) => void`
- `error?: string`
- `touched?: boolean`
- `placeholder?: string`
- `disabled?: boolean`

**Comportamiento**:
- Input grande (44px altura)
- Muestra error solo si `touched && error`
- Estilos touch-friendly (padding, font-size)

**Aceptación**:
✅ Renderiza correctamente  
✅ Error aparece/desaparece según `touched`  
✅ Touch-friendly (44px+ altura)  
✅ TypeScript props correctas

---

#### Tarea 3.2: `FormDropdown` Component (45 min)
En `src/components/FormFields/FormDropdown.tsx`:

**Props**:
- `label?: string`
- `value: string`
- `onSelect: (value) => void`
- `options: string[]` o `{ label, value }[]`
- `error?: string`
- `touched?: boolean`
- `search?: boolean` (default true)
- `placeholder?: string`
- `disabled?: boolean`

**Comportamiento**:
- Usa `react-native-element-dropdown`
- Search integrado por defecto
- Muestra error solo si `touched && error`
- Botones grandes, texto legible

**Aceptación**:
✅ Dropdown abre/cierra  
✅ Search filtra opciones  
✅ onSelect se dispara  
✅ Error visual correcto  
✅ Touch-friendly

---

#### Tarea 3.3: `FormDatePicker` Component (30 min)
En `src/components/FormFields/FormDatePicker.tsx`:

**Props**:
- `label?: string`
- `value: Date`
- `onChange: (date: Date) => void`
- `error?: string`
- `touched?: boolean`
- `disabled?: boolean`

**Comportamiento**:
- Usa `@react-native-community/datetimepicker`
- Abre picker al tocar
- Cierra después de seleccionar
- Muestra fecha formateada: "DD/MM/YYYY"

**Aceptación**:
✅ Picker abre al tocar  
✅ Seleccionar fecha funciona  
✅ Fecha se formatea correctamente  
✅ Error visual correcto

---

#### Tarea 3.4: `ValidationIcon` Component (20 min)
En `src/components/Feedback/ValidationIcon.tsx`:

**Props**:
- `status: 'valid' | 'invalid' | 'warning' | 'pending'`
- `message?: string`

**Comportamiento**:
- 🟢 (válido - verde)
- 🔴 (inválido - rojo)
- 🟡 (warning - naranja)
- ⏳ (pendiente - gris)

**Aceptación**:
✅ Icono se muestra correctamente  
✅ Colores match según status  
✅ Mensaje aparece si existe

---

#### Tarea 3.5: Crear Tests en App.tsx (20 min)

**Testea en App.tsx**:
- ✅ FormInput renderiza y valida
- ✅ FormDropdown abre y selecciona
- ✅ FormDatePicker funciona
- ✅ ValidationIcon muestra estados

**Aceptación**:
✅ Todos los componentes renderizables  
✅ Interacciones funcionan  
✅ Estilos touch-friendly aplicados

---

### ✅ Criterios de Aceptación - FASE 3

```
✓ 4 componentes base crean sin errores
✓ Todos renderizables en App.tsx
✓ Touch-friendly (44-48px)
✓ Validación visual correcta (error/valid)
✓ TypeScript types sin 'any'
✓ Reutilizables (no hardcoded)
✓ Performance aceptable (sin lag)

PRÓXIMO PASO: Hacer PULL REQUEST para aprobación
```

---

---

## FASE 4: HEADER FORM - CABECERA (4-5 horas) ⏱️ **✅ APPROVAL POINT 1**

### 🎯 Objetivo
Implementar la primera pantalla: seleccionar cliente y fecha de entrega.

### 📋 Tareas

#### Tarea 4.1: Crear `OrdenTrabajoMobile.tsx` Estructura (60 min)

**En `src/components/OrdenTrabajo/OrdenTrabajoMobile.tsx`**:

**Funcionalidad - HEADER SOLO**:
- Mostrar: Cliente (dropdown con search)
- Mostrar: Fecha Entrega (date picker)
- Mostrar: Botón "Continuar" (disabled si no hay cliente)
- Guardar automáticamente en MMKV

**Layout**:
```
┌─────────────────────────────────┐
│ CABECERA ORDEN DE TRABAJO       │
├─────────────────────────────────┤
│                                 │
│  Cliente *                      │
│  [Dropdown search...]           │
│  ❌ "Cliente requerido"         │
│                                 │
│  Fecha Entrega *                │
│  [DD/MM/YYYY]    📅             │
│  ✅ Válida                      │
│                                 │
│  [   Continuar   ]  (disabled)  │
│                                 │
└─────────────────────────────────┘
```

**Aceptación**:
✅ Se renderiza sin errores  
✅ Usa hooks correctamente  
✅ Solo muestra cliente + fecha  
✅ Botón existe pero está deshabilitado

---

#### Tarea 4.2: Implementar Dropdown Cliente (60 min)

**Funcionalidad**:
- Mostrar lista de CLIENTES
- Search filtra por nombre (case-insensitive)
- Al seleccionar: actualiza `useFormData`
- Valida que cliente sea requerido

**Aceptación**:
✅ Dropdown abre  
✅ Lista muestra 11 clientes  
✅ Search filtra resultados  
✅ onSelect actualiza estado  
✅ Validación funciona (rojo si vacío)  
✅ Guardado automático en AsyncStorage

---

#### Tarea 4.3: Implementar Date Picker Fecha Entrega (45 min)

**Funcionalidad**:
- Date picker nativo (Android/iOS)
- Fecha mínima: HOY
- Fecha máxima: 30 días futuros
- Al seleccionar: actualiza `useFormData`
- Formatea como DD/MM/YYYY

**Aceptación**:
✅ Picker abre al tocar  
✅ Seleccionar fecha funciona  
✅ Fecha se formatea: "DD/MM/YYYY"  
✅ Validación funciona  
✅ Guardado en AsyncStorage  
✅ Sin errores en console

---

#### Tarea 4.4: Botón "Continuar" - Lógica (45 min)

**Funcionalidad**:
- Disabled si `!cliente`
- Al presionar: valida header completo
- Si válido: navega a siguiente fase (puede ser Modal o Screen)
- Si inválido: muestra errores

**Aceptación**:
✅ Botón disabled sin cliente  
✅ Botón enabled con cliente  
✅ Presionar valida datos  
✅ Console muestra validación correcta

---

#### Tarea 4.5: Offline Functionality (45 min)

**Funcionalidad**:
- Datos se guardan en AsyncStorage automáticamente
- Al recargar app: datos se recuperan
- Indicador visual: "guardando..." / "guardado" / "error"

**Aceptación**:
✅ Datos persisten en MMKV  
✅ Al recargar app: datos se recuperan  
✅ Indicador visual funciona  
✅ Sin errores al sincronizar

---

#### Tarea 4.6: Tests Completos en App.tsx (45 min)

**Testea**:
- ✅ Header renderiza
- ✅ Cliente seleccionable
- ✅ Fecha seleccionable
- ✅ Botón Continuar responde
- ✅ Validación funciona
- ✅ Datos se guardan en AsyncStorage
- ✅ Al recargar: datos persisten

**Aceptación**:
✅ Flujo completo funciona  
✅ Sin console errors  
✅ Touch-friendly  
✅ Performance aceptable

---

### ✅ Criterios de Aceptación - FASE 4

```
✓ Pantalla Header renderiza correctamente
✓ Cliente seleccionable (dropdown + search)
✓ Fecha Entrega seleccionable (date picker)
✓ Validación real-time (cliente requerido)
✓ Botón Continuar disabled/enabled correctamente
✓ Guardado automático en AsyncStorage funciona
✓ Al recargar: datos se recuperan
✓ Indicador de guardado visible
✓ Sin console errors
✓ Touch-friendly (botones 48px, inputs 44px)
✓ Performance: <300ms interacciones

RESULTADO MOSTRABLE:
  📸 Screenshot: Header con cliente + fecha
  📸 Screenshot: Validación funcionando (error rojo)
  📸 Screenshot: Datos guardados en MMKV (console)
  📸 Demo: Recargar app, datos persisten

PRÓXIMO PASO: ✅ APPROVAL POINT 1 - Hacer PULL REQUEST
```

---

---

## FASE 5: DETALLES DINÁMICOS (5-6 horas) ⏱️ **✅ APPROVAL POINT 2**

### 🎯 Objetivo
Implementar form dinámico para items de extintores (add/remove, cascada unidad→capacidad).

### 📋 Tareas

#### Tarea 5.1: Crear `DetalleItem.tsx` Component (90 min)

**En `src/components/OrdenTrabajo/DetalleItem.tsx`**:

**Props**:
- `item: DetalleExtintor`
- `index: number`
- `onUpdate: (field, value) => void`
- `onRemove: () => void`
- `errors: Record<string, string>`
- `touched: Record<string, boolean>`
- `canRemove: boolean` (false si es último item)

**Funcionalidad**:
```
┌─────────────────────────────────────┐
│ EXTINTOR #1                  [X]    │
├─────────────────────────────────────┤
│ Número Extintor *                   │
│ [Input: 1-999]                      │
│ ❌ "Requerido"                      │
│                                     │
│ Unidad *                            │
│ [Dropdown: KILOS|LIBRAS|LITROS]    │
│ ✅ Seleccionada                     │
│                                     │
│ Capacidad *                         │
│ [Dropdown: dinámico según unidad]   │
│ 🟡 Advertencia                      │
│                                     │
│ Marca *                             │
│ [Dropdown search: 11 marcas]        │
│ ✅ Válida                           │
│                                     │
│ Tipo *                              │
│ [Dropdown: ABC|BC|CO2|...]         │
│ ✅ Válido                           │
└─────────────────────────────────────┘
```

**Aceptación**:
✅ Renderiza correctamente  
✅ Todos los campos presentes  
✅ Validación visual funciona  
✅ Botón [X] para eliminar  
✅ canRemove = true solo si hay >1 item

---

#### Tarea 5.2: Implementar Cascada Unidad → Capacidad (75 min)

**Funcionalidad**:
- Al cambiar Unidad: actualiza opciones de Capacidad dinámicamente
- KILOS → ['6 KILOS', '4 KILOS', '12 KILOS', ...]
- LIBRAS → ['10 LIBRAS', '20 LIBRAS', '5 LIBRAS', ...]
- LITROS → ['6 LITROS', '9,5 LITROS', '10 LITROS']

**Aceptación**:
✅ Cambiar unidad → opciones de capacidad se actualizan  
✅ Seleccionar nueva unidad limpia capacidad anterior  
✅ Las 3 unidades funcionan correctamente  
✅ Sin lag visual

---

#### Tarea 5.3: Campos de Número, Marca, Tipo (60 min)

**Número Extintor**:
- Input numérico, rango 1-999
- Validación: requerido

**Marca**:
- Dropdown search
- Opciones: 11 marcas
- Validación: requerido

**Tipo**:
- Dropdown
- Opciones: ABC, BC, CO2, POLVO QUÍMICO SECO, ESPUMA, AGUA
- Validación: requerido

**Aceptación**:
✅ Cada campo valida independently  
✅ Errores se muestran solo si touched  
✅ Guardado en AsyncStorage después de cambiar

---

#### Tarea 5.4: Add/Remove Items (60 min)

**En `OrdenTrabajoMobile.tsx`**:

**Funcionalidad**:
- Botón "+ Agregar Extintor" crea nuevo item vacío
- Botón [X] en cada item lo elimina (si hay >1 item)
- [X] disabled en último item

**Aceptación**:
✅ Agregar item crea nuevo item vacío al final  
✅ Remover item lo elimina de la lista  
✅ Siempre hay mínimo 1 item (último no se puede eliminar)  
✅ Scroll se comporta bien con múltiples items  
✅ Datos persisten en MMKV

---

#### Tarea 5.5: Validación Completa de Items (60 min)

**Funcionalidad**:
- Cada item valida: número + unidad + capacidad + marca + tipo
- Validación en tiempo real (con Zod schema)
- Validación general: mínimo 1 item con todos campos llenos

**Aceptación**:
✅ Campos requeridos muestran error (rojo)  
✅ Validación completa retorna errores correctos  
✅ validate() general requiere: todos items completos  
✅ Console muestra validación esperada

---

#### Tarea 5.6: Tests Completos (60 min)

**Testea en App.tsx**:
- ✅ Renderiza lista vacía → agregar primer item
- ✅ Agregar 3 items funciona
- ✅ Eliminar items funciona
- ✅ Cascada unidad→capacidad funciona
- ✅ Validación funciona (rojo si vacío)
- ✅ Datos persisten en MMKV
- ✅ Scroll fluido sin lag
- ✅ Botón "Continuar" disabled si hay error

**Aceptación**:
✅ Flujo completo (add/remove/validate/save) funciona  
✅ Sin console errors  
✅ Performance aceptable (scroll smooth)

---

### ✅ Criterios de Aceptación - FASE 5

```
✓ DetalleItem component renderiza correctamente
✓ Cascada Unidad → Capacidad funciona
✓ Agregar items funciona
✓ Remover items funciona (mín 1)
✓ Validación completa funciona
✓ Errores se muestran correctamente
✓ Datos persisten en AsyncStorage
✓ Scroll fluido (sin lag)
✓ Touch-friendly (botones 48px)
✓ Botón "Continuar" responde

RESULTADO MOSTRABLE:
  📸 Screenshot: Lista de 3 items extintores
  📸 Screenshot: Cascada unidad→capacidad
  📸 Screenshot: Validación roja (campo vacío)
  📸 Demo: Agregar/eliminar items
  📸 Demo: Recargar app, items persisten

PRÓXIMO PASO: ✅ APPROVAL POINT 2 - Hacer PULL REQUEST
```

---

---

## FASE 6: FINAL + SUBMIT (4-5 horas) ⏱️ **✅ APPROVAL POINT 3**

### 🎯 Objetivo
Completar form: observaciones, préstamo de extintores, y lógica de submit.

### 📋 Tareas

#### Tarea 6.1: Agregar Ubicación Condicional (45 min)

**Funcionalidad**:
- Si cliente = "BANCO SOLIDARIO S.A." → mostrar Agencia (dropdown con 9 agencias)
- Si cliente ≠ "BANCO SOLIDARIO S.A." → mostrar Dirección (TextInput)
- Usar `useFieldVisibility` para control

**Layout**:
```
┌─────────────────────────────────┐
│ [Cliente + Fecha] (PHASE 4)      │
│                                 │
│ [Detalles Items] (PHASE 5)       │
│                                 │
│ UBICACIÓN                       │
│                                 │
│ Agencia * (si BANCO SOL.)       │
│ [Dropdown: 9 agencias...]       │
│ ✅ Válida                        │
│                                 │
│ O                               │
│                                 │
│ Dirección * (si otro cliente)   │
│ [TextInput: dirección...]       │
│ ✅ Válida                        │
│                                 │
└─────────────────────────────────┘
```

**Aceptación**:
✅ Si cliente = BANCO SOLIDARIO: muestra Agencia  
✅ Si cliente ≠ BANCO SOLIDARIO: muestra Dirección  
✅ Cambiar cliente actualiza campo visible  
✅ Validación funciona en ambos casos

---

#### Tarea 6.2: Agregar Campo Teléfono (20 min)

**Funcionalidad**:
- Input numérico
- Requerido
- Guardado automático

**Aceptación**:
✅ Teléfono se puede ingresar  
✅ Validación funciona  
✅ Persiste en AsyncStorage

---

#### Tarea 6.3: Observaciones Textarea (45 min)

**Funcionalidad**:
- Textarea expandible
- No requerido (opcional)
- Max 500 caracteres (soft limit, visual)
- Guardado automático

**Layout**:
```
┌─────────────────────────────────┐
│ OBSERVACIONES (opcional)        │
│                                 │
│ [TextArea expandible...]        │
│ [                             ] │
│ [                             ] │
│ [                             ] │
│                                 │
│ Caracteres: 123/500             │
│                                 │
└─────────────────────────────────┘
```

**Aceptación**:
✅ TextArea renderiza  
✅ Se expande al escribir  
✅ Contador de caracteres funciona  
✅ Guardado automático

---

#### Tarea 6.4: Préstamo con Reveal (60 min)

**Funcionalidad**:
- Checkbox "¿Prestar extintores?" (NO por defecto)
- Si NO → ocultar cantidad
- Si SÍ → mostrar:
  - Input numérico o Stepper (1-99)
  - Label: "Cantidad a prestar"

**Layout**:
```
┌─────────────────────────────────┐
│ PRÉSTAMO (opcional)             │
│                                 │
│ ☐ ¿Prestar extintores?          │
│                                 │
│ [NO MOSTRADO]                   │
│                                 │
│ vs                              │
│                                 │
│ ☑ ¿Prestar extintores?          │
│                                 │
│ Cantidad *                      │
│ [◄─ 1 ─►]  (stepper)           │
│                                 │
│ O Simplemente un Input numérico │
│ [1-99]                          │
│                                 │
└─────────────────────────────────┘
```

**Aceptación**:
✅ Checkbox se puede marcar/desmarcar  
✅ Si marcado: muestra cantidad  
✅ Si desmarcado: oculta cantidad  
✅ Cantidad valida (1-99)  
✅ Guardado automático

---

#### Tarea 6.5: Botón Submit (45 min)

**Funcionalidad**:
- Botón "Crear Orden" en bottom
- Validación completa antes de envío
- Estados: normal, loading, success, error
- Si válido: muestra toast "✅ Orden creada exitosamente"
- Si inválido: muestra toast "❌ Completa todos los campos"

**Layout**:
```
┌─────────────────────────────────┐
│ [Todas las secciones arriba]    │
│                                 │
│ [    Crear Orden     ]          │
│                                 │
│ O (mientras envía)              │
│ [   ⏳ Guardando...   ]         │
│                                 │
│ O (después de envío)            │
│ ✅ Orden creada exitosamente   │
│                                 │
└─────────────────────────────────┘
```

**Aceptación**:
✅ Botón renderiza  
✅ Al presionar: valida completo  
✅ Si error: muestra errores  
✅ Si válido: simula envío (console.log)  
✅ Toast muestra resultado  
✅ Loading state funciona

---

#### Tarea 6.6: Lógica de Reset Después de Submit (30 min)

**Funcionalidad**:
- Después de submit exitoso: esperar 2 seg
- Limpiar form completamente (reset)
- Volver a pantalla inicial (o mostrar nuevo form vacío)

**Aceptación**:
✅ Después de éxito: form se limpia  
✅ AsyncStorage se limpia  
✅ Vuelve a estado inicial

---

#### Tarea 6.7: Tests Completos (60 min)

**Testea en App.tsx**:
- ✅ Ubicación condicional funciona
- ✅ Teléfono se puede ingresar
- ✅ Observaciones funciona
- ✅ Préstamo reveal funciona
- ✅ Botón submit responde
- ✅ Validación completa funciona
- ✅ Toast muestra resultado
- ✅ Reset después de submit funciona
- ✅ Datos en AsyncStorage correctos

**Aceptación**:
✅ Flujo completo (form → validar → submit) funciona  
✅ Sin console errors  
✅ Performance aceptable

---

### ✅ Criterios de Aceptación - FASE 6

```
✓ Ubicación condicional funciona (Agencia vs Dirección)
✓ Teléfono ingresable y validable
✓ Observaciones textarea funciona
✓ Préstamo checkbox + reveal cantidad funciona
✓ Botón Submit funciona correctamente
✓ Validación completa antes de submit
✓ Toast muestra resultado (éxito/error)
✓ Loading state visible
✓ Reset después de submit funciona
✓ Datos guardados en AsyncStorage correctamente
✓ Todo el form completo funciona end-to-end

RESULTADO MOSTRABLE:
  📸 Screenshot: Form completo (todas las secciones)
  📸 Screenshot: Ubicación se cambia según cliente
  📸 Screenshot: Préstamo checkbox → reveal cantidad
  📸 Screenshot: Validación completa (errores rojos)
  📸 Video: Flujo completo (llenar form → submit → éxito)
  📸 Console: Datos MMKV después de submit

PRÓXIMO PASO: ✅ APPROVAL POINT 3 - Hacer PULL REQUEST
```

---

---

## FASE 7: TESTING & OPTIMIZACIÓN (3-4 horas) ⏱️ **✅ APPROVAL POINT 4**

### 🎯 Objetivo
Testing completo: offline, performance, responsive, UX final.

### 📋 Tareas

#### Tarea 7.1: Testing Offline Completo (45 min)

**Procedimiento**:
1. Completar form completo
2. Desconectar WiFi/datos (airplane mode)
3. Crear nueva orden
4. Verificar datos se guardan en AsyncStorage
5. Recargar app (sin conexión)
6. Verificar datos persisten
7. Reconectar conexión
8. Verificar sincronización (simular)

**Aceptación**:
✅ Form funciona completamente sin conexión  
✅ Datos se guardan en AsyncStorage  
✅ Al recargar: datos persisten  
✅ Indicador offline visible  
✅ No hay console errors

---

#### Tarea 7.2: Testing Performance (45 min)

**Procedimiento**:
1. Medir tiempo de interacciones:
   - Abrir dropdown: <300ms
   - Seleccionar opción: <200ms
   - Agregar item: <200ms
   - Scroll con 10 items: smooth (>30fps)
   - Submit validación: <500ms
2. Verificar no hay memory leaks
3. Verificar animaciones smooth

**Aceptación**:
✅ Abrir dropdown: <300ms  
✅ Seleccionar opción: <200ms  
✅ Agregar item: <200ms  
✅ Scroll smooth (30fps+)  
✅ Submit: <500ms  
✅ No memory leaks  
✅ Sin lag visual

---

#### Tarea 7.3: Testing Responsive (45 min)

**Procedimiento**:
1. Testear en dispositivos reales (5"-7" pantallas):
   - Pequeño (5"):  iPhone 12 mini
   - Mediano (6"):  iPhone 14
   - Grande (7"):   iPad mini
2. Verificar layout funciona en todos

**O** si no hay dispositivos:
1. Usar emuladores:
   - Android: Pixel 3a (5.6")
   - Android: Pixel 4 (5.7")
   - iOS: iPhone 12 mini (5.4")
2. Probar orientación portrait + landscape

**Aceptación**:
✅ Layout funciona 5"-7" pantallas  
✅ No hay corte de elementos  
✅ Botones todos accesibles  
✅ Teclado no cubre campos importantes  
✅ Scroll vertical funciona

---

#### Tarea 7.4: Testing UX Completo (45 min)

**Procedimiento**:
1. Flujo completo de un campo worker:
   - Abrir app (primera vez)
   - Llenar form desde cero
   - Hacer todos los cambios posibles
   - Guardar (submit)
   - Verificar que se puede repetir
2. Testear todos los error cases:
   - Intentar submit sin cliente
   - Intentar eliminar último item
   - Intentar cantidad préstamo > 99
   - Desconectar a mitad del form
3. Verificar UX intuitivo

**Aceptación**:
✅ Flujo completo es intuitivo  
✅ Todos los error cases manejo correcto  
✅ Feedback visual claro (errores rojos, éxito verde)  
✅ Usuario no se confunde  
✅ Interacciones responden predictably

---

#### Tarea 7.5: Documentación Final (30 min)

**Crear/Actualizar**:
- `README.md`: Instrucciones para correr proyecto
- `SETUP.md`: Paso a paso instalación
- `TESTING.md`: Cómo testear cada característica
- `DEPLOYMENT.md`: Cómo hacer build para producción

**Aceptación**:
✅ README claro y actualizado  
✅ Setup reproducible  
✅ Testing documentado  
✅ Deployment listo

---

#### Tarea 7.6: Code Review & Cleanup (30 min)

**Procedimiento**:
1. Code review completo:
   - No hay console.log de debug (excepto testing)
   - No hay comentarios TODOs
   - Code style consistente
   - Tipos TypeScript correctos
2. Cleanup:
   - Remover imports no usados
   - Optimizar renders (React.memo si needed)
   - Validar nombres variables descriptivos

**Aceptación**:
✅ Código limpio  
✅ No hay console.log de debug  
✅ TypeScript strict (no any)  
✅ Style consistente

---

#### Tarea 7.7: Final Demo & Sign-off (30 min)

**Mostrar**:
- ✅ Form completo funciona
- ✅ Offline funciona
- ✅ Performance ok
- ✅ Responsive ok
- ✅ UX intuitivo

**Entregar**:
- Pull request final
- Screenshots de todas las secciones
- Video de flujo completo
- Report de testing

**Aceptación**:
✅ Todo funciona según spec  
✅ Listo para producción

---

### ✅ Criterios de Aceptación - FASE 7

```
✓ Offline functionality completo
✓ Performance dentro de spec (>30fps scroll, <500ms submit)
✓ Responsive design (5"-7" pantallas)
✓ UX intuitivo y sin bugs
✓ Código limpio (no debug, tipos TS correctos)
✓ Documentación actualizada
✓ Code review passed
✓ Sin console errors

RESULTADO FINAL:
  📸 Screenshots: Todas las secciones del form
  📸 Video: Flujo completo (fill → submit → success)
  📸 Video: Offline functionality
  📸 Performance report: Tiempos medidos
  📸 Responsive report: Testeado en múltiples dispositivos
  ✅ Code ready for production

PRÓXIMO PASO: ✅ APPROVAL POINT 4 - LISTO PARA PRODUCCIÓN 🚀
```

---

---

## 🎯 RESUMEN DEL PLAN

```
FASE 1: Setup Initial (2-3h)                    ✅ APPROVAL 1
FASE 2: Hooks Base (3-4h)                       ✅ APPROVAL 2
FASE 3: Componentes Base (2-3h)                 ✅ APPROVAL 3
────────────────────────────────────────────────────────────
FASE 4: Header Form (4-5h)    ✅ APPROVAL POINT 1
FASE 5: Detalles Dinámicos (5-6h) ✅ APPROVAL POINT 2
FASE 6: Final + Submit (4-5h) ✅ APPROVAL POINT 3
FASE 7: Testing & UX (3-4h)   ✅ APPROVAL POINT 4 → PRODUCCIÓN

TOTAL: 25-32 horas = 4-5 días jornada completa

WORKFLOW PARA CADA FASE:
  1. Implementar tareas
  2. Test en App.tsx
  3. Hacer PULL REQUEST
  4. Tu aprobación
  5. Pasar a siguiente fase
```

---

## 📋 CHECKLIST INICIAL (Antes de Fase 1)

```
REQUISITOS:
  ✅ Proyecto React Native + Expo creado
  ✅ TypeScript configurado
  ✅ npm/yarn funcionando
  ✅ Git configurado (para PRs)

CONFIRMACIÓN REQUERIDA:
  ☐ ¿Listo para comenzar FASE 1?
  ☐ ¿Apruebas el plan de fases?
  ☐ ¿Puedes revisar + aprobar PRs después de cada fase?

SIGUIENTE PASO:
  → Responder: "Listo para FASE 1"
  → Ejecutaré Tarea 1.1 a 1.5
  → Crearé PR para tu aprobación
```

---

## 🚀 START

**ESPERANDO TU CONFIRMACIÓN PARA INICIAR FASE 1**

¿Estás listo? 🚀
