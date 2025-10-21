# Copilot Instructions for React Native & Expo Projects

Este documento proporciona instrucciones detalladas y mejores prácticas para trabajar en proyectos de React Native con Expo. Está diseñado para agentes de IA (como GitHub Copilot) y desarrolladores, basado en consultas previas, principios KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself) y SOLID, y recomendaciones actuales de Expo SDK 54 y React Native 0.81.4.

## Project Name
**REX/Mobile** - Recarga de Extintores Mobile

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
- **Navigation**: Expo Router + Stack Navigation (file-based routing)
- **Versiones**: Expo ~54.0.13, React Native 0.81.4, React 19.1.0, TypeScript ~5.9.2
- **Target Platform**: **Android** (90% users), iOS secondary
- **Enfoque**: Apps móviles offline-first para trabajo en campo (técnicos de recarga de extintores)
- **Principios**: KISS, DRY, SOLID
- **Arquitectura**: Stack Navigation (no Drawer - incompatible con Expo Go)

## 🖥️ Environment Setup
- **Sistema Operativo**: Windows 10/11 (no Linux/Mac)
- **IDE**: Visual Studio Code (VSCode)
- **Terminal**: PowerShell (pwsh.exe) - NO bash
- **Node.js**: v18+ instalado
- **Proyecto**: c:\dev\react-native\testing-app (actualizado desde c:\Users\willy\projects\testing-apk)
- **Testing**: Expo Go en dispositivos físicos Android (prioridad), iOS ocasional
- **Branch Actual**: feat/navegacion-gmail

## 📦 Tech Stack Completo

| Component | Library | Version | Notes |
|-----------|---------|---------|-------|
| Framework | React Native + Expo | 0.81.4 / ~54.0.13 | Cross-platform |
| **Navigation** | **Expo Router + Stack** | **~6.0.13** | **File-based routing** |
| Language | TypeScript | ~5.9.2 | Strict mode enabled |
| Storage | AsyncStorage | 2.2.0 | Offline-first, Expo Go compatible |
| Dropdowns | react-native-element-dropdown | 2.12.4 | Touch-optimized with search |
| Validation | Zod | 3.25.76 | Type-safe, Spanish messages |
| Date Picker | @react-native-community/datetimepicker | 8.4.4 | Native iOS/Android |
| QR Scanner | expo-camera | ~17.0.8 | QR scanning, permissions |
| Haptics | expo-haptics | ~15.0.7 | Vibration feedback |
| Safe Area | react-native-safe-area-context | ~5.6.0 | Cross-platform |
| Theming | React Context | Built-in | Dark/Light mode |

## 🏗️ Arquitectura de Navegación

### Stack Navigation (NO Drawer)

**Por qué Stack en vez de Drawer:**
- ✅ Compatible con Expo Go (no issues con react-native-reanimated)
- ✅ Headers nativos funcionan out-of-the-box
- ✅ Implementación más simple
- ✅ Mejor UX para workflows secuenciales (lista → detalles → editar)

**Estructura:**
```
app/                              # Expo Router file-based routing
├── _layout.tsx                   # Root Stack
├── index.tsx                     # Lista de Órdenes (Home)
├── about.tsx                     # About screen
├── configuracion.tsx             # Configuración screen
├── test.tsx                      # Testing screen (dev only)
├── orden/
│   ├── _layout.tsx               # Stack para detalles
│   └── [id].tsx                  # Detalles (dynamic route)
└── nueva-orden/
    ├── _layout.tsx               # Stack para formulario
    ├── paso1.tsx                 # Cliente + Fecha + Ubicación
    └── paso2.tsx                 # Extintores + Info Final
```

## 📊 Estado del Proyecto

**FASE Actual: FASE 8 - Acciones y Polish** 🔄

**Progreso: 87.5%** (7 de 8 fases completadas)

Fases completadas:
- ✅ FASE 1-6: Setup → Forms → QR Scanner
- ✅ FASE 7: Navegación (Expo Router + Stack Navigation)
  - ✅ 7.0-7.1: Setup Expo Router, Stack Navigation
  - ✅ 7.2: Lista + CRUD (ordenService, OrdenCard, SearchBar, FAB)
  - ✅ 7.3: Detalles de Orden (dynamic route)
  - ✅ 7.4: Formulario 2 Pasos
- 🔄 FASE 8: Acciones y Polish (En Progreso)
  - ✅ 8.1: Editar Orden
  - ⏳ 8.2: About + Configuración
  - ⏳ 8.3: Compartir (opcional)
  - ⏳ 8.4: Testing Final

**Next Steps:**
1. Completar Subfase 8.2: About + Configuración
2. Subfase 8.4: Testing Final + Limpieza
3. (Opcional) Subfase 8.3: Compartir/Exportar

## Troubleshooting
- **Hot Reload**: Si no actualiza, `npx expo start --clear`.
- **Librerías**: Confirma versiones compatibles con Expo 54.
- **Navigation**: Usa Stack (no Drawer) - Drawer incompatible con Expo Go.
- **Dynamic Routes**: Usa `[id].tsx` para rutas dinámicas con Expo Router.

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
git commit -m "✨ feat: mensaje"

# Emojis comunes:
# ✨ feat: new feature
# 🐛 fix: bug fix
# ♻️ refactor: refactoring
# 📝 docs: documentation
# 🔧 config: configuration

# NPM
npm install
npm list
npx tsc --noEmit

# Expo
npx expo start                # Iniciar servidor
npx expo start --clear        # Limpiar cache y iniciar
```

## 🚀 Navigation Patterns (Expo Router)

### File-based Routing

```typescript
// Navegar a pantalla
import { useRouter } from 'expo-router'
const router = useRouter()

router.push('/orden/001')           // Navigate to orden details
router.push('/nueva-orden/paso1')   // Navigate to new orden form
router.replace('/')                 // Replace current screen
router.back()                       // Go back
```

### Dynamic Routes

```typescript
// Archivo: app/orden/[id].tsx
import { useLocalSearchParams } from 'expo-router'

export default function OrdenDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  // id = "001", "002", etc.
}
```

### Stack Headers

```typescript
// En _layout.tsx
<Stack.Screen
  name="index"
  options={{
    title: '📋 Mis Órdenes',
    headerStyle: { backgroundColor: '#007AFF' },
    headerTintColor: '#fff',
  }}
/>
```

## 🗄️ CRUD Operations (ordenService)

```typescript
import { ordenService } from '@/services/ordenService'

// Create
const newId = await ordenService.createOrden(data)

// Read
const ordenes = await ordenService.getOrdenes()
const orden = await ordenService.getOrdenById('001')

// Update
await ordenService.updateOrden('001', updatedData)

// Delete
await ordenService.deleteOrden('001')

// Search
const results = await ordenService.searchByCliente('BANCO')
const results = await ordenService.searchByNumero('001')
```

**Storage Structure:**
- `ordenes:list` - Array of orden IDs
- `ordenes:data:{id}` - Individual orden data
- `ordenes:lastId` - Auto-increment counter
- `temp_nueva_orden` - Temporary storage for new orden
- `temp_edit_orden` - Temporary storage for editing

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

## 🎨 Component Patterns

### Form Components (2-Step Pattern)

```typescript
// Paso 1: Cliente + Fecha + Ubicación
// File: app/nueva-orden/paso1.tsx
<HeaderForm
  data={formData}
  onDataChange={setFormData}
  isDark={isDark}
/>

// Paso 2: Extintores + Info Final
// File: app/nueva-orden/paso2.tsx
{currentStep === 'detalles' ? (
  <DetallesForm />
) : (
  <FinalForm />
)}
```

### List Components

```typescript
// File: app/index.tsx
<FlatList
  data={ordenes}
  renderItem={({ item }) => (
    <OrdenCard
      orden={item}
      onPress={() => router.push(`/orden/${item.id}`)}
      isDark={isDark}
    />
  )}
  refreshControl={<RefreshControl />}
/>
```

### Search Component

```typescript
// File: src/components/OrdenTrabajo/SearchBar.tsx
<SearchBar
  onSearch={(query, filter) => handleSearch(query, filter)}
  onClear={handleClearSearch}
  isDark={isDark}
/>
```

### FAB (Floating Action Button)

```typescript
// File: src/components/Navigation/FAB.tsx
<FAB
  onPress={() => router.push('/nueva-orden/paso1')}
  isDark={isDark}
/>
```

## 📚 Documentation References

- **Main Docs**: `CLAUDE.md` - Guía completa para AI assistants
- **README**: `README.md` - Setup y overview del proyecto
- **Phase Docs**: `docs/` - Documentación organizada por fase
  - `docs/07-FASE7-NAVEGACION/` - Navegación architecture
  - `docs/08-FASE8-ACCIONES/PLAN_FASE8.md` - Plan actual

## ⚠️ Important Notes

- **TypeScript strict mode** está habilitado
- **New Architecture NO** habilitado (Expo Go limitation)
- **Stack Navigation** sobre Drawer (compatibilidad Expo Go)
- **AsyncStorage** sobre MMKV (compatibilidad Expo Go)
- **Lenguaje**: Español en UI, validaciones, y comentarios
- **Platform**: Android primero, iOS secundario
- **Testing**: Siempre en Expo Go con dispositivo físico Android

## Instrucciones para GitHub Copilot

- **Contexto**: Windows 10/11, PowerShell, VSCode
- **Ruta Actual**: c:\dev\react-native\testing-app
- **Ruta Antigua**: c:\Users\willy\projects\testing-apk (deprecada)
- **Usa**: Rutas Windows (c:\dev\...), PowerShell cmdlets
- **Evita**: Comandos bash (ls, mv, rm), rutas Unix
- **Navigation**: Expo Router + Stack (NO Drawer)
- **Storage**: AsyncStorage (NO MMKV)

---

**Flujo resumen: Implementar → Testear en Expo Go → Verificar en teléfono → Commit → Siguiente fase**

**Stack completo: React Native + Expo Router + Stack Navigation + AsyncStorage + Zod + TypeScript**
