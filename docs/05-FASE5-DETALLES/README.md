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
- ✅ Validación por campo (extintorNro, unidad, capacidad, marca, tipo)
- ✅ Feedback visual (✓ válido, ✗ error, por item)
- ✅ Status box (muestra cantidad de extintores, estado validación)
- ✅ Info box (instrucciones: cascada, mínimo 1)
- ✅ Botón continuar (activo solo si todos válidos)
- ✅ Botón agregar (add new extintor con ID único)
- ✅ Botón remover (per item, con protección: no permitir remover último)

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
- **Add**: Crea nuevo extintor con ID único, lo agrega al final de la lista
- **Remove**: Solo disponible si hay >1 extintor (protección para no dejar array vacío)
- **Expand**: Click en header abre/cierra los campos del extintor

### 4. Validación
```typescript
// Por extintor
const isValid = 
  !!detalle.extintorNro &&
  !!detalle.capacidadUnidad &&
  !!detalle.capacidadValor &&
  !!detalle.marca &&
  !!detalle.tipo

// Por formulario
const isFormValid = 
  validation.valid &&  // DetallesSchema
  data.detalles.length > 0
```

**DetallesSchema**:
```typescript
detalles: z.array(DetalleExtintorSchema).min(1, 'Mínimo 1 extintor')
```

### 5. Touch Tracking
- Rastrear qué campos han sido tocados por extintor
- Solo mostrar error si campo fue tocado (mejor UX)
- Reset cuando se remueve un extintor

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

1. **Pantalla inicial**: Muestra 1 extintor vacío (mínimo obligatorio)
2. **Agregar más**: Click "+ Agregar otro extintor" crea nuevo item
3. **Rellenar datos**:
   - Nº Extintor (texto, numérico)
   - Unidad (dropdown: KILOS, LITROS, etc)
   - Capacidad (dropdown dinámico según unidad)
   - Marca (dropdown: KIDDE BRASIL, etc)
   - Tipo (dropdown: ABC, CO2, etc)
4. **Validación**: Feedback visual por campo (✓/✗)
5. **Status box**: Muestra cantidad total y estado validación
6. **Continuar**: Activa cuando todos los extintores están completos
7. **Remover**: Opcional si hay >1 item

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
- Botones: Con variants para dark/light

### Touch-Friendly:
- Input height: 44px mínimo
- Button height: 48px+ (48px buttons, 16px padding)
- Spacing: 12-20px gaps
- Collapsible logic para reducir scroll

---

## Status

**Status**: ✅ COMPLETADA

**Archivos**:
- ✅ src/components/OrdenTrabajo/DetallesForm.tsx (600+ líneas)
- ✅ src/components/index.ts (actualizado)
- ✅ App.tsx (integrado + tests)
- ✅ docs/05-FASE5-DETALLES/README.md (esta documentación)

**Próxima fase**: FASE 6 - Final Form + Submit

---

**Total FASE 5**: ~2-3 horas ✅

