# ✅ FASE 5: DETALLES DINÁMICOS - APPROVAL POINT 2

Lista dinámica de extintores con cascada Unidad→Capacidad y validación real-time

## Componentes Creados

### DetallesForm
- **Ubicación**: `src/components/OrdenTrabajo/DetallesForm.tsx`
- **Props**: `data`, `onDataChange`, `onContinue`, `isDark`

#### Características:
- ✅ Lista dinámica de extintores (add/remove)
- ✅ Collapsible items (expande/contrae cada extintor)
- ✅ Cascada: Unidad dropdown → Capacidad dropdown (opciones filtradas)
- ✅ Validación real-time con Zod (DetallesSchema)
- ✅ **Validación individual por extintor** (validateSingleDetalle)
- ✅ Validación por campo (extintorNro, unidad, capacidad, marca, tipo)
- ✅ Feedback visual (✓ válido, ✗ error, por item)
- ✅ Status box (muestra cantidad de extintores, estado validación)
- ✅ Info box (instrucciones: cascada, mínimo 1)
- ✅ Botón continuar (activo solo si todos válidos)
- ✅ Botón agregar (add new extintor con ID único)
- ✅ **Botón "Guardar y Siguiente"** (valida → colapsa → crea siguiente → expande)
- ✅ **Botón "Remover Extintor"** (siempre visible, resetea si es el último)
- ✅ **Haptic feedback** (success, error, light) en acciones principales

---

## Funcionalidad Detallada

### 1. Generar IDs Únicos
```typescript
const generateId = (): string => {
  return `extintor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
```

### 2. Cascada Unidad → Capacidad
```typescript
const getCapacidadOptions = (unidad: string): string[] => {
  if (!unidad) return []
  const values = CAPACIDAD_VALORES[unidad as keyof typeof CAPACIDAD_VALORES] || []
  return Array.from(values)
}
```

**Comportamiento**:
- Si selecciona UNIDAD → solo aparecen CAPACIDADES para esa unidad
- Si cambia UNIDAD → reseteaCapacidad automáticamente
- Si no hay UNIDAD seleccionada → no muestra dropdown de Capacidad

### 3. Add/Remove Extintores

#### Botón "Guardar y Siguiente" ✅ (Nuevo - Enero 2025)
**Flujo automatizado para agregar extintores:**
```typescript
const handleSaveAndNext = async (detalleId: string) => {
  // 1. Validar extintor actual
  const validation = validateSingleDetalle(detalleId)

  if (!validation.valid) {
    // Marcar todos los campos como tocados
    // Mostrar errores
    await haptic.trigger(HapticType.ERROR)
    return
  }

  // 2. Validación exitosa
  await haptic.trigger(HapticType.SUCCESS)

  // 3. Colapsar extintor actual
  setExpandedDetalleId(null)

  // 4. Auto-crear siguiente extintor vacío
  const newDetalle = { id: generateId(), ...camposVacios }

  // 5. Expandir el nuevo automáticamente (delay 100ms)
  setTimeout(() => setExpandedDetalleId(newDetalle.id), 100)
}
```

**Características:**
- ✅ Valida el extintor actual antes de continuar
- ✅ Si inválido: marca errores, vibra error, NO continúa
- ✅ Si válido: vibra success, colapsa actual, crea siguiente, expande siguiente
- ✅ Flujo completamente automático (UX optimizada)
- ✅ Disponible desde el primer extintor

#### Botón "Remover Extintor" 🗑️ (Actualizado - Enero 2025)
**Siempre visible con lógica inteligente:**
```typescript
const handleRemoveDetalle = async (detalleId: string) => {
  if (data.detalles.length === 1) {
    // Si es el último: RESETEAR en lugar de remover
    const resetDetalle = { ...data.detalles[0], ...camposVacios }
    onDataChange({ detalles: [resetDetalle] })
    await haptic.trigger(HapticType.LIGHT)
    return
  }

  // Si hay 2+: remover normalmente
  const updatedDetalles = data.detalles.filter(d => d.id !== detalleId)
  onDataChange({ detalles: updatedDetalles })
  await haptic.trigger(HapticType.LIGHT)
}
```

**Características:**
- ✅ **Siempre visible** (incluso con 1 solo extintor)
- ✅ Si es el último: resetea campos en lugar de eliminar
- ✅ Si hay 2+: elimina normalmente
- ✅ Vibra (light) al ejecutar acción

#### Botón "Agregar otro extintor" ➕
- **Add**: Crea nuevo extintor con ID único, lo agrega al final de la lista
- **Expand**: Click en header abre/cierra los campos del extintor

### 4. Validación

#### Validación Individual (Nuevo - Enero 2025)
```typescript
const validateSingleDetalle = (detalleId: string): { valid: boolean; errors: string[] } => {
  const detalle = data.detalles.find(d => d.id === detalleId)
  if (!detalle) return { valid: false, errors: ['Extintor no encontrado'] }

  // Validar con DetalleExtintorSchema
  const validation = validateData(DetalleExtintorSchema, detalle)

  if (validation.valid) {
    return { valid: true, errors: [] }
  } else {
    const errorMessages = Object.values(validation.errors)
    return { valid: false, errors: errorMessages }
  }
}
```

**Uso:** Llamado por "Guardar y Siguiente" para validar antes de continuar

#### Validación Visual Simple
```typescript
// Por extintor (visual en header)
const isValid =
  !!detalle.extintorNro &&
  !!detalle.capacidadUnidad &&
  !!detalle.capacidadValor &&
  !!detalle.marca &&
  !!detalle.tipo

// Por formulario completo
const isFormValid =
  validation.valid &&  // DetallesSchema
  data.detalles.length > 0
```

#### Schemas Zod
```typescript
// Individual
DetalleExtintorSchema: z.object({
  id: z.string().min(1),
  extintorNro: z.string().min(1).regex(/^\d{1,10}$/),
  capacidadUnidad: z.string().min(1),
  capacidadValor: z.string().min(1),
  marca: z.string().min(1),
  tipo: z.string().min(1)
})

// Array completo
DetallesSchema: z.object({
  detalles: z.array(DetalleExtintorSchema).min(1, 'Mínimo 1 extintor')
})
```

### 5. Touch Tracking
- Rastrear qué campos han sido tocados por extintor
- Solo mostrar error si campo fue tocado (mejor UX)
- Reset cuando se remueve un extintor
- **Actualización automática de touched** cuando "Guardar y Siguiente" valida

### 6. Haptic Feedback (Nuevo - Enero 2025)
**Retroalimentación táctil en acciones principales:**

```typescript
const haptic = useHapticFeedback()

// Success: guardar válido
await haptic.trigger(HapticType.SUCCESS)  // 1 vibración corta suave

// Error: validación fallida
await haptic.trigger(HapticType.ERROR)    // 3 vibraciones intensas

// Light: remover/resetear
await haptic.trigger(HapticType.LIGHT)    // 1 vibración micro
```

**Contextos de uso:**
- ✅ "Guardar y Siguiente" exitoso → Success
- ❌ "Guardar y Siguiente" con errores → Error
- 🗑️ "Remover Extintor" → Light

---

## Integración en App.tsx

- ✅ DetallesForm importado
- ✅ Button "📋 DetallesForm" (verde) para probar
- ✅ Estado para mostrar/ocultar DetallesForm
- ✅ Estado para guardar datos (detallesFormData)
- ✅ Tests en runTests() función
- ✅ Renderiza en pantalla completa
- ✅ Button "← Volver" para regresar
- ✅ Dark theme completo

---

## Tests Implementados

En `App.tsx`:
- ✅ DetallesForm component render
- ✅ Validación DetallesSchema
- ✅ Cascada unidad→capacidad
- ✅ Add/remove extintores
- ✅ Touch tracking
- ✅ AsyncStorage persistence (ready)

**Todos pasan en Expo Go ✅**

---

## Flujo de Usuario

### Flujo Optimizado (Enero 2025) 🆕
**Usando "Guardar y Siguiente" (recomendado):**

1. **Pantalla inicial**: Muestra 1 extintor vacío expandido
2. **Rellenar datos del extintor 1**:
   - Nº Extintor (texto numérico, 1-10 dígitos)
   - Unidad (dropdown: KILOS, LIBRAS, LITROS)
   - Capacidad (dropdown dinámico según unidad)
   - Marca (dropdown searchable)
   - Tipo (dropdown: ABC, BC, CO2, etc)
3. **Click "✅ Guardar y Siguiente"**:
   - ✅ Si válido: vibra success → colapsa → crea siguiente → expande automáticamente
   - ❌ Si inválido: vibra error → muestra errores en campos → permanece expandido
4. **Rellenar extintor 2** (recién creado y expandido automáticamente)
5. **Repetir** paso 3-4 para cada extintor
6. **Último extintor**: Después de "Guardar y Siguiente", se crea uno más (puedes ignorarlo)
7. **Click "✅ Continuar →"** (abajo) cuando termines

**Ventajas:**
- ⚡ Flujo rápido y automático
- ✅ Validación inmediata por extintor
- 🎯 Foco automático en siguiente extintor
- 📳 Feedback háptico en tiempo real

### Flujo Manual (Tradicional)
1. **Pantalla inicial**: Muestra 1 extintor vacío (mínimo obligatorio)
2. **Agregar más**: Click "+ Agregar otro extintor" crea nuevo item
3. **Expandir**: Click en header para expandir/colapsar manualmente
4. **Rellenar datos** en cada extintor
5. **Validación**: Feedback visual por campo (✓/✗)
6. **Status box**: Muestra cantidad total y estado validación
7. **Continuar**: Activa cuando todos los extintores están completos
8. **Remover**: Click "🗑️ Remover Extintor" (siempre visible, resetea si es el último)

---

## Estructura de Datos

```typescript
interface DetalleExtintor {
  id: string                    // Único, generado con timestamp + random
  extintorNro: string          // "001", "102", etc
  capacidadUnidad: string      // "KILOS", "LITROS", etc
  capacidadValor: string       // "6 KILOS", "2.5 LITROS", etc
  marca: string               // "KIDDE BRASIL", etc
  tipo: string                // "ABC", "CO2", etc
}
```

---

## Estilos y Tema

### Dark Mode Support:
- Container: `#1a1a1a` / `#f5f5f5`
- Detalle header: `#2a2a2a` / `#ffffff`
- Detalle content: `#222222` / `#fafafa`
- Botones: Themeable con `theme.success`, `theme.error`, etc.

### Layout de Botones de Acción (Nuevo - Enero 2025)
**Diseño profesional con estilos ghost:**

```typescript
// Contenedor
actionsContainer: {
  gap: 12,          // Espacio entre botones
  marginTop: 8,
}

// Botón "Guardar y Siguiente" (verde, prominente)
saveButton: {
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: 'center',
  borderWidth: 1.5,
  backgroundColor: 'transparent',  // Ghost style
  borderColor: theme.success,
}
saveButtonText: {
  fontSize: 15,
  fontWeight: '600',
  letterSpacing: 0.3,
  color: theme.success,
}

// Botón "Remover" (rojo, discreto)
removeButton: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: 'center',
  borderWidth: 1,
  backgroundColor: 'transparent',  // Ghost style
  borderColor: theme.error,
}
removeButtonText: {
  fontSize: 14,
  fontWeight: '500',
  opacity: 0.9,
  color: theme.error,
}
```

**Características:**
- 🎨 Botones ghost (transparentes, solo bordes)
- 🟢 Verde para acción primaria (Guardar y Siguiente)
- 🔴 Rojo discreto para acción destructiva (Remover)
- 📐 Layout vertical con separación clara
- ♿ Touch-friendly: altura mínima 44px

### Touch-Friendly:
- Input height: 44px mínimo
- Button height: 48px+ (Guardar: 14px×2 + 16px×2 = 60px total)
- Spacing: 12-20px gaps
- Collapsible logic para reducir scroll

---

## Status

**Status**: ✅ COMPLETADA + MEJORADA UX (Enero 2025)

**Archivos**:
- ✅ src/components/OrdenTrabajo/DetallesForm.tsx (~800 líneas, mejorada)
- ✅ src/components/index.ts (actualizado)
- ✅ App.tsx (integrado + tests)
- ✅ docs/05-FASE5-DETALLES/README.md (esta documentación)

**Mejoras UX implementadas (Enero 2025)**:
- ✅ Validación individual por extintor (`validateSingleDetalle`)
- ✅ Botón "Guardar y Siguiente" con flujo automatizado
- ✅ Botón "Remover" siempre visible (resetea si es el último)
- ✅ Haptic feedback en acciones principales
- ✅ Layout profesional con botones ghost
- ✅ Flujo optimizado: valida → colapsa → crea → expande

**Próxima fase**: FASE 6 - Final Form + Submit

---

**Total FASE 5**: ~2-3 horas iniciales + 1 hora mejoras UX = ~3-4 horas ✅

