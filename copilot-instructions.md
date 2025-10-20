# Copilot Instructions for React Native & Expo Projects

Este documento proporciona instrucciones detalladas y mejores prácticas para trabajar en proyectos de React Native con Expo. Está diseñado para agentes de IA (como GitHub Copilot) y desarrolladores, basado en consultas previas, principios KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself) y SOLID, y recomendaciones actuales de Expo SDK 54 y React Native 0.81.4.

## 🎯 Development Philosophy

### KISS, DRY, SOLID - Core Principles

**KISS (Keep It Simple, Stupid)**:
- Simple solutions over clever ones
- Readable code over smart tricks
- Delete code before adding complexity
- One way to do things, not ten

**DRY (Don't Repeat Yourself)**:
- Single source of truth
- Reusable components and hooks
- Shared constants and utilities
- No copy-paste programming

**SOLID**:
- **S**ingle Responsibility: One component, one job
- **O**pen/Closed: Extend, don't modify
- **L**iskov Substitution: Props contract consistency
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions (hooks, contexts)

### Code Style Guidelines

✅ **DO**:
- Write **simple, efficient, elegant** code
- Prefer native/built-in solutions
- Use TypeScript strict mode
- One library per problem domain
- Component composition over inheritance
- Hooks over class components
- Functional programming patterns

❌ **DON'T**:
- Over-engineer or premature optimize
- Add "just in case" features
- Create unnecessary abstractions
- Use heavy libraries for simple tasks
- Mix concerns in one component
- Hardcode values (use constants)

## Overview
- **Framework**: React Native con Expo para desarrollo cross-platform
- **Versiones**: Expo ~54.0.13, React Native 0.81.4, React 19.1.0, TypeScript ~5.9.2
- **Target Platform**: **Android** (90% users), iOS secondary
- **Enfoque**: Apps móviles para trabajo en campo (field workers)
- **Principios**: KISS, DRY, SOLID

## 🖥️ Environment Setup
- **Sistema Operativo**: Windows (no Linux/Mac)
- **IDE**: Visual Studio Code (VSCode)
- **Terminal**: PowerShell (pwsh.exe) - NO bash
- **Node.js**: v18+ instalado
- **Proyecto**: c:\Users\willy\projects\testing-apk
- **Testing**: Android emulator + dispositivos físicos Android

## Troubleshooting
- **Hot Reload**: Si no actualiza, `npx expo start --clear`.
- **Librerías**: Confirma versiones compatibles con Expo 54.

---

## 🔧 Flujo de Desarrollo y Testing

### Workflow Estándar (Para Cada Fase/Feature)

```
1. IMPLEMENTAR
   ↓
2. TESTEAR EN EXPO GO
   ↓
3. VERIFICAR EN TELÉFONO
   ↓
4. GIT COMMIT (solo si pasa tests)
   ↓
5. SIGUIENTE FASE
```

### Paso 1: Implementar Feature/Componente

```powershell
# Crear archivo, escribir código TypeScript
npx tsc --noEmit       # Verificar tipos
npm list               # Verificar dependencias
```

### Paso 2: Testear en Expo Go

**ANTES de instalar cualquier librería - Verificar Compatibilidad:**

```powershell
# ¿Funciona en Expo Go? Preguntas clave:
# - ¿Tiene native code custom? (NO = ✅)
# - ¿Requiere TurboModules? (NO = ✅)
# - ¿Está en Expo Go dependencies? (SÍ = ✅)
# 
# Si las 3 respuestas son positivas → Instalar
# Si alguna es NO → Buscar alternativa sin native code
```

**Iniciar Expo:**

```powershell
npx expo start --clear  # Terminal 1: Servidor con cache limpio
# Terminal 2: Ver logs en tiempo real

# En teléfono:
# 1. Abre Expo Go
# 2. Escanea el QR code
# 3. Verifica carga sin errores
```

**Checklist de Testing:**

```
☐ ¿App carga sin errores en Expo Go?
☐ ¿Tests en App.tsx pasan? (si aplica)
☐ ¿TypeScript compila? (npx tsc --noEmit)
☐ ¿Funcionalidad funciona en teléfono?
☐ ¿Sin warnings en consola?
```

### Paso 3: Verificar en Teléfono

- Escanea QR y abre en Expo Go
- Interactúa con la feature
- Verifica guardado de datos (si aplica)
- Recarga app y verifica persistencia
- Verifica sin crashes

### Paso 4: Git Commit

```powershell
git status              # Ver cambios
git add -A              # Agregar todos
git commit -m "✨ feat: componente FormInput"  # Commit

# Emojis comunes:
# ✨ feat: feature
# 🐛 fix: bug
# ♻️ refactor: refactor
# 📝 docs: docs
# 🔧 config: config
```

### Paso 5: Siguiente Fase

Si testing pasó ✅, continuamos.

---

## 📦 Librería Check: Compatibilidad Con Expo Go

### ⚠️ Caso: MMKV (react-native-mmkv) - POR QUÉ NO FUNCIONÓ

**Error Encontrado:**
```
react-native-mmkv 3.x.x requires TurboModules, 
but the new architecture is not enabled!
```

**Análisis:**
1. MMKV v3.x.x usa TurboModules (native code)
2. TurboModules requieren new architecture
3. **Expo Go NO soporta TurboModules** ← Problema principal
4. Incluso v2.x.x requiere native modules (tampoco funciona)

**Solución: Cambiar a AsyncStorage**

```typescript
// ❌ ANTES (MMKV - no funciona en Expo Go)
import { MMKV } from 'react-native-mmkv'
storage.set('key', 'value')

// ✅ DESPUÉS (AsyncStorage - funciona en Expo Go)
import AsyncStorage from '@react-native-async-storage/async-storage'
await AsyncStorage.setItem('key', JSON.stringify(value))
```

**Por qué AsyncStorage:**
- ✅ Incluido en Expo Go
- ✅ Funciona con QR scan
- ✅ API similar (keys/values)
- ✅ Async/await (mejor para React)
- ⚠️ 10-20x más lento (suficiente para MVP)

### 🛑 Checklist Antes de Instalar Cualquier Librería

```
Antes de: npm install nombre-libreria

☐ ¿Tiene native code? (buscar en GitHub package.json)
☐ ¿Está en Expo Go? (buscar en https://docs.expo.dev)
☐ ¿Funciona con QR scan?
☐ ¿O requiere Development Build?
☐ ¿Hay alternativa sin native code?

Si 3+ respuestas son SÍ a las primeras 3 → Instalar
Si NO a alguna → Buscar alternativa o usar Development Build
```

### 📚 Referencias para Verificar Compatibilidad

- **Expo Docs**: https://docs.expo.dev/versions/latest/
- **Expo Go Dependencies**: https://github.com/expo/expo/blob/main/apps/expo-go/package.json
- **Package GitHub**: Buscar `expo go`, `native code`, `prebuild`

### 💡 Tabla de Decisión

| Característica | Expo Go | Solución |
|---|---|---|
| Sin native code | ✅ | Instalar directo |
| Native code (incluida en Expo) | ✅ | Instalar directo |
| Native code (NO incluida) | ❌ | Alternativa O Development Build |
| Requiere TurboModules | ❌ | Alternativa O Development Build |

---

## 📝 Comandos PowerShell Comunes

```powershell
# Git
git status
git add -A
git commit -m "mensaje"

# NPM
npm install
npm list
npx tsc --noEmit

# Expo
npx expo start --clear
```

---

## 📱 QR Reader Pattern (FASE 5.5)

### Estructura JSON para QR

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
    }
  ]
}
```

### Hook: useQRReader

```typescript
const { parseQRData, error } = useQRReader()
const detalles = parseQRData(qrString)
```

**Responsabilidades:**
- Parse JSON
- Validar estructura
- Mapear a DetalleExtintor[]
- Manejo de errores

### Component: QRScanner

```typescript
<QRScanner
  onScan={(detalles) => handleQRScanned(detalles)}
  onCancel={() => setShowQRScanner(false)}
  isDark={isDark}
/>
```

**Features:**
- Camera overlay
- QR detection
- Feedback visual
- Botón cancelar

### Integration Pattern

```typescript
// En DetallesForm
const [showQRScanner, setShowQRScanner] = useState(false)

const handleQRScanned = (newDetalles: DetalleExtintor[]) => {
  const merged = [...data.detalles, ...newDetalles]
  onDataChange({ ...data, detalles: merged })
}

// UI: Botón + Modal
<TouchableOpacity onPress={() => setShowQRScanner(true)}>
  <Text>📱 Escanear QR</Text>
</TouchableOpacity>

{showQRScanner && (
  <QRScanner
    onScan={handleQRScanned}
    onCancel={() => setShowQRScanner(false)}
    isDark={isDark}
  />
)}
```

### Testing QR

```powershell
# 1. Generar QR (online o CLI)
npm install -g qr-image
qr '{"version":"1.0",...}'

# 2. Escanear en Expo Go
npx expo start
# Abre DetallesForm → Escanear QR → Verificar merge

# 3. Validar parse
const detalles = parseQRData(validJSON)
expect(detalles.length).toBeGreaterThan(0)
```

---

## Instrucciones para GitHub Copilot

- **Contexto**: Windows 10/11, PowerShell, VSCode
- **Ruta**: c:\Users\willy\projects\testing-apk
- **Usa**: Rutas Windows (c:\Users\...), PowerShell cmdlets
- **Evita**: Comandos bash (ls, mv, rm), rutas Unix

---

**Flujo resumen: Implementar → Testear en Expo Go → Verificar en teléfono → Commit → Siguiente fase**
