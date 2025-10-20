# 🔴 FASE 5.5: QR READER INTEGRATION

Lectura de QR para auto-llenar detalles de extintores. Mejora UX: **reducir tiempo manual de 5-10min → 30seg**.

**Status**: PLANNING | **Time**: 1-2h | **Priority**: MEDIA (mejora, no esencial)

---

## 📋 Objetivo

Leer QR con batch de extintores (JSON) y auto-llenar DetallesForm, manteniendo opción manual como fallback.

**Flujo:**
1. Usuario abre DetallesForm
2. Presiona botón "📱 Escanear QR" (opcional)
3. Escanea QR con extintores pre-cargados
4. Se llenan automáticamente los detalles
5. Puede agregar/editar manualmente si es necesario

---

## 📦 JSON Structure - Formato QR

### Version 1.0: Batch de Extintores

```json
{
  "version": "1.0",
  "tipo": "extintor_batch",
  "detalles": [
    {
      "extintorNro": "001",
      "capacidadUnidad": "KILOS",
      "capacidadValor": "6 KILOS",
      "marca": "KIDDE BRASIL",
      "tipo": "ABC"
    },
    {
      "extintorNro": "002",
      "capacidadUnidad": "KILOS",
      "capacidadValor": "4 KILOS",
      "marca": "RESIL",
      "tipo": "ABC"
    },
    {
      "extintorNro": "003",
      "capacidadUnidad": "LIBRAS",
      "capacidadValor": "10 LIBRAS",
      "marca": "FANACIM",
      "tipo": "BC"
    }
  ]
}
```

### Validación JSON

**Requerido:**
- `version`: "1.0" (para compatibilidad futura)
- `tipo`: "extintor_batch" (identifica tipo de datos)
- `detalles`: array con mínimo 1 extintor

**Por extintor:**
- `extintorNro`: string (requerido, único identifier)
- `capacidadUnidad`: "KILOS" | "LIBRAS" | "LITROS"
- `capacidadValor`: string (ej: "6 KILOS")
- `marca`: string (debe estar en MARCAS constants)
- `tipo`: string (debe estar en TIPOS constants)

**Campos opcionales:**
- Campos vacíos → se rellenan manualmente después
- QR puede contener datos parciales

---

## 🏗️ Arquitectura FASE 5.5

### 1. Hook: `useQRReader` (30 líneas)

**Ubicación:** `src/hooks/useQRReader.ts`

**Responsabilidades:**
- Parsear JSON desde string QR
- Validar estructura
- Mapear a `DetalleExtintor[]`
- Manejo de errores

**API:**
```typescript
const { parseQRData, error } = useQRReader()

// Uso:
const detalles = parseQRData(qrString)
if (detalles) {
  // Agregar a form
} else {
  // Mostrar error
}
```

### 2. Component: `QRScanner` (100 líneas)

**Ubicación:** `src/components/QR/QRScanner.tsx`

**Props:**
```typescript
{
  onScan: (detalles: DetalleExtintor[]) => void
  onCancel: () => void
  isDark: boolean
}
```

**Features:**
- Camera overlay con guía QR
- Detección automática
- Feedback visual (escaneo exitoso)
- Botón cancelar

**Dependencias:**
- `expo-camera` (nativo, en Expo Go)
- `expo-barcode-scanner` (QR detection)

### 3. Integration: DetallesForm Button (20 líneas)

**Ubicación:** Agregar a `src/components/OrdenTrabajo/DetallesForm.tsx`

**Cambios:**
- Botón "📱 Escanear QR (opcional)"
- Modal con QRScanner
- `onScan` handler: agregar detalles escaneados
- Merge: `[...existentes, ...scaneados]`

---

## 💻 Implementación Detallada

### Hook: useQRReader.ts

```typescript
// src/hooks/useQRReader.ts
import { useState } from 'react'
import type { DetalleExtintor } from '../types/ordenTrabajo'
import { generateId } from '../utils/generateId'

interface QRData {
  version?: string
  tipo?: string
  detalles?: any[]
}

export const useQRReader = () => {
  const [error, setError] = useState<string | null>(null)

  const parseQRData = (qrString: string): DetalleExtintor[] | null => {
    try {
      setError(null)

      // 1. Parse JSON
      const data: QRData = JSON.parse(qrString)

      // 2. Validar estructura
      if (!data.tipo || data.tipo !== 'extintor_batch') {
        setError('QR inválido: tipo debe ser "extintor_batch"')
        return null
      }

      if (!Array.isArray(data.detalles) || data.detalles.length === 0) {
        setError('QR inválido: debe contener array de extintores')
        return null
      }

      // 3. Mapear y validar cada detalle
      const detalles: DetalleExtintor[] = data.detalles
        .filter((d: any) => d.extintorNro) // Solo si tiene número
        .map((d: any) => ({
          id: generateId(),
          extintorNro: String(d.extintorNro).trim(),
          capacidadUnidad: String(d.capacidadUnidad || '').trim(),
          capacidadValor: String(d.capacidadValor || '').trim(),
          marca: String(d.marca || '').trim(),
          tipo: String(d.tipo || '').trim(),
        }))

      if (detalles.length === 0) {
        setError('QR inválido: no hay extintores válidos')
        return null
      }

      return detalles
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error al parsear QR: ${message}`)
      return null
    }
  }

  return { parseQRData, error }
}
```

### Component: QRScanner.tsx

```typescript
// src/components/QR/QRScanner.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { CameraView } from 'expo-camera'
import type { DetalleExtintor } from '../../types/ordenTrabajo'
import { useQRReader } from '../../hooks/useQRReader'

export interface QRScannerProps {
  onScan: (detalles: DetalleExtintor[]) => void
  onCancel: () => void
  isDark: boolean
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onCancel, isDark }) => {
  const { parseQRData, error } = useQRReader()
  const [scannedOnce, setScannedOnce] = useState(false)

  const handleBarcodeScanned = ({ data }: any) => {
    if (scannedOnce) return // Prevenir múltiples escaneos

    const detalles = parseQRData(data)
    if (detalles) {
      setScannedOnce(true)
      onScan(detalles)
      // El onScan debería cerrar el modal
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodes: ['qr'],
        }}
      />

      {/* Overlay con guía */}
      <View style={styles.overlay}>
        <View style={styles.guide} />
      </View>

      {/* Info text */}
      <View style={[styles.infoBox, isDark ? styles.darkInfoBox : styles.lightInfoBox]}>
        <Text style={[styles.infoText, isDark ? styles.darkText : styles.lightText]}>
          📱 Coloca el QR en el centro
        </Text>
        {error && (
          <Text style={styles.errorText}>❌ {error}</Text>
        )}
      </View>

      {/* Botón cancelar */}
      <TouchableOpacity
        style={[styles.cancelButton, isDark ? styles.darkCancelButton : styles.lightCancelButton]}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guide: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 12,
  },
  infoBox: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
  },
  darkInfoBox: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
  },
  lightInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  darkCancelButton: {
    backgroundColor: '#333333',
  },
  lightCancelButton: {
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
})

export default QRScanner
```

### Integration: DetallesForm Changes

En `src/components/OrdenTrabajo/DetallesForm.tsx`, agregar:

```typescript
import { QRScanner } from '../QR/QRScanner'

// Dentro del componente:
const [showQRScanner, setShowQRScanner] = useState(false)

const handleQRScanned = (newDetalles: DetalleExtintor[]) => {
  const updatedData = {
    ...data,
    detalles: [...data.detalles, ...newDetalles]
  }
  onDataChange(updatedData)
  setShowQRScanner(false)
  addDebugLog(`✅ ${newDetalles.length} extintor(es) agregado(s) desde QR`)
}

// Modal QR Scanner
{showQRScanner && (
  <Modal visible={showQRScanner} animationType="slide">
    <QRScanner
      onScan={handleQRScanned}
      onCancel={() => setShowQRScanner(false)}
      isDark={isDark}
    />
  </Modal>
)}

// Botón en la UI
<TouchableOpacity
  style={styles.qrButton}
  onPress={() => setShowQRScanner(true)}
>
  <Text style={styles.qrButtonText}>📱 Escanear QR (opcional)</Text>
</TouchableOpacity>
```

---

## 🧪 Tests FASE 5.5

### Test 1: parseQRData - QR válido

```typescript
const validQR = JSON.stringify({
  version: '1.0',
  tipo: 'extintor_batch',
  detalles: [
    {
      extintorNro: '001',
      capacidadUnidad: 'KILOS',
      capacidadValor: '6 KILOS',
      marca: 'KIDDE BRASIL',
      tipo: 'ABC'
    }
  ]
})

const detalles = parseQRData(validQR)
expect(detalles).toBeDefined()
expect(detalles?.[0].extintorNro).toBe('001')
```

### Test 2: parseQRData - QR inválido

```typescript
const invalidQR = '{"tipo":"wrong"}'
const detalles = parseQRData(invalidQR)
expect(detalles).toBeNull()
expect(error).toContain('inválido')
```

### Test 3: Merge detalles

```typescript
// Existentes + nuevos desde QR
const existentes = [{ id: '1', ... }]
const nuevos = [{ id: '2', ... }]
const merged = [...existentes, ...nuevos]
expect(merged.length).toBe(2)
```

---

## 📱 Ejemplo QR para Test

**JSON a codificar:**
```json
{"version":"1.0","tipo":"extintor_batch","detalles":[{"extintorNro":"001","capacidadUnidad":"KILOS","capacidadValor":"6 KILOS","marca":"KIDDE BRASIL","tipo":"ABC"},{"extintorNro":"002","capacidadUnidad":"KILOS","capacidadValor":"4 KILOS","marca":"RESIL","tipo":"ABC"}]}
```

**Herramientas para generar QR:**
- https://www.qr-code-generator.com/ (online)
- CLI: `npm install -g qr-image` → `qr <string>`

---

## 🚀 Rollout Plan

1. ✅ Crear `useQRReader` hook
2. ✅ Crear `QRScanner` component
3. ✅ Integrar en `DetallesForm`
4. ✅ Tests
5. ✅ Commit
6. ✅ Deploy a Expo Go

---

## 📊 Mejoras UX

| Escenario | Sin QR | Con QR |
|-----------|--------|--------|
| 1 extintor | 30seg | 30seg |
| 5 extintores | 2.5min | 30seg |
| 10 extintores | 5min | 1min |
| **Batch típico (8 ext)** | **4min** | **45seg** |

**Ahorro: 80% de tiempo** en entrada de datos repetitivos

---

## ⚠️ Consideraciones

### Limitaciones
- **QR size**: JSON pequeño (< 2950 caracteres para QR típico)
- **Validación**: Solo campos en JSON, el resto manual
- **Fallback**: Si QR falla, llenar manualmente (ya funciona)

### Seguridad
- ✅ No requiere HTTPS/autenticación
- ✅ QR es lectura local (en el dispositivo)
- ✅ Datos se guardan en AsyncStorage como siempre

### Performance
- ✅ Parse JSON: < 1ms
- ✅ Camera: nativo (rápido)
- ✅ No bloquea UI

---

## 📝 Notas

- FASE 5.5 es **opcional** para MVP
- Se puede saltar sin romper FASE 6
- Fácil activar/desactivar con feature flag
- Patrón QR es extensible para otras formas

---

**Status**: READY FOR IMPLEMENTATION

Siguiente: Comenzar FASE 5.5 o saltar a FASE 6?
