# 🔧 TROUBLESHOOTING GUIDE - FASE 7 NAVEGACIÓN

**Fecha**: 2025-10-20
**Propósito**: Prevenir errores recurrentes durante implementación de Expo Router

---

## 📋 Índice de Errores

1. [Error: Missing babel-preset-expo](#1-error-missing-babel-preset-expo)
2. [Error: Missing react-native-worklets](#2-error-missing-react-native-worklets)
3. [Error: Missing react-native-screens](#3-error-missing-react-native-screens)
4. [Error: Worklets Version Mismatch](#4-error-worklets-version-mismatch-crítico)
5. [Error: ThemeProvider Context](#5-error-themeprovider-context)
6. [Warning: Extraneous Routes](#6-warning-extraneous-routes)
7. [Decisión: Stack vs Drawer Navigation](#7-decisión-arquitectónica-stack-vs-drawer)

---

## 1. Error: Missing babel-preset-expo

### ❌ Error Completo
```
Android Bundling failed 608ms
Unable to resolve module babel-preset-expo from c:\Users\willy\projects\testing-apk\babel.config.js:
Cannot find module 'babel-preset-expo'
```

### 🔍 Causa Raíz
- `babel-preset-expo` no estaba instalado como devDependency
- Requerido por Expo para configurar Babel correctamente

### ✅ Solución
```bash
npm install --save-dev babel-preset-expo --legacy-peer-deps
```

**Nota**: Requiere `--legacy-peer-deps` debido a conflictos de versiones de React (19.1.0 vs 19.2.0)

### 📝 Lección Aprendida
- **Siempre verificar** que `babel-preset-expo` esté en `devDependencies` al configurar un proyecto Expo
- Usar `--legacy-peer-deps` si hay conflictos de peer dependencies

### ✅ Verificación
```json
// package.json
{
  "devDependencies": {
    "babel-preset-expo": "^54.0.5"
  }
}
```

---

## 2. Error: Missing react-native-worklets

### ❌ Error Completo
```
Unable to resolve module react-native-worklets/plugin from c:\Users\willy\projects\testing-apk\babel.config.js:
Cannot find module 'react-native-worklets-core'
```

### 🔍 Causa Raíz
- `react-native-worklets-core` es dependencia requerida por `react-native-reanimated`
- No se instaló automáticamente al instalar reanimated

### ✅ Solución
```bash
npm install react-native-worklets-core --legacy-peer-deps
```

### 📝 Lección Aprendida
- `react-native-reanimated` tiene dependencias implícitas que deben instalarse manualmente
- Siempre revisar las peer dependencies de librerías de animación

### ✅ Verificación
```json
// package.json
{
  "dependencies": {
    "react-native-worklets-core": "^1.4.2"
  }
}
```

---

## 3. Error: Missing react-native-screens

### ❌ Error Completo
```bash
npm list react-native-screens
# (empty)
```

### 🔍 Causa Raíz
- `react-native-screens` requerido por `expo-router` para navegación
- No estaba instalado

### ✅ Solución
```bash
npx expo install react-native-screens
```

**Nota**: Usar `npx expo install` en lugar de `npm install` para asegurar compatibilidad con SDK de Expo

### 📝 Lección Aprendida
- Usar `npx expo install` para dependencias relacionadas con Expo
- Verificar instalación con `npm list <package>`

### ✅ Verificación
```json
// package.json
{
  "dependencies": {
    "react-native-screens": "^4.5.0"
  }
}
```

---

## 4. Error: Worklets Version Mismatch (CRÍTICO)

### ❌ Error Completo
```
[WorkletsError: Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1).
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#mismatch-between-javascript-part-and-native-part-of-reanimated for more details.]
```

### 🔍 Causa Raíz
- **Plugin de reanimated en Babel** causando incompatibilidad con Expo Go
- Expo Go incluye versión nativa específica de reanimated (0.5.1)
- Plugin de Babel intenta usar versión más nueva (0.6.1)

### ✅ Solución
**Modificar `babel.config.js`**:

**❌ ANTES** (causaba error):
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // ❌ PROBLEMA
  };
};
```

**✅ DESPUÉS** (funciona):
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // ✅ Plugin removido
  };
};
```

### 📝 Lección Aprendida
- **NO usar** `react-native-reanimated/plugin` cuando se trabaja con **Expo Go**
- Plugin de reanimated solo es necesario para **Development Builds** o builds standalone
- Expo Go ya incluye reanimated pre-configurado

### ⚠️ Cuándo Usar el Plugin
- **Development Build**: ✅ Agregar plugin
- **Expo Go**: ❌ NO agregar plugin
- **Build standalone (eas build)**: ✅ Agregar plugin

### ✅ Verificación
```bash
# Limpiar caché y reiniciar
npx expo start --clear
# No debe mostrar error de Worklets
```

---

## 5. Error: ThemeProvider Context

### ❌ Error Completo
```
Error: useTheme must be used within a ThemeProvider
```

### 🔍 Causa Raíz
- Screens (`app/index.tsx`, `app/about.tsx`, `app/configuracion.tsx`) intentando usar `useTheme()` antes de que ThemeProvider se inicialice completamente
- Orden de renderizado: Screen intenta acceder a contexto antes de que provider esté listo

### ✅ Solución
**Cambiar de `useTheme()` a `useColorScheme()`**:

**❌ ANTES** (causaba error):
```typescript
import { useTheme } from '../src/contexts/ThemeContext'

export default function OrdenesListScreen() {
  const { theme, isDark } = useTheme() // ❌ Error: Provider no existe aún

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }}>
      {/* ... */}
    </SafeAreaView>
  )
}
```

**✅ DESPUÉS** (funciona):
```typescript
import { useColorScheme } from 'react-native'

export default function OrdenesListScreen() {
  const colorScheme = useColorScheme() // ✅ Hook nativo
  const isDark = colorScheme === 'dark'
  const backgroundColor = isDark ? '#121212' : '#f5f5f5'

  return (
    <SafeAreaView style={{ backgroundColor }}>
      {/* ... */}
    </SafeAreaView>
  )
}
```

### 📝 Lección Aprendida
- Para screens temporales o simples: usar `useColorScheme()` directamente (hook nativo de React Native)
- Para componentes complejos que necesitan theme completo: asegurar que ThemeProvider esté en jerarquía superior
- `useColorScheme()` es más seguro para screens de navegación principales

### 🎯 Alternativa
Si necesitas el theme completo, asegurar que `ThemeProvider` esté en `app/_layout.tsx`:

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider> {/* ✅ Provider envuelve todo */}
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
```

### ✅ Verificación
```bash
# No debe mostrar error de contexto al abrir screen
npx expo start
# Presionar 'a' para Android
```

---

## 6. Warning: Extraneous Routes

### ⚠️ Warning Completo
```
Too many screens defined. Route "orden/[id]" is extraneous.
```

### 🔍 Causa Raíz
- Definiendo rutas en `app/_layout.tsx` que ya tienen su propio `_layout.tsx` en subdirectorios
- Expo Router usa **file-based routing**: cada `_layout.tsx` define su propia sección

### ✅ Solución
**Estructura de carpetas correcta**:

```
app/
├── _layout.tsx              # ✅ Solo screens principales
├── index.tsx
├── about.tsx
├── configuracion.tsx
│
├── orden/
│   ├── _layout.tsx          # ✅ Define rutas de "orden/*"
│   └── [id].tsx
│
└── nueva-orden/
    ├── _layout.tsx          # ✅ Define rutas de "nueva-orden/*"
    ├── paso1.tsx
    └── paso2.tsx
```

**❌ ANTES** (`app/_layout.tsx` - incorrecto):
```typescript
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="orden/[id]" />        {/* ❌ Ya tiene _layout.tsx */}
      <Stack.Screen name="nueva-orden/paso1" /> {/* ❌ Ya tiene _layout.tsx */}
    </Stack>
  )
}
```

**✅ DESPUÉS** (`app/_layout.tsx` - correcto):
```typescript
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
      <Stack.Screen name="configuracion" />
      {/* orden/* y nueva-orden/* se manejan en sus propios _layout.tsx */}
    </Stack>
  )
}
```

### 📝 Lección Aprendida
- **File-based routing**: Solo definir screens que están directamente en esa carpeta
- **Nested layouts**: Cada subdirectorio con múltiples screens debe tener su propio `_layout.tsx`
- **No duplicar**: Si existe `orden/_layout.tsx`, no declarar `orden/*` en root layout

### ✅ Verificación
- No debe aparecer warning de "extraneous routes" en consola
- Navegación a subdirectorios funciona correctamente

---

## 7. Decisión Arquitectónica: Stack vs Drawer

### 🎯 Objetivo Original
Implementar **Drawer Navigation** (menú hamburguesa) estilo Gmail

### ❌ Problema
- **Drawer Navigation** requiere `@react-navigation/drawer`
- `@react-navigation/drawer` requiere `react-native-reanimated` con plugin de Babel
- Plugin de reanimated **incompatible con Expo Go** (Error #4 - Worklets mismatch)

### ✅ Solución Adoptada
**Usar Stack Navigation** como solución temporal:

```typescript
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: '📋 Mis Órdenes' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="configuracion" options={{ title: 'Configuración' }} />
    </Stack>
  )
}
```

### 📊 Comparación

| Aspecto | Drawer Navigation | Stack Navigation |
|---------|-------------------|------------------|
| **UX** | ☰ menú lateral | Headers nativos |
| **Compatibilidad Expo Go** | ❌ Requiere plugin | ✅ Funciona directo |
| **Animaciones** | Requiere reanimated | Nativas |
| **Complejidad** | Alta | Baja |
| **MVP** | Nice-to-have | Suficiente |

### 🛣️ Plan a Futuro

**Fase Actual (Expo Go)**:
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return <Stack>{/* screens */}</Stack>
}
```

**Fase Futura (Development Build)**:
```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer'

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Mis Órdenes' }} />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
    </Drawer>
  )
}
```

### 📝 Lección Aprendida
- **Expo Go** tiene limitaciones con librerías que requieren código nativo personalizado
- **Development Build** permite usar cualquier librería nativa
- **Priorizar MVP funcional** sobre UX ideal cuando hay restricciones técnicas
- Stack Navigation es **suficiente para FASE 7**, Drawer puede agregarse en **FASE 8** o posterior

### ⚠️ Cuándo Usar Drawer
- ✅ Development Build (`eas build --profile development`)
- ✅ Build standalone (`eas build`)
- ❌ Expo Go (QR scan)

---

## 🎯 Checklist Pre-Implementación

Antes de empezar cualquier implementación con Expo Router, verificar:

### 1. Dependencies

```bash
# Verificar instalación de todas las dependencias
npm list expo-router
npm list expo-linking
npm list react-native-screens
npm list react-native-safe-area-context

# Si faltan, instalar con:
npx expo install expo-router expo-linking react-native-screens
```

### 2. Configuration Files

**✅ `package.json`**:
```json
{
  "main": "expo-router/entry"
}
```

**✅ `app.json`**:
```json
{
  "expo": {
    "scheme": "ordenestrabajo",
    "plugins": ["expo-router"]
  }
}
```

**✅ `babel.config.js`**:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // ❌ NO agregar react-native-reanimated/plugin con Expo Go
  };
};
```

### 3. TypeScript

```bash
# Compilar sin errores
npx tsc --noEmit
```

### 4. Clean Start

```bash
# Limpiar caché y reiniciar
npx expo start --clear
```

---

## 🚨 Errores Comunes y Soluciones Rápidas

### Error: "Cannot find module 'X'"
**Solución**: Instalar dependencia faltante
```bash
npx expo install <package-name>
```

### Error: "Worklets mismatch"
**Solución**: Remover plugin de reanimated de `babel.config.js`
```javascript
plugins: [], // Vacío para Expo Go
```

### Error: "useX must be used within Provider"
**Solución**: Usar hook nativo o verificar jerarquía de providers
```typescript
// Usar hook nativo
const colorScheme = useColorScheme()
```

### Error: "Too many screens defined"
**Solución**: Crear `_layout.tsx` en subdirectorio
```
app/subdirectorio/_layout.tsx
```

### App no carga después de cambios
**Solución**: Limpiar caché
```bash
npx expo start --clear
```

---

## 📚 Referencias

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [File-based Routing](https://docs.expo.dev/router/create-pages/)
- [Reanimated Troubleshooting](https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting)
- [Expo Go Limitations](https://docs.expo.dev/workflow/expo-go/)

---

## 🔄 Última Actualización

**Fecha**: 2025-10-20
**Autor**: Claude Code + Willy Salas
**Status**: Documentación completa de errores Subfases 7.0 y 7.1
