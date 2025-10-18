# 🔧 Guía Técnica: Implementación Paso a Paso

## Comparativa Visual: Web vs Mobile

### ANTES (Web - OrdenTrabajo.tsx)
```typescript
// ❌ PROBLEMAS EN MOBILE
<Grid item xs={12} md={6}>
  <Grid container alignItems='center'>
    <Grid item xs={6} sx={{ pr: 1 }}>
      <DesktopDatePicker />  // ← No existe en React Native
    </Grid>
    <Grid item xs={6} sx={{ pl: 1 }}>
      <DesktopDatePicker />
    </Grid>
  </Grid>
</Grid>

// ❌ MUI Picker no optimizado para touch
<Picker selectedValue={selected} onValueChange={setSelected}>
  <Picker.Item label="..." value="..." />
</Picker>

// ❌ Validación solo en submit
const handleSubmit = () => {
  // TODO: Validar todo aquí...
};

// ❌ Sin persistencia offline
```

### DESPUÉS (Mobile - Propuesta)
```typescript
// ✅ SOLUCIÓN MOBILE-FIRST
<FormDatePicker
  label="Fecha Entrega"
  value={data.fechaEntrega}
  onChange={(date) => updateField('fechaEntrega', date)}
  error={errors.fechaEntrega}
/>

// ✅ Element Dropdown con search
<FormDropdown
  label="Cliente"
  data={clientesOptions}
  value={data.cliente}
  onChange={(item) => updateField('cliente', item.value)}
  search
  maxHeight={250}
  error={errors.cliente}
/>

// ✅ Validación real-time
const updateField = (field, value) => {
  data[field] = value;
  validateField(field);  // ← Instant feedback
  saveToMMKV();          // ← Persist
};

// ✅ Persistencia automática (offline-first)
// Guardado en MMKV cada cambio
```

---

## 🏗️ Stack Técnico Detallado

### 1. **MMKV Storage** (Offline-First)
```typescript
// Instalación
npx expo install react-native-mmkv

// Uso básico
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

// Guardar
storage.set('orden:draft', JSON.stringify(data))

// Cargar
const data = JSON.parse(storage.getString('orden:draft') || '{}')

// Validar conexión y sincronizar
if (isOnline) {
  await uploadOrder(data);
  storage.delete('orden:draft');
}
```

### 2. **React Native Element Dropdown**
```typescript
// Instalación
npx expo install react-native-element-dropdown

// Uso
<Dropdown
  style={styles.dropdown}
  data={MARCAS.map(m => ({ label: m, value: m }))}
  labelField="label"
  valueField="value"
  placeholder="Selecciona marca"
  search
  searchPlaceholder="Buscar..."
  value={marca}
  onChange={(item) => setMarca(item.value)}
/>
```

### 3. **Zod Validation** (Schema-based)
```typescript
// Instalación
npx expo install zod

// Schema
import { z } from 'zod'

const OrdenTrabajoSchema = z.object({
  cliente: z.string().min(1, 'Cliente requerido'),
  fechaEntrega: z.date().min(new Date(), 'Fecha futura requerida'),
  direccion: z.string().min(3, 'Dirección requerida'),
  detalles: z.array(
    z.object({
      extintorNro: z.string().min(1, 'Número requerido'),
      marca: z.string().min(1, 'Marca requerida'),
    })
  ).min(1, 'Al menos 1 extintor'),
})

// Validación
try {
  OrdenTrabajoSchema.parse(formData)
  return { valid: true, errors: {} }
} catch (error) {
  return { valid: false, errors: error.flatten().fieldErrors }
}
```

### 4. **Date Picker Nativo**
```typescript
// Instalación
npx expo install @react-native-community/datetimepicker

// Uso
import DateTimePicker from '@react-native-community/datetimepicker'

const [date, setDate] = useState(new Date())
const [show, setShow] = useState(false)

const handleChange = (event, selectedDate) => {
  setShow(false)
  if (selectedDate) setDate(selectedDate)
}

return (
  <>
    <TouchableOpacity onPress={() => setShow(true)}>
      <Text>{date.toLocaleDateString('es-ES')}</Text>
    </TouchableOpacity>
    {show && (
      <DateTimePicker
        value={date}
        mode="date"
        display="spinner"
        onChange={handleChange}
        locale="es-ES"
      />
    )}
  </>
)
```

---

## 🎣 Hooks Propuestos - Implementación

### Hook 1: `useMMKVStorage`
```typescript
// hooks/useMMKVStorage.ts
import { useCallback, useState, useEffect } from 'react'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export function useMMKVStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = storage.getString(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue)
        storage.set(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error saving to MMKV: ${key}`, error)
      }
    },
    [key]
  )

  return [value, setStoredValue] as const
}
```

### Hook 2: `useFormData` (Con validación real-time)
```typescript
// hooks/useFormData.ts
import { useCallback, useState, useEffect } from 'react'
import { useMMKVStorage } from './useMMKVStorage'
import { z } from 'zod'

export function useFormData<T>(
  storageKey: string,
  initialValue: T,
  schema: z.ZodSchema
) {
  const [data, setData] = useMMKVStorage(storageKey, initialValue)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const validateField = useCallback(
    (fieldName: keyof T) => {
      try {
        // Validar campo individual
        const fieldSchema = (schema as any).pick({ [fieldName]: true })
        fieldSchema.parse({ [fieldName]: (data as any)[fieldName] })
        
        // Limpiar error
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName as string]
          return newErrors
        })
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors = error.flatten().fieldErrors
          setErrors((prev) => ({
            ...prev,
            [fieldName]: newErrors[fieldName]?.[0] || 'Error desconocido',
          }))
        }
        return false
      }
    },
    [data, schema]
  )

  const updateField = useCallback(
    (fieldName: keyof T, value: any) => {
      setData({ ...data, [fieldName]: value })
      // Validar en tiempo real después de actualizar
      setTimeout(() => validateField(fieldName), 0)
    },
    [data, setData, validateField]
  )

  const validateAll = useCallback(() => {
    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.flatten().fieldErrors as Record<string, string[]>
        const flatErrors = Object.keys(newErrors).reduce((acc, key) => {
          acc[key] = newErrors[key]?.[0] || 'Error'
          return acc
        }, {} as Record<string, string>)
        setErrors(flatErrors)
      }
      return false
    }
  }, [data, schema])

  const reset = useCallback(() => {
    setData(initialValue)
    setErrors({})
  }, [setData, initialValue])

  return {
    data,
    errors,
    isSaving,
    updateField,
    validateField,
    validateAll,
    reset,
  }
}
```

### Hook 3: `useFieldVisibility` (Para campos condicionales)
```typescript
// hooks/useFieldVisibility.ts
import { useCallback } from 'react'

type VisibilityRule = {
  [key: string]: (data: any) => boolean
}

const DEFAULT_RULES: VisibilityRule = {
  // Mostrar agencia solo si es BANCO SOLIDARIO
  agencia: (data) =>
    data.cliente === 'BANCO SOLIDARIO S.A.',

  // Mostrar dirección y teléfono si no es BANCO SOLIDARIO
  direccion: (data) =>
    data.cliente && data.cliente !== 'BANCO SOLIDARIO S.A.',

  // Mostrar cantidad préstamo solo si checkbox marcado
  cantidadPrestamo: (data) =>
    data.prestamoExtintores === true,

  // Mostrar capacidad valor solo si unidad seleccionada
  capacidadValor: (data) =>
    !!data.capacidadUnidad,
}

export function useFieldVisibility(
  formData: any,
  customRules?: VisibilityRule
) {
  const rules = { ...DEFAULT_RULES, ...customRules }

  return useCallback(
    (fieldName: string) => {
      const rule = rules[fieldName]
      if (!rule) return true // Si no hay regla, mostrar por defecto
      return rule(formData)
    },
    [formData, rules]
  )
}
```

---

## 🧩 Componentes Base - Reusables

### Componente 1: `FormInput`
```typescript
// components/FormFields/FormInput.tsx
import React from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native'

interface FormInputProps extends TextInputProps {
  label?: string
  error?: string
  touched?: boolean
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, touched, style, ...props }, ref) => {
    const hasError = touched && !!error

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            hasError && styles.inputError,
            style,
          ]}
          placeholderTextColor="#999"
          {...props}
        />
        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 44, // Touch-friendly
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
})
```

### Componente 2: `FormDropdown`
```typescript
// components/FormFields/FormDropdown.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

interface FormDropdownProps {
  label?: string
  data: Array<{ label: string; value: string }>
  value: string | null
  onChange: (item: { label: string; value: string }) => void
  error?: string
  touched?: boolean
  search?: boolean
  disabled?: boolean
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  data,
  value,
  onChange,
  error,
  touched,
  search = true,
  disabled = false,
}) => {
  const hasError = touched && !!error

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Dropdown
        style={[
          styles.dropdown,
          hasError && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Seleccionar..."
        searchPlaceholder="Buscar..."
        value={value}
        onChange={onChange}
        search={search}
        maxHeight={300}
        disable={disabled}
        activeColor="#e8f0ff"
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.inputSearch}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  dropdownError: {
    borderColor: '#ff6b6b',
  },
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  inputSearch: {
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
})
```

### Componente 3: `ValidationIcon`
```typescript
// components/Feedback/ValidationIcon.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Status = 'valid' | 'invalid' | 'warning' | 'pending'

interface ValidationIconProps {
  status: Status
  message?: string
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({
  status,
  message,
}) => {
  const icons: Record<Status, string> = {
    valid: '✓',
    invalid: '✕',
    warning: '⚠',
    pending: '…',
  }

  const colors: Record<Status, string> = {
    valid: '#51cf66',
    invalid: '#ff6b6b',
    warning: '#ffd700',
    pending: '#999',
  }

  return (
    <View style={[styles.container, { borderLeftColor: colors[status] }]}>
      <Text style={[styles.icon, { color: colors[status] }]}>
        {icons[status]}
      </Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  message: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
})
```

---

## 📋 Tipos TypeScript

```typescript
// types/ordenTrabajo.ts
export interface DetalleExtin tor {
  id: string
  extintorNro: string
  capacidadUnidad: 'KILOS' | 'LIBRAS' | 'LITROS'
  capacidadValor: string
  marca: string
  tipo: string
}

export interface OrdenTrabajoFormData {
  fechaEntrega: Date
  fechaRecepcion: Date | null
  cliente: string
  direccion: string
  agencia?: string
  telefono: string
  detalles: DetalleExtintor[]
  observaciones: string
  prestamoExtintores: boolean
  cantidadPrestamo: string
}

export interface FormState {
  data: OrdenTrabajoFormData
  errors: Partial<Record<keyof OrdenTrabajoFormData, string>>
  isDirty: boolean
  isSaving: boolean
  isLoading: boolean
  lastSavedAt: Date | null
}
```

---

## ✅ Checklist Pre-Implementación

- [ ] Proyecto React Native + Expo inicializado
- [ ] `package.json` con dependencias base
- [ ] TypeScript configurado
- [ ] ESLint/Prettier configurado
- [ ] MMKV instalado y testeable
- [ ] Element Dropdown instalado
- [ ] Zod instalado
- [ ] Estructura de carpetas creada
- [ ] Tipos TypeScript definidos
- [ ] Comprensión de Hooks propuestos

---

## 🚀 Comando Rápido: Setup Completo

```bash
# En la carpeta del proyecto
npx expo install react-native-mmkv
npx expo install react-native-element-dropdown
npx expo install zod
npx expo install @react-native-community/datetimepicker

# Crear carpetas
mkdir -p src/components/FormFields
mkdir -p src/components/Feedback
mkdir -p src/components/OrdenTrabajo
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/constants
mkdir -p src/types
mkdir -p src/utils
```

---

## 📝 Nota Final

Este documento es la **especificación técnica** para la implementación.  
Cada sección debe ser implementada y testeada incrementalmente.

**¿Listo para comenzar con Fase 1-3 (Setup + Hooks + Componentes)?**
