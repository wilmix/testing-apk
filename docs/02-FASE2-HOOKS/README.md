# 🔄 FASE 2: HOOKS BASE

## 🎯 Objetivo
Crear los 3 hooks reutilizables que serán el corazón de la app.

## ⏱️ Tiempo Estimado: 3-4 horas

## 📋 Tareas Planeadas

### Tarea 2.1: `useMMKVStorage` Hook (45 min)
Guardar/cargar datos de MMKV con sincronización automática.

**Funcionalidad**:
- Guardar/cargar datos de MMKV
- Sincronización automática
- Manejo de tipos genéricos `<T>`

**API**:
```typescript
const [value, setValue] = useMMKVStorage<T>(key: string, defaultValue: T)
```

---

### Tarea 2.2: `useFormData` Hook (90 min)
Gestionar datos del formulario con validación real-time.

**Funcionalidad**:
- Gestionar datos con validación real-time
- Guardar automáticamente en MMKV
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

---

### Tarea 2.3: `useFieldVisibility` Hook (60 min)
Mostrar/ocultar campos según reglas condicionales.

**Funcionalidad**:
- Mostrar/ocultar campos según reglas
- Regla default: "agencia" visible solo si cliente = "BANCO SOLIDARIO S.A."

**API**:
```typescript
const visibility = useFieldVisibility(formData, customRules?: VisibilityRule)
// visibility.agencia === true/false
```

---

### Tarea 2.4: Tests en App.tsx (30 min)
Verificar que los 3 hooks funcionan juntos.

**Tests**:
- ✅ useMMKVStorage persiste datos
- ✅ useFormData valida campos
- ✅ useFormData toca campos correctos
- ✅ useFieldVisibility funciona
- ✅ Los 3 hooks juntos funcionan

---

## ✅ Criterios de Aceptación - FASE 2

```
✓ Los 3 hooks se importan sin errores
✓ useMMKVStorage persiste datos
✓ useFormData valida con Zod
✓ useFieldVisibility muestra/oculta campos
✓ Todos funcionan juntos en App.tsx
✓ TypeScript types correctos (no any)
✓ Console muestra flujo esperado
✓ Sin memory leaks o warnings React

RESULTADO MOSTRABLE:
  ✅ App.tsx con tests ejecutables
  ✅ Console logs mostrando flujo
  ✅ Git PR listo para aprobación
```

---

## 📁 Archivos a Crear

```
src/hooks/useMMKVStorage.ts    (~60 líneas)
src/hooks/useFormData.ts        (~120 líneas)
src/hooks/useFieldVisibility.ts (~50 líneas)
App.tsx                          (tests actualizados)
docs/01-FASE2-HOOKS/GUIA.md     (guía técnica)
```

---

## 🚀 Próximo: FASE 3 - Componentes Base

---

**Status**: ⏳ PRÓXIMA A EJECUTAR
