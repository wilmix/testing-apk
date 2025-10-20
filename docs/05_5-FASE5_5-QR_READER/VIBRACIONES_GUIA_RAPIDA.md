# 🎮 Guía Rápida: Configurar Vibraciones

## 📍 Ubicación del Archivo de Configuración

```
src/constants/hapticConfig.ts
```

---

## ⚡ Cambios Rápidos (Sin Tocar Código)

### Opción 1: Desactivar Todas las Vibraciones

En `src/constants/hapticConfig.ts`, busca:

```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,  // ← CAMBIAR A false
  globalIntensityScale: 1.0,
  disabledTypes: [],
}
```

Cambiar a:

```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: false,  // ✅ Sin vibraciones
  globalIntensityScale: 1.0,
  disabledTypes: [],
}
```

---

### Opción 2: Usar Presets Predefinidos

En `src/constants/hapticConfig.ts`, al final del archivo puedes reemplazar `HAPTIC_GLOBAL_CONFIG` con un preset:

#### Preset: FULL (Todas las vibraciones - Por defecto)
```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,
  globalIntensityScale: 1.0,
  disabledTypes: [],
}
```
**Cuándo usar**: Ambiente ruidoso, trabajador necesita máxima retroalimentación

---

#### Preset: MODERATE (Balance - Solo las vibraciones importantes)
```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,
  globalIntensityScale: 0.7,
  disabledTypes: ['light'],  // Desactivar vibración leve
}
```
**Cuándo usar**: Oficina normal, balance entre feedback y discreción

---

#### Preset: MINIMAL (Mínimas - Solo errores y advertencias)
```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,
  globalIntensityScale: 0.5,
  disabledTypes: ['success', 'light'],  // Solo errores + advertencias
}
```
**Cuándo usar**: Ambiente silencioso o trabajador prefiere mínima vibración

---

#### Preset: DISABLED (Sin vibraciones)
```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: false,
  globalIntensityScale: 0,
  disabledTypes: ['success', 'warning', 'error', 'light'],
}
```
**Cuándo usar**: Teléfono sin motor de vibración o preferencia del usuario

---

### Opción 3: Desactivar Un Tipo Específico

Si quieres mantener la mayoría pero desactivar uno:

```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,
  globalIntensityScale: 1.0,
  disabledTypes: ['light'],  // ← Desactiva solo vibración leve
}
```

O múltiples:
```typescript
disabledTypes: ['success', 'light']  // Desactiva éxito y leve
```

---

## 🎯 Matriz de Decisión

| Escenario | Preset Recomendado | Razón |
|-----------|-------------------|-------|
| Campo con ruido de maquinaria | **FULL** | Necesita máxima retroalimentación |
| Oficina normal | **MODERATE** | Balance entre feedback y discreción |
| Biblioteca/ambiente silencioso | **MINIMAL** | Solo alertas importantes |
| Trabajador prefiere sin vibración | **DISABLED** | Respeto preferencia del usuario |
| Teléfono sin motor vibración | **DISABLED** | No hay hardware disponible |

---

## 🧪 Cómo Probar

### En Expo Go:

1. **Abre la app** con `npx expo start`
2. **Abre DetallesForm** → Toca botón "📷 QR"
3. **Escanea un QR válido** → Deberías **sentir la vibración de éxito**
4. **Escanea el mismo QR de nuevo** → Deberías **sentir vibración de advertencia** (2 pulsos)
5. **Escanea un QR inválido** → Deberías **sentir vibración de error** (3 pulsos)

### Verificar que Está Configurado:

En `src/constants/hapticConfig.ts`:
```typescript
console.log('HAPTIC Config:', HAPTIC_GLOBAL_CONFIG)
```

Luego en la consola de Expo verás la configuración actual.

---

## 📝 Tipos de Vibración Disponibles

| Tipo | Descripción | Cuándo Se Ejecuta |
|------|-------------|------------------|
| `HapticType.SUCCESS` | ✅ Éxito - 1 vibración suave | QR válido y agregado |
| `HapticType.WARNING` | ⚠️ Duplicado - 2 vibraciones | Extintor ya existe |
| `HapticType.ERROR` | ❌ Error - 3 vibraciones | QR inválido |
| `HapticType.LIGHT` | ✨ Leve - 1 vibración micro | Al abrir scanner |

---

## 🔧 Si Necesitas Personalización Avanzada

### Cambiar Intensidad Global

```typescript
export const HAPTIC_GLOBAL_CONFIG = {
  enabled: true,
  globalIntensityScale: 0.5,  // ← Cambia a 0.5 (50% menos intenso)
  disabledTypes: [],
}
```

Valores:
- `1.0` = Intensidad normal (defecto)
- `0.7` = 70% intensidad
- `0.5` = 50% intensidad (más suave)
- `0.0` = Sin vibraciones

---

### Crear Patrón Custom (Avanzado)

En `src/components/QR/QRScanner.tsx`:

```typescript
const haptic = useHapticFeedback()

// En lugar de:
await haptic.trigger(HapticType.SUCCESS)

// Hacer:
await haptic.triggerCustom([50, 100, 50])
// Significa: vibra 50ms + pausa 100ms + vibra 50ms
```

---

## 📞 Soporte Rápido

**¿No sientes vibraciones?**
- ✅ Verifica que `enabled: true` en `hapticConfig.ts`
- ✅ Verifica que el teléfono tiene motor de vibración
- ✅ Verifica que las vibraciones no están silenciadas en el teléfono
- ✅ Verifica que el tipo no está en `disabledTypes`

**¿Vibraciones muy intensas?**
- ✅ Baja `globalIntensityScale` a 0.5 o 0.7

**¿Vibraciones muy suaves?**
- ✅ Sube `globalIntensityScale` a 1.0 (máximo)

---

**¡Listo! Ya puedes configurar las vibraciones fácilmente sin tocar el código de lógica.**
