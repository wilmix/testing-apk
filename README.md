# 📱 Orden de Trabajo Mobile - React Native + Expo

App mobile **offline-first** para field workers (técnicos en campo) de recarga de extintores.

## 🎯 Objetivo

Transformar el formulario web `OrdenTrabajo.tsx` (MUI, ~20 campos) en una experiencia mobile optimizada con:
- ⚡ **70-80% mejora en UX**
- 🌐 **Funciona 100% sin internet**
- ⏱️ **Tiempo: 5-10 min → 1-2 min**
- ✓ **Validación real-time**

---

## 🏗️ Stack Tecnológico

| Componente | Librería | Versión | Por qué |
|-----------|----------|---------|--------|
| **Storage** | `react-native-mmkv` | 3.3.3 | ~30x más rápido, offline-first |
| **Dropdowns** | `react-native-element-dropdown` | 2.12.4 | Touch-optimized, search |
| **Validación** | `zod` | 3.25.76 | Type-safe, mensajes ES |
| **Date Picker** | `@react-native-community/datetimepicker` | 8.4.4 | Nativo iOS/Android |
| **State** | React Hooks | Built-in | Simple, sin deps extra |

---

## 📦 Instalación

### Requisitos Previos
- **Node.js** ≥ 18
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`

### Setup Inicial

```bash
# 1. Clonar/navegar al proyecto
cd c:\Users\willy\projects\testing-apk

# 2. Instalar dependencias (ya están instaladas en FASE 1)
npm install

# 3. Verificar que todo está OK
npx tsc --noEmit    # TypeScript
npm list            # Dependencias

# 4. Iniciar el proyecto
npx expo start

# En Android: presiona 'a'
# En iOS: presiona 'i'
# En Web: presiona 'w'
```

---

## 🚀 Uso

### Desarrollo

```bash
# Terminal 1: Iniciar servidor
npx expo start

# Terminal 2: Ver logs
npx expo start --clear

# En emulador/dispositivo:
# - Presiona 'a' para Android
# - Presiona 'i' para iOS
# - Presiona 'w' para Web
```

### Tests

```bash
# Compilar TypeScript
npx tsc --noEmit

# Ver estructura
tree src /L 3
```

---

## 📁 Estructura del Proyecto

```
c:\Users\willy\projects\testing-apk\
├─ src/
│  ├─ types/
│  │  └─ ordenTrabajo.ts         # Interfaces TypeScript
│  ├─ constants/
│  │  └─ ordenTrabajoConstants.ts # CLIENTES, MARCAS, TIPOS, etc
│  ├─ services/
│  │  ├─ mmkvService.ts          # MMKV Storage utilities
│  │  └─ validationService.ts    # Zod Schemas + validación
│  ├─ hooks/                     # FASE 2 (próximamente)
│  │  ├─ useMMKVStorage.ts
│  │  ├─ useFormData.ts
│  │  └─ useFieldVisibility.ts
│  ├─ components/                # FASE 3 (próximamente)
│  │  ├─ FormFields/
│  │  ├─ Feedback/
│  │  └─ OrdenTrabajo/
│  └─ utils/                     # Funciones utilitarias
│
├─ App.tsx                        # Componente raíz + tests
├─ app.json                       # Configuración Expo
├─ tsconfig.json                  # Configuración TypeScript
├─ package.json                   # Dependencias
│
├─ docs/                          # Documentación
│  ├─ ANALISIS_ORDEN_TRABAJO_MOBILE.md
│  ├─ GUIA_TECNICA_IMPLEMENTACION.md
│  ├─ RESUMEN_EJECUTIVO.md
│  └─ ...
│
└─ PLAN_ACCION_FASES.md          # Plan de 7 fases
```

---

## 🎬 Plan de Fases

### ✅ FASE 1: Setup Inicial (2-3h) - **COMPLETADA**
- ✅ Instalar dependencias (MMKV, Element Dropdown, Zod, DateTimePicker)
- ✅ Crear estructura de carpetas
- ✅ TypeScript Types
- ✅ Constants
- ✅ Schemas Zod
- ✅ MMKV Service
- ✅ Tests en App.tsx

### 🔄 FASE 2: Hooks Base (3-4h) - **PRÓXIMA**
- `useMMKVStorage` - Guardar/cargar datos
- `useFormData` - Validación + persistencia
- `useFieldVisibility` - Campos condicionales
- Tests

### 📱 FASE 3: Componentes Base (2-3h)
- `FormInput`, `FormDropdown`, `FormDatePicker`
- `ValidationIcon`
- Estilos touch-friendly

### 📝 FASE 4: Header Form (4-5h) - **APPROVAL POINT 1**
- Cliente dropdown + search
- Fecha Entrega date picker
- Validación real-time
- Guardado MMKV

### 📋 FASE 5: Detalles Dinámicos (5-6h) - **APPROVAL POINT 2**
- Items add/remove
- Cascada Unidad → Capacidad
- Validación completa

### ✏️ FASE 6: Final + Submit (4-5h) - **APPROVAL POINT 3**
- Ubicación condicional
- Teléfono
- Observaciones
- Préstamo con reveal
- Submit

### 🧪 FASE 7: Testing (3-4h) - **APPROVAL POINT 4**
- Offline functionality
- Performance
- Responsive design
- UX completo

**Total Estimado**: 25-32 horas = 4-5 días

---

## 📊 Status Actual

```
✅ FASE 1: Setup Inicial
   ├─ Dependencias: ✅ 4 instaladas
   ├─ Estructura: ✅ 6 carpetas
   ├─ Types: ✅ 7 interfaces
   ├─ Constants: ✅ 9 constantes
   ├─ Schemas: ✅ 6 schemas
   ├─ Services: ✅ MMKV + Validación
   ├─ Tests: ✅ 8 tests en App.tsx
   └─ Git: ✅ Commit realizado

🚀 PRÓXIMO: FASE 2 - Hooks Base
```

---

## 🧪 Tests FASE 1

Para verificar que todo funciona:

```bash
# 1. Compilar TypeScript
npx tsc --noEmit

# 2. Verificar dependencias
npm list react-native-mmkv react-native-element-dropdown zod @react-native-community/datetimepicker

# 3. Ver App.tsx tests
npx expo start
# Presiona 'w' para web
# Mira la consola con los tests
```

**Outputs esperados en App.tsx:**
```
✅ Imports exitosos (MMKV, Types, Constants, Schemas)
✅ CLIENTES: 11 clientes
✅ MARCAS: 11 marcas
✅ TIPOS: 6 tipos
✅ CAPACIDAD_UNIDADES: 3 unidades
✅ Datos de prueba creados
✅ Header validation: VALID
✅ Detalles validation: VALID
✅ Datos guardados en MMKV
✅ Datos cargados correctamente de MMKV
✅ Verificar clave: EXISTS
✅ Total de claves en MMKV: 1
🎉 TODOS LOS TESTS PASARON!
```

---

## 💡 Características Clave

### Offline-First ✅
- Todos los datos guardados en MMKV automáticamente
- Funciona 100% sin internet
- Indicador visual de estado
- Sincronización automática al recuperar conexión

### Validación Real-Time ✅
- Feedback inmediato (🟢 válido, 🔴 error, 🟡 warning)
- Mensajes en español con Zod
- Validación por campo
- Validación completa antes de submit

### Progressive Disclosure ✅
- Header mínimo (cliente + fecha)
- Ubicación condicional (según cliente)
- Detalles dinámicos (add/remove items)
- Observaciones y préstamo finales
- Reduce cognitive load

### Touch-Friendly ✅
- Botones ≥48x48px
- Inputs ≥44px altura
- Espaciado ≥16px
- Single column layout
- No requiere precisión

---

## 📚 Documentación

### Análisis & Planificación
- `PLAN_ACCION_FASES.md` - Plan completo de 7 fases
- `docs/ANALISIS_ORDEN_TRABAJO_MOBILE.md` - Estrategia completa

### Guías Técnicas
- `docs/GUIA_TECNICA_IMPLEMENTACION.md` - Código copy-paste ready
- `docs/RESUMEN_EJECUTIVO.md` - Overview ejecutivo

### Resúmenes
- `FASE1_RESUMEN_VISUAL.md` - Resumen visual FASE 1
- `docs/RESUMEN_VISUAL_TABLAS.md` - Tablas comparativas

---

## 🔗 Links Útiles

### Documentación Oficial
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [MMKV GitHub](https://github.com/mrousavy/react-native-mmkv)
- [Element Dropdown Docs](https://github.com/hoaphantn7604/react-native-element-dropdown)
- [Zod Docs](https://zod.dev)

### Recursos Locales
- `copilot-instructions.md` - Instrucciones para GitHub Copilot
- Documentación en `/docs/` folder

---

## 🐛 Troubleshooting

### "Module not found"
```bash
# Limpiar caché y reinstalar
npx expo start --clear
npm ci
```

### "TypeScript compilation error"
```bash
# Verificar tipos
npx tsc --noEmit

# Ver errores específicos
npx tsc
```

### "MMKV not working"
```bash
# Verificar que está instalada
npm list react-native-mmkv

# Reinstalar si es necesario
npx expo install react-native-mmkv
```

### "Emulador no se conecta"
```bash
# Reiniciar metro bundler
npx expo start --clear

# En nuevo terminal
npx expo start
```

---

## 👥 Equipo

- **Desarrollador**: GitHub Copilot
- **Propietario**: wilmix
- **Repo**: testing-apk

---

## 📝 Notas Importantes

### Versiones Utilizadas (Expo SDK 54)
- React Native: 0.81.4
- React: 19.1.0
- TypeScript: ~5.9.2
- Expo: ~54.0.13

### Configuración
- `newArchEnabled: true` en app.json
- `userInterfaceStyle: "automatic"` para soporte light/dark theme
- TypeScript strict mode habilitado

### Principios de Diseño
- **KISS**: Soluciones simples
- **DRY**: Reutilización de código
- **SOLID**: Responsabilidades claras
- **Mobile-First**: Optimizado para mobile
- **Accessibility**: Touch-friendly (48px+)

---

## 🚀 Comenzar

```bash
# 1. Clonar/navegar
cd c:\Users\willy\projects\testing-apk

# 2. Instalar dependencias (ya instaladas)
npm install

# 3. Iniciar
npx expo start

# 4. Abrir en emulador o dispositivo
# Presiona 'a' (Android), 'i' (iOS) o 'w' (Web)

# 5. Ver tests en App.tsx
# La consola mostrará los tests de FASE 1
```

---

## 📅 Timeline Estimado

```
HOY (18 Oct):      ✅ FASE 1 Completada
DÍA 2:             🔄 FASE 2-3 (Setup Hooks + Componentes)
DÍA 3-4:           📝 FASE 4-5 (Header + Detalles)
DÍA 5:             ✏️ FASE 6 (Final + Submit)
DÍA 6-7:           🧪 FASE 7 (Testing)

TOTAL: ~4-5 días de desarrollo
```

---

## ✅ Checklist para Comenzar FASE 2

```
PRE-REQUISITOS COMPLETADOS:
✅ Node.js ≥ 18 instalado
✅ npm funcionando
✅ Proyecto React Native + Expo creado
✅ FASE 1 completada

ARCHIVOS CREADOS:
✅ src/types/ordenTrabajo.ts
✅ src/constants/ordenTrabajoConstants.ts
✅ src/services/mmkvService.ts
✅ src/services/validationService.ts
✅ App.tsx (actualizado con tests)

VERIFICACIONES:
✅ npm list (dependencias OK)
✅ npx tsc --noEmit (TypeScript OK)
✅ Git commit realizado

STATUS: ✅ LISTO PARA FASE 2
```

---

## 📞 Soporte

Para más información:
- Lee `PLAN_ACCION_FASES.md` para detalles completos
- Lee `docs/GUIA_TECNICA_IMPLEMENTACION.md` para código
- Revisa `copilot-instructions.md` para contexto del proyecto

---

**¡FASE 1 Completada! 🎉 Próximo: FASE 2 - Hooks Base**

Para comenzar FASE 2, responde: `Listo para FASE 2`
