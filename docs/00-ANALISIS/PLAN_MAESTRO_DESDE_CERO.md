# 🚀 PLAN MAESTRO: REX/Mobile - De Cero a Producción

**Documento de Referencia para Proyectos React Native + Expo Offline-First**

> 📌 Este documento es **100% conceptual**. Para código, ver archivos específicos en `/docs/[FASE]/`.

---

## 📋 Resumen Ejecutivo

### ¿Qué es REX/Mobile?

Aplicación móvil **offline-first** para técnicos de recarga de extintores. Convierte un proceso manual de 5-10 minutos por orden en una experiencia mobile optimizada de 1-2 minutos.

**Problema → Solución:**

| Aspecto | Antes (Web) | Después (App) | Mejora |
|--------|-----------|--------------|--------|
| **Tiempo/orden** | 5-10 min | 1-2 min | ⚡ 75% más rápido |
| **Conectividad** | Requiere internet | 100% offline | 🌐 Cualquier lugar |
| **Usabilidad** | 20+ campos simultáneos | 2-step progresivo | 📱 67% menos pasos |
| **Entrada datos** | Manual completa | QR + auto-fill | 📷 67% menos digitación |
| **UX/UX** | Escritorio | Mobile-first | ✨ 70-80% mejora |

**Métrica de Éxito:**
- ✅ Técnicos procesan **3x más órdenes/día**
- ✅ **0 órdenes perdidas** (offline-first)
- ✅ **Satisfacción**: Reducción de errores de entrada

---

## 🎯 Visión del Producto

### Usuarios Primarios

**Técnico de Recarga en Campo** (90% del tráfico)
- Android (dispositivos corporativos + personales)
- Conexión inestable o inexistente
- Necesita velocidad (múltiples órdenes/día)
- Usa el app 8-10 horas diarias
- Requiere feedback háptico (vibraciones) por seguridad

**Supervisor de Oficina** (10% del tráfico)
- iOS + Android
- Monitorea órdenes completadas
- Acceso a reportes y búsqueda avanzada

### Pilares Arquitectónicos

1. **Offline-First**: La conexión es "bonus", no requisito
2. **Progressive Disclosure**: Mostrar solo campos relevantes
3. **Keyboard Optimization**: Cada acción reduce toques
4. **Haptic Feedback**: Feedback multisensorial en Android
5. **Atomic Design**: Componentes reutilizables pequeños

---

## 🛠️ Tech Stack Decisiones

### Framework: React Native + Expo (NO Flutter)

**Por qué React Native:**
- ✅ TypeScript nativo (type-safety)
- ✅ Comunidad JavaScript más activa
- ✅ Fácil integración con web (si es necesario)

**Por qué Expo (NO React Native CLI):**
- ✅ **Expo Go** - Desarrollo sin compilación
- ✅ Pre-incluye 80+ módulos nativos
- ✅ OTA Updates (actualizaciones sin App Store)
- ✅ EAS Build (generar APK sin Android SDK local)
- ⚠️ Algunas librerías requieren Development Build

### Navegación: Expo Router + Stack (NO Drawer)

**Decisión Inicial:** Drawer Navigation (menú lateral)
**Problema Encontrado:** `react-native-reanimated` incompatible con Expo Go
**Solución Adoptada:** Stack Navigation + Bottom Tab Navigation concept

**Por qué Stack:**
- ✅ Funcionamiento nativo en Expo Go
- ✅ Flujo intuitivo (back button)
- ✅ File-based routing (Expo Router)
- ✅ Headers automáticos
- ❌ Sin menú lateral (pero no es necesario)

**Estructura resultante:**
```
/ (Home - Lista de órdenes)
  └── /orden/[id] (Detalles)
  └── /nueva-orden/paso1 (Crear - Paso 1)
  └── /nueva-orden/paso2 (Crear - Paso 2)
  └── /about (About)
  └── /configuracion (Settings)
  └── /test (Testing)
```

### Storage: AsyncStorage (NO MMKV)

**Decisión Inicial:** MMKV (más rápido, moderno)
**Problema Encontrado:** MMKV v3 requiere TurboModules (NOT en Expo Go)
**Solución Adoptada:** AsyncStorage 2.2.0

**Comparativa:**

| Aspecto | AsyncStorage | MMKV |
|--------|-------------|------|
| **Performance** | ~10-100ms (JSON) | ~1-10ms (binario) |
| **Expo Go** | ✅ Incluido | ❌ Requiere Dev Build |
| **Límite** | ~10MB (suficiente) | Ilimitado |
| **Caso de uso** | MVP/Startup | Producción con volumen |

**Para REX/Mobile:** AsyncStorage suficiente (100-200 órdenes = ~5MB)

### Validación: Zod (NO JSON Schema)

**Por qué Zod:**
- ✅ Type-inference automático
- ✅ Mensajes en español customizados
- ✅ Composable (reutilizable)
- ✅ Lightweight (~10KB)

**Estrategia de validación:**
1. **On Blur** - Validar campo individual (UX rápida)
2. **On Submit** - Validar completo (seguridad)
3. **Real-time** - Mostrar errores al usuario

### State Management: React Hooks (NO Redux)

**Por qué NO Redux:**
- Overkill para app simple
- 50KB+ de boilerplate
- Curva de aprendizaje

**Por qué Hooks:**
- ✅ Built-in (0 dependencias)
- ✅ Fácil testing
- ✅ Custom hooks para lógica reutilizable

**Patrón usado:**
- `useFormData` - State + validation + persistence
- `useStorage` - AsyncStorage wrapper
- `useFieldVisibility` - Conditional logic
- `useQRReader` - QR parsing
- `useHapticFeedback` - Vibrations

### QR Scanner: expo-camera (NO react-native-camera)

**Por qué expo-camera:**
- ✅ Incluido en Expo Go
- ✅ Permisos automáticos
- ✅ Soporte Android + iOS
- ✅ Performance optimizado

**Payload QR (JSON):**
```json
{
  "version": "1.0",
  "tipo": "extintor_batch",
  "detalles": [
    {
      "extintorNro": "001588",
      "capacidadUnidad": "KILOS",
      "capacidadValor": "6 KILOS",
      "marca": "KIDDE BRASIL",
      "tipo": "ABC"
    }
  ]
}
```

### Themeing: React Context (NO styled-components)

**Por qué Context:**
- ✅ Built-in
- ✅ Soporte dark mode automático
- ✅ Lightweight

**Modos de tema:**
- 🌙 Automático (detecta sistema operativo)
- ☀️ Claro (forzar)
- 🌙 Oscuro (forzar)
- ✅ Persistencia en AsyncStorage

---

## 🎨 Flujo de UX - Wireframes Conceptuales

### Pantalla 1: Lista de Órdenes (Home)

```
┌─────────────────────────────────┐
│ 📋 Mis Órdenes      ☀️  🌙  ⚙️  │ ← Header con acciones
├─────────────────────────────────┤
│ [🔍 Buscar] [Filtro ▼] [Ok]     │ ← SearchBar
├─────────────────────────────────┤
│                                 │
│ HOJA / TARJETA (OrdenCard)      │ ← Cada orden
│ ┌───────────────────────────┐   │
│ │ #001 BANCO NACIONAL       │   │ ← Número + Cliente
│ │ 21/10/2025 | 🟢 Completada │ ← Fecha + Estado
│ │ 3 extintores | Teléfono   │   │ ← Metadata
│ └───────────────────────────┘   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ #002 BANCO SOLIDARIO      │   │
│ │ 20/10/2025 | 🔴 Anulada   │   │
│ │ 5 extintores              │   │
│ └───────────────────────────┘   │
│                                 │
│ ⤓ Desliza hacia abajo           │ ← Pull-to-Refresh
│                                 │
│                          [ + ]   │ ← FAB (Nueva orden)
└─────────────────────────────────┘
```

**Componentes:**
- **SearchBar** - Búsqueda por cliente/número + dropdown filtro
- **OrdenCard** - Tarjeta visual con info condensada
- **FAB** - Floating Action Button para crear

**Interacciones:**
- Tap en card → Detalles
- Swipe pull → Refresh lista
- Tap FAB → Nueva orden (Paso 1)
- Long-press → Opciones (Editar/Anular)

---

### Pantalla 2: Detalles de Orden

```
┌─────────────────────────────────┐
│ ← Orden #001           (Estado) │ ← Header con back
├─────────────────────────────────┤
│                                 │
│ 📊 RESUMEN                      │
│ ─────────────────────────────   │
│ Orden:        #001              │
│ Estado:       🟢 Completada      │
│ Técnico:      Willy Salas       │
│                                 │
│ 👤 CLIENTE                      │
│ ─────────────────────────────   │
│ Nombre:       BANCO NACIONAL    │
│ Teléfono:     70123456          │
│ Ubicación:    Av. 16 de Julio   │
│ Agencia:      (si aplica)       │
│                                 │
│ 🧯 EXTINTORES (3)               │
│ ─────────────────────────────   │
│ [▼] #1: 001588 | 6 KILOS | ABC  │
│     Marca: KIDDE BRASIL         │
│     Estado: ✅ Válido            │
│                                 │
│ [▼] #2: 002145 | 2 KILOS | BC   │
│ [▶] #3: 003456 | 10 KILOS | ABC │
│                                 │
│ 📝 NOTAS                        │
│ ─────────────────────────────   │
│ "Cliente requiere urgente..."   │
│                                 │
│ 📦 PRÉSTAMO                     │
│ ─────────────────────────────   │
│ Cantidad: 2 extintores          │
│                                 │
│ 🕐 HISTORIAL                    │
│ ─────────────────────────────   │
│ Creada:   21/10/2025 08:30      │
│ Modificada: 21/10/2025 14:15    │
│                                 │
├─────────────────────────────────┤
│ [✏️ Editar] [🗑️ Anular]         │ ← Acciones
└─────────────────────────────────┘
```

**Características:**
- Collapsible items (cada extintor)
- Información estructurada por secciones
- Estado visual claro (emojis)
- Acciones contextuales (Editar/Anular)

---

### Pantalla 3: Nueva Orden - Paso 1

```
┌─────────────────────────────────┐
│ ← Nueva Orden (Paso 1/2)        │
├─────────────────────────────────┤
│ Progreso: [██████░░░░░░░░░░░░]  │
│                                 │
│ 📋 INFORMACIÓN DEL CLIENTE      │
│                                 │
│ Cliente * (requerido)           │
│ [Selecciona...         ▼]       │ ← Dropdown + búsqueda
│                                 │
│ Fecha de Entrega *              │
│ [21/10/2025           📅] ✅    │ ← Date picker
│                                 │
│ (Si BANCO SOLIDARIO)            │ ← Campo condicional
│ Agencia * [           ▼]        │
│                                 │
│ (Si NO es BANCO SOLIDARIO)      │
│ Dirección * [                ]  │
│                                 │
│ ⓘ * = requerido                 │
│                                 │
│ [Cancelar]      [Continuar →]   │ ← Acciones
└─────────────────────────────────┘
```

**UX Decisions:**
- **Progressive disclosure** - Solo mostrar agencia O dirección
- **Validación visual** - ✅ cuando válido, ❌ cuando error
- **Touch-friendly** - Botones ≥48x48 px
- **Clear progress** - Barra visual + "Paso 1/2"

---

### Pantalla 4: Nueva Orden - Paso 2 (Extintores)

```
┌─────────────────────────────────┐
│ ← Nueva Orden (Paso 2/2)        │
├─────────────────────────────────┤
│ [✅ Paso 1] ── [Extintores]     │ ← Breadcrumb
│                                 │
│ 🧯 DETALLES DE EXTINTORES       │
│                                 │
│ ▼ Extintor 1                    │ ← Collapsible
│   Número:     [001588      ] ✅ │
│   Capacidad:  [KILOS▼][6▼] ✅   │ ← Cascada
│   Marca:      [KIDDE  ▼]   ✅   │
│   Tipo:       [ABC    ▼]   ✅   │
│   [📷 QR] [🗑️ Eliminar]         │
│                                 │
│ ▶ Extintor 2 (vacío)        ❌   │ ← Colapsado
│                                 │
│ [+ Agregar] [📷 Leer QR Batch]  │
│                                 │
│ Mínimo 1 extintor requerido    │
│                                 │
│ [← Atrás]        [Continuar →]  │
└─────────────────────────────────┘
```

**Características técnicas:**
- **Cascada de dropdowns** - Capacidad Unidad → Capacidad Valor
- **QR Scanner** - Por extintor O batch (JSON multi-extintor)
- **Validación** - Cada extintor completo y válido
- **Add/Remove** - Agregar/quitar extintores dinámicamente
- **Collapsible** - Ahorrar espacio en pantalla

---

### Pantalla 5: Nueva Orden - Paso 2b (Info Final)

```
┌─────────────────────────────────┐
│ ← Nueva Orden (Paso 2/2)        │
├─────────────────────────────────┤
│ [✅ Paso 1] ── [✅ Extintores]  │
│                                 │
│ 📝 INFORMACIÓN FINAL            │
│                                 │
│ Teléfono * [70123456      ] ✅  │
│            (7-15 dígitos)       │
│                                 │
│ Observaciones                   │
│ ┌───────────────────────────┐   │
│ │ Cliente requiere           │   │ ← Textarea
│ │ urgente para mañana...     │   │
│ └───────────────────────────┘   │
│ 45 / 500 caracteres             │ ← Contador
│                                 │
│ Préstamo de Extintores          │
│ ◉ Sí    ○ No                    │ ← Radio buttons
│                                 │
│ (Si Préstamo = Sí)              │
│ Cantidad * [2            ]      │ ← Reveal
│                                 │
├─────────────────────────────────┤
│ [← Atrás]    [✅ Crear Orden]   │
└─────────────────────────────────┘
```

**Pattern: Reveal/Collapse**
- Mostrar "Cantidad" solo si Préstamo = Sí
- Validar cantidad si está visible

---

### Pantalla 6: About (Información)

```
┌─────────────────────────────────┐
│ ← About                         │
├─────────────────────────────────┤
│                                 │
│        🔥 REX/Mobile            │ ← Logo
│                                 │
│ Versión: 1.0.0                  │
│ Build: 2025-10-21               │
│                                 │
│ 📊 ESTADÍSTICAS                 │
│ ─────────────────────────────   │
│ Órdenes:     234                │
│ Almacenado:  ~2.3 MB            │
│ Última sync: Hace 2 horas        │
│                                 │
│ 👨‍💻 DESARROLLADOR                │
│ ─────────────────────────────   │
│ Willy Salas Quiroga             │
│ 🌐 willysalas.com               │ ← Link web
│                                 │
│                                 │
│ 📝 LICENCIA                     │
│ ─────────────────────────────   │
│ Uso interno corporativo         │
│ © 2025 All Rights Reserved       │
│                                 │
│ [🌐 Visitar sitio web]          │ ← CTA
└─────────────────────────────────┘
```

**Propósito:** Información sobre la app, créditos, estadísticas

---

### Pantalla 7: Configuración

```
┌─────────────────────────────────┐
│ ← Configuración                 │
├─────────────────────────────────┤
│                                 │
│ 🎨 APARIENCIA                   │
│ ─────────────────────────────   │
│ Modo:  ◉ Automático ○ Claro ○   │
│           Oscuro (toggles)       │ ← Radio group
│                                 │
│ [Modo oscuro ON/OFF]            │ ← Switch visual
│                                 │
│ 💾 DATOS                        │
│ ─────────────────────────────   │
│ Espacio usado: 2.3 MB / 10 MB   │ ← Progress bar
│                                 │
│ Órdenes:      234               │
│ Caché:        1.2 MB            │
│                                 │
│ [🗑️ Limpiar Caché]              │ ← Acción
│ [⬇️ Descargar datos]             │ ← Export
│ [⬆️ Restaurar datos]             │ ← Import
│                                 │
│ ℹ️ INFORMACIÓN                  │
│ ─────────────────────────────   │
│ Versión: 1.0.0                  │
│ Compilación: 2025-10-21         │
│                                 │
│ [🔄 Buscar actualizaciones]     │
│ [📞 Soporte técnico]            │
│                                 │
└─────────────────────────────────┘
```

**Funcionalidades:**
- **Dark Mode Toggle** - Radio buttons + persistencia
- **Storage info** - Barra visual de uso
- **Limpieza** - Clear cache con confirmación
- **Información** - Versión, fecha build

---

## 📱 Estructuras de Datos

### Modelo Orden (OrdenTrabajoFormData)

```
┌─ ORDEN TRABAJO ────────────────────────────┐
│                                            │
├─ METADATA                                 │
│  • id: UUID único                         │
│  • estado: 'completada' | 'anulada'       │
│  • fechaCreacion: timestamp                │
│  • fechaModificacion: timestamp            │
│                                            │
├─ HEADER (Paso 1)                          │
│  • cliente: string (dropdown)              │
│  • fechaEntrega: Date                      │
│  • agencia: string (si BANCO SOLIDARIO)    │
│  • direccion: string (si NO es banco)      │
│                                            │
├─ DETALLES (Paso 2a) - Array               │
│  ┌─ DETALLE EXTINTOR ─────────────┐      │
│  │ • id: UUID                      │      │
│  │ • extintorNro: 1-10 dígitos     │      │
│  │ • capacidadUnidad: KILOS/...    │      │
│  │ • capacidadValor: "6 KILOS"     │      │
│  │ • marca: dropdown               │      │
│  │ • tipo: dropdown                │      │
│  └─────────────────────────────────┘      │
│  (Mínimo 1, máximo N)                      │
│                                            │
├─ FINAL (Paso 2b)                          │
│  • telefono: 7-15 dígitos                  │
│  • observaciones: max 500 chars            │
│  • prestamoExtintores: boolean             │
│  • cantidadPrestamo: number (si = true)    │
│                                            │
└────────────────────────────────────────────┘
```

### Flujo de Validación

```
┌─────────────────────────────────────────┐
│  USUARIO INGRESA DATOS                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ ON BLUR/CHANGE  │ ← Validación temprana
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
  ✅ VÁLIDO               ❌ ERROR
  (mostrar ✅)            (mostrar ❌)
    │                         │
    └────────────┬────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  ON SUBMIT      │ ← Validación completa
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
  ✅ CREAR ORDEN          ❌ BLOQUEAR
  (guardar + navegar)      (mostrar errores)
```

### Persistencia en AsyncStorage

```
KEYGENERACIÓN:

✓ ordenes:list
  └─ Array de IDs: ["1", "2", "3", ...]

✓ ordenes:data:1
  └─ Orden completa (JSON serializado)

✓ ordenes:data:2
  └─ Otra orden...

✓ ordenes:lastId
  └─ Contador para auto-increment

✓ app:theme_preference
  └─ 'auto' | 'light' | 'dark'

✓ temp_nueva_orden
  └─ Formulario en progreso (Paso 1 o 2)

✓ temp_edit_orden
  └─ Orden en edición
```

**Estrategia de backup:**
- Auto-save cada 500ms (useFormData)
- Validación NO bloquea guardado
- Validación solo en submit

---

## ⏱️ Timeline & Fases Completas

### Overview Visual

```
┌─────────────────────────────────────────────────────┐
│                   ROADMAP COMPLETO                  │
│                                                     │
│ SEMANA 1 (10-12h)                                   │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 1: FASE 1 + 2                            │   │
│ │ Setup + Hooks → Base sólida                  │   │
│ │ Tiempo: 5-6h | Iteraciones: 2-3              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 2-3: FASE 3 + 4                          │   │
│ │ Components Base + HeaderForm → Forms iniciales│  │
│ │ Tiempo: 5-6h | Iteraciones: 3-4              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ SEMANA 2 (12-15h)                                  │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 4-5: FASE 5 + 5.5                        │   │
│ │ DetallesForm dinámicos + QR Scanner          │   │
│ │ Tiempo: 6-7h | Iteraciones: 4-5              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 6: FASE 6                                │   │
│ │ FinalForm + Submit → Flujo completo          │   │
│ │ Tiempo: 4-5h | Iteraciones: 2-3              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ SEMANA 3 (10-12h)                                  │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 7-8: FASE 7 (Navegación & CRUD)          │   │
│ │ Expo Router + Stack + ordenService           │   │
│ │ Tiempo: 6-8h | Iteraciones: 3-4              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Día 8-9: FASE 8 (Polish & Final)             │   │
│ │ About + Config + Testing → Ready for prod    │   │
│ │ Tiempo: 4-5h | Iteraciones: 2-3              │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ TOTAL: ~40-45 horas (5-6 días reales)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Fases Detalladas (Conceptual)

### FASE 1: Setup Inicial (5-6 horas)

**Objetivo:** Preparar base sólida con todas las dependencias, estructura y configuración.

**Componentes:**

1. **Crear Proyecto Expo**
   - `npx create-expo-app@latest`
   - Versión: ~54.0.13
   - Template: blank-typescript

2. **Instalar Dependencias Core** (~15 librerías)
   - AsyncStorage (offline storage)
   - Expo Router (navigation)
   - Zod (validation)
   - react-native-element-dropdown
   - expo-camera (QR)
   - expo-haptics (vibrations)
   - Otros: date picker, safe area, etc.

3. **Configurar Expo Router**
   - `babel.config.js` - setup babel
   - `app.json` - plugins, scheme
   - `package.json` - main: "expo-router/entry"

4. **Estructura de Carpetas**
   - `app/` - File-based routing
   - `src/types` - TypeScript interfaces
   - `src/constants` - Static data
   - `src/services` - Business logic
   - `src/hooks` - Custom hooks
   - `src/contexts` - React contexts
   - `src/components` - UI components

5. **Definir Types**
   - `OrdenTrabajoFormData` - Main model
   - `DetalleExtintor` - Child model
   - `EstadoOrden` - Enum-like
   - Otras interfaces

6. **Crear Constants**
   - 11 clientes (BANCO NACIONAL, SOLIDARIO, etc.)
   - 11 marcas (KIDDE, AMEREX, BADGER, etc.)
   - 6 tipos de extintores (ABC, BC, CO2, etc.)
   - Capacidades con cascada

7. **Setup Validation Service (Zod)**
   - HeaderSchema
   - DetalleExtintorSchema
   - DetallesSchema
   - FinalSchema
   - OrdenTrabajoSchemaComplete
   - Mensajes en español

8. **Setup AsyncStorage Service**
   - `getJSON<T>()` - Leer con type
   - `setJSON()` - Guardar
   - `remove()` - Eliminar
   - `has()` - Verificar
   - `getAllKeys()` - Listar

9. **Crear ThemeContext**
   - Provider wrapper
   - Light/dark themes
   - `useTheme()` hook
   - Automático basado en SO

10. **Setup Root Layout**
    - Stack.Navigator
    - SafeAreaProvider
    - ThemeProvider

**Artefactos generados:** 9-10 archivos base

**Resultado esperado:** Base limpia, sin dependencias faltantes, tipos definidos

---

### FASE 2: Hooks Base (3-4 horas)

**Objetivo:** Crear hooks reutilizables para state management y lógica de negocio.

**Hooks implementados:**

1. **useStorage<T>** - Generic AsyncStorage wrapper
   - Load on mount
   - Save changes
   - Clear data
   - Loading state

2. **useFormData<T>** - Form state management
   - Data state
   - Errors + touched fields
   - Validación (on blur + submit)
   - Auto-save con debounce (500ms)
   - Métodos: updateField, validate, reset

3. **useFieldVisibility** - Conditional logic
   - Show agencia si cliente = BANCO SOLIDARIO
   - Show dirección en otro caso
   - Show cantidad si prestamoExtintores = true
   - Reutilizable en múltiples pantallas

4. **useQRReader** - QR parsing + validation
   - Parse JSON desde string QR
   - Validar contra constants (marcas, tipos)
   - Convertir a DetalleExtintor[]
   - Manejo de errores

5. **useHapticFeedback** - Vibration feedback
   - success() - Notificación éxito
   - error() - Notificación error
   - warning() - Notificación warning
   - selection() - Feedback selección
   - impact(style) - Custom impact

**Patrón usado:** Custom hooks para lógica reutilizable

**Resultado esperado:** 5 hooks + tests básicos en App.tsx

---

### FASE 3: Componentes Base (2-3 horas)

**Objetivo:** Crear componentes atómicos reutilizables para forms.

**Componentes implementados:**

1. **FormInput**
   - Text input + label + error message
   - Validación visual (✅/❌)
   - Touch-friendly (≥48px height)
   - Dark mode support
   - Multiline + char count opcional

2. **FormDropdown**
   - Dropdown con búsqueda
   - Validación visual
   - Label + error
   - Soporta data dinámica
   - Dark mode

3. **FormDatePicker**
   - Native date picker (iOS/Android)
   - Label + error
   - Validación visual
   - Formato localizado (es-BO)
   - Min/max date opcional

4. **ValidationIcon**
   - Emoji feedback (✅/❌)
   - Simple, reutilizable
   - Sin dependencias

**Patrón:** Atomic design (pequeños, reutilizables, componentizables)

**Resultado esperado:** 4 componentes + barrel exports

---

### FASE 4: HeaderForm - Paso 1 (4-5 horas)

**Objetivo:** Crear primer paso del formulario (Cliente + Fecha + Ubicación).

**Componentes:**

1. **HeaderForm Component**
   - Cliente (dropdown requerido)
   - Fecha Entrega (date picker requerido)
   - Agencia (condicional si BANCO SOLIDARIO)
   - Dirección (condicional si otro cliente)
   - Validación integrada
   - Estado persistente

**Lógica:**
- On change → actualizar state
- On blur → validar campo
- On submit → validar todo
- Auto-save → AsyncStorage (500ms)

**Interacciones:**
- Seleccionar cliente → mostrar/ocultar agencia/dirección
- Cambiar fecha → auto-validar rango
- Botón Continuar → validar + navegar

**Resultado esperado:** Paso 1 funcional, persistencia en AsyncStorage

---

### FASE 5: DetallesForm - Extintores Dinámicos (5-6 horas)

**Objetivo:** Crear lista dinámica de extintores con cascada y QR.

**Componentes:**

1. **DetallesForm Component**
   - Lista dinámica de extintores (DetalleExtintor[])
   - Agregar extintor
   - Eliminar extintor
   - Editar individual
   - Collapsible items
   - Validación

2. **Cascada de Dropdowns**
   - Capacidad Unidad (KILOS/LIBRAS/LITROS)
   - Capacidad Valor (dinamically filtered)
   - Ejemplo: KILOS → [1, 2.5, 4, 5, 6, 10, 12]

3. **QR Scanner**
   - Botón "📷 Leer QR"
   - Camera preview
   - Parse JSON
   - Auto-fill extintor
   - Feedback (vibración + visual)
   - Validación contramarks/tipos

4. **Validación**
   - Cada extintor completo y válido
   - Mínimo 1 requerido
   - Máximo N (ilimitado)

**Resultado esperado:** Extintores dinámicos con QR scanner

---

### FASE 5.5: QR Reader - Escaneo Avanzado (2 horas)

**Objetivo:** Optimizar QR scanning para batch y individual.

**Mejoras:**

1. **Batch QR Scanning**
   - Scan 1 QR = cargar N extintores
   - Payload JSON con array
   - Auto-fill todos

2. **Validación QR**
   - Verificar formato
   - Verificar tipos/marcas
   - Feedback errores claro

3. **Feedback Háptico**
   - Success: vibración doble
   - Error: vibración triple
   - Warning: vibración simple

4. **Optimización**
   - Cache de últimos QR
   - Reintento automático
   - Timeout handling

**Resultado esperado:** QR scanning robusto y optimizado

---

### FASE 6: FinalForm - Información Final (4-5 horas)

**Objetivo:** Paso final del formulario (teléfono, observaciones, préstamo).

**Componentes:**

1. **FinalForm Component**
   - Teléfono (7-15 dígitos, requerido)
   - Observaciones (max 500 chars, opcional)
   - Préstamo toggle (Sí/No)
   - Cantidad préstamo (reveal si Sí, requerido)

2. **Submit Button**
   - Validación completa (Header + Detalles + Final)
   - Loading state
   - Feedback háptico
   - Success → crear orden + navegar

3. **Flujo Completo**
   - Persistencia temporal en AsyncStorage
   - Validación progresiva
   - Clear feedback
   - Error recovery

**Resultado esperado:** Flujo completo de creación de orden

---

### FASE 7: Navegación & CRUD (6-8 horas)

**Objetivo:** Implementar navegación, CRUD y listado de órdenes.

**Componentes:**

1. **Expo Router Setup**
   - File-based routing
   - Stack layout
   - Dynamic routes
   - Headers automáticos

2. **Routes:**
   - `/` - Home (lista)
   - `/orden/[id]` - Detalles
   - `/nueva-orden/paso1` - Crear paso 1
   - `/nueva-orden/paso2` - Crear paso 2
   - `/about` - About
   - `/configuracion` - Settings

3. **HomeScreen - Lista de Órdenes**
   - SearchBar (búsqueda + filtros)
   - OrdenCard (tarjeta por orden)
   - FAB (nueva orden)
   - Pull-to-refresh
   - Lazy loading

4. **DetallesScreen**
   - Mostrar orden completa
   - Editar orden
   - Anular orden
   - Back navigation

5. **OrdenService - CRUD**
   - CREATE: `createOrden(data) → id`
   - READ: `getOrden(id)`, `getOrdenes()`
   - UPDATE: `updateOrden(id, data)`
   - DELETE: `deleteOrden(id)`
   - SEARCH: `searchByCliente()`, `searchByNumero()`

6. **Persistencia Orden**
   - ID-based: `ordenes:data:{id}`
   - Index: `ordenes:list`
   - Last ID: `ordenes:lastId`
   - Auto-increment

**Resultado esperado:** App funcional con CRUD completo

---

### FASE 8: Polish & Final (4-5 horas)

**Objetivo:** Pulir UI, agregar features finales y testing.

**Subfases:**

1. **Subfase 8.1: Edición de Órdenes**
   - Pre-cargar datos existentes
   - Modo edición (sin crear duplicado)
   - Botón Guardar vs Crear
   - Validación igual

2. **Subfase 8.2: About + Configuración**
   - **AboutScreen:** Info app, créditos, web link
   - **ConfigScreen:** Dark mode toggle, estadísticas, caché

3. **Subfase 8.3: Compartir Orden (Opcional)**
   - Generar texto resumen
   - Compartir via WhatsApp/email
   - PDF (si tiempo)

4. **Subfase 8.4: Testing Final**
   - Verificar todos flujos
   - Testing en dispositivo real
   - Dark mode todas pantallas
   - Performance con 50+ órdenes
   - Cleanup: remover console.logs

**Resultado esperado:** App production-ready

---

## 📊 Comparativa: Documentación Inicial vs Implementación Real

### Cambios Tecnológicos por Expo Go

| Decisión Original | Razón | Solución Adoptada | Por qué |
|------------------|-------|------------------|--------|
| **Drawer Navigation** | Menú lateral | **Stack Navigation** | react-native-reanimated no en Expo Go |
| **MMKV** | Performance | **AsyncStorage** | MMKV v3 requiere TurboModules |
| **Redux** | State management | **Custom Hooks** | Overkill para app simple |
| **styled-components** | Styling | **React Context + StyleSheet** | Más compatible |
| **Development Build** | Control total | **Expo Go** | Rapidez en dev, OTA updates |

### Qué de `/docs` NO se implementó

```
DOCUMENTOS DE /docs QUE SE IGNORARON:

❌ /07-FASE7-NAVEGACION/PLAN_ACCION_V2_GMAIL.md
   Razón: Drawer Navigation no era viable en Expo Go

❌ Parte de /05-FASE5-DETALLES/
   Razón: Cambios en estructura por Expo Router

❌ Referencias a "Development Build"
   Razón: Expo Go fue suficiente para MVP

✅ TODO LO DE FASES 1-6 SE IMPLEMENTÓ
✅ FASE 7 SE REIMPLEMENTÓ CON STACK
✅ FASE 8 FUE COMPLETAMENTE NUEVO
```

### Qué SÍ se reutilizó de `/docs`

```
✅ Estructura de tipos (ordenTrabajo.ts)
✅ Constants (clientes, marcas, tipos)
✅ Schemas de validación (Zod)
✅ Conceptos de components atómicos
✅ Validación on blur + on submit
✅ Progressive disclosure logic
✅ Dark mode strategy
✅ Offline-first filosofía
```

---

## 🎯 Decisiones Clave Explicadas

### 1. Por qué Stack Navigation y NO Drawer

**Situación inicial:**
- Documentación sugería Drawer (menú lateral)
- UI atractiva, profesional
- Pero `react-native-reanimated` tiene issues con Expo Go

**Solución:**
- Cambiar a Stack Navigation
- Más simple, nativa, fast
- Breadcrumbs o "Paso X/X" para orientación
- FAB para acciones principales
- Hamburger menu → Tab navigation si se necesita

**Lección:** En Expo Go, simplicidad > complejidad. Las animaciones smooth son nice-to-have, no need-to-have.

---

### 2. Por qué AsyncStorage y NO MMKV

**Situación inicial:**
- MMKV = más rápido (1-10ms vs 10-100ms)
- Moderno, recomendado en comunidad
- Pero MMKV v3 requiere TurboModules (Expo Go-incompatible)

**Análisis de caso de uso:**
- ~100-200 órdenes = ~5MB JSON
- 100ms latency aceptable (usuario no lo percibe)
- Auto-save en background (no bloquea UI)

**Solución:**
- AsyncStorage 2.2.0 (incluido en Expo)
- Suficiente para MVP
- Upgrade futuro a MMKV si RDBMS se integra

**Lección:** Performance prematura es enemiga. Medir primero, optimizar después.

---

### 3. Por qué React Context State y NO Redux

**Opciones evaluadas:**
- Redux (industry standard pero overkill)
- MobX (complejo)
- Recoil (muy experimental)
- Hooks + Context (simple)

**Análisis:**
- App tiene ~7 pantallas
- State relativamente simple
- User ID, theme, temp forms
- No hay state complejo (no gaming, no real-time)

**Solución:**
- Custom hooks (`useFormData`, `useStorage`)
- Context para globales (theme)
- Props drilling aceptable
- Fácil refactorizar si crece

**Lección:** Filosofía KISS. Agregar complejidad cuando se demuestre necesaria, no "por si acaso".

---

### 4. Por qué Zod y NO JSON Schema

**Opciones:**
- JSON Schema (estándar, pero verbose)
- Yup (anterior a Zod)
- Zod (moderno, type-safe)

**Decisión:**
- Zod: infers TypeScript types automatically
- Composable schemas
- Mensajes en español customizables
- Ligero (~10KB)

**Ejemplo**
```
interface OrdenSchema generado automáticamente desde Zod
No necesitas escribir types + schemas por separado
Single source of truth
```

**Lección:** Type inference es powerful. Valida y tipifica con una sola definición.

---

### 5. Dark Mode Strategy

**Enfoque:**
1. **Automático** (por defecto) - Detecta SO
2. **Manual** - Usuario puede forzar light/dark
3. **Persistencia** - Guarda en AsyncStorage

**Implementación:**
- ThemeContext.Provider en root
- useTheme() hook global
- Todos componentes respetan isDark

**Beneficio:** Accesibilidad. Usuarios con ojos sensibles aprecian dark mode.

---

## 🚀 Lecciones Aprendidas

### ✅ Qué Funcionó Bien

1. **Offline-first desde el inicio**
   - No requiere arquitectura especial
   - AsyncStorage es suficiente
   - Users esperan que app funcione sin internet

2. **Progressive disclosure en forms**
   - Formularios largos → pasos progresivos
   - Usuario no se abruma
   - Validación temprana (on blur)

3. **QR scanning optimizado**
   - 1 escaneo = múltiples datos
   - Ahorra 67% de tiempo de entrada
   - ROI alto en productividad

4. **Custom hooks para lógica**
   - Reutilizable en múltiples componentes
   - Fácil testing
   - Código limpio

5. **TypeScript strict mode**
   - Evita bugs antes de runtime
   - Autocompletar en IDE

### ❌ Qué Fue Difícil

1. **Expo Go Limitations**
   - NO todas las librerías funcionan
   - Requiere investigación previa
   - A veces necesitas workarounds

2. **Drawer Navigation → Stack**
   - Reimplementación media fase
   - Pero mejoró user experience

3. **Testing en dispositivo real**
   - Emulador no captura todo
   - Rendimiento diferente

4. **Asincronía en forms**
   - Debounce, auto-save, validación simultánea
   - Requiere testing exhaustivo

### 💡 Próxima Vez (Best Practices)

1. **Verificar Expo Go compatibility ANTES de elegir libreías**
   - Check docs.expo.dev
   - Probar en emulator temprano
   - No confiar en "should work"

2. **Diseñar forms con progressive disclosure desde el inicio**
   - No monolítica
   - Validación por paso

3. **Validar early, save always**
   - Mostrar errores quick
   - Auto-save aunque haya errores (borrador)

4. **Testing en dispositivo real desde fase 1**
   - Emulator engaña
   - Performance real varía

5. **Documentar decisiones arquitectónicas**
   - Por qué Stack vs Drawer
   - Por qué AsyncStorage vs MMKV
   - Facilita onboarding futuro

---

## 📦 Entregables Finales

### Artefactos Producidos

```
testing-app/
├── app/                    # 7 pantallas + routing
├── src/
│   ├── types/             # 4 interfaces TypeScript
│   ├── constants/         # 50+ valores estáticos
│   ├── services/          # 4 servicios (storage, validation, orden, migration)
│   ├── hooks/             # 5 custom hooks
│   ├── contexts/          # 1 ThemeContext
│   └── components/        # 20+ componentes atómicos
├── docs/                  # 60+ documentos
│   ├── 00-ANALISIS/       # Este plan + otros
│   ├── 01-FASE1-SETUP/
│   ├── 02-FASE2-HOOKS/
│   ├── ... (8 fases)
│   └── 09-BUILD-APK/
├── package.json           # 25+ dependencias
├── app.json               # Configuración Expo
├── tsconfig.json          # TypeScript config
└── babel.config.js        # Babel setup
```

### Métricas Finales

```
📊 ESTADÍSTICAS:

Líneas de código:        ~4,500 (sin docs)
Componentes:             20+
Custom Hooks:            5
Tipos TypeScript:        10+
Validaciones Zod:        5 schemas
Dependencias:            25+
Documentación:           60+ .md files
Fases completadas:       8/8 (100%)
Tiempo total:            ~40-45 horas
Iteraciones:             2-4 por fase
```

### Funcionalidades Entregadas

```
✅ CRUD Órdenes completo
✅ Formulario 2 pasos
✅ QR Scanner (batch + individual)
✅ Validación real-time
✅ Offline-first (AsyncStorage)
✅ Dark mode (3 modos)
✅ Búsqueda avanzada
✅ Pull-to-refresh
✅ Persistencia datos
✅ Navegación Stack
✅ Feedback háptico
✅ TypeScript strict
✅ 100% Expo Go compatible
✅ Ready para APK
```

---

## 🎓 Conclusión

**REX/Mobile demuestra que es posible construir una app mobile profesional:**
- ✅ En 5-6 días reales
- ✅ Sin código nativo
- ✅ Con Expo (no ejector)
- ✅ 100% offline-first
- ✅ Production-ready

**La clave:** Decisiones arquitectónicas tempranas + KISS philosophy + Testing en dispositivo real.

**Próximas aventuras:** APK generado, App Store distribution, o escalado a apps más complejas.

---

## 🎯 Visión del Producto

### Problema a Resolver

**Antes** (Formulario Web):
- 📝 20+ campos en una sola pantalla
- 🔄 Campos condicionales poco claros
- ❌ No funciona sin internet
- ⏱️ 5-10 minutos por orden
- 📱 Difícil de usar en dispositivo móvil

**Después** (REX/Mobile):
- 📱 Formulario en 2 pasos simples
- ✅ Progressive disclosure (campos relevantes)
- 🌐 Funciona 100% offline
- ⏱️ 1-2 minutos por orden
- 📷 QR scanner para auto-fill (67% más rápido)

### Wireframes del Flujo Principal

#### 1. Lista de Órdenes (Home)

```
┌──────────────────────────────────────────┐
│ 📋 Mis Órdenes                    🌙     │ ← Header
├──────────────────────────────────────────┤
│ [🔍 Buscar...] [Cliente ▼] [Buscar]     │ ← SearchBar
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 Orden #001                      │  │ ← OrdenCard
│  │ BANCO NACIONAL DE BOLIVIA          │  │
│  │ 2025-10-21 | 🟢 Completada         │  │
│  │ 3 extintores                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 Orden #002                      │  │
│  │ BANCO SOLIDARIO                    │  │
│  │ 2025-10-20 | 🔴 Anulada            │  │
│  │ 5 extintores                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ⤓ Pull to refresh                      │
│                                          │
│                                 [ + ]    │ ← FAB
└──────────────────────────────────────────┘
```

**Componentes:**
- `SearchBar.tsx` - Búsqueda con filtros dropdown
- `OrdenCard.tsx` - Card visual de cada orden
- `FAB.tsx` - Floating Action Button para nueva orden

---

#### 2. Detalles de Orden

```
┌──────────────────────────────────────────┐
│ ← Orden #001                             │ ← Header
├──────────────────────────────────────────┤
│                                          │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃ Orden #001        🟢 Completada    ┃ │ ← Estado
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                          │
│ 📋 INFORMACIÓN DEL CLIENTE               │
│ ────────────────────────────────────     │
│ Cliente:   BANCO NACIONAL DE BOLIVIA     │
│ Fecha:     21 de octubre de 2025         │
│ Dirección: Av. 16 de Julio #1234         │
│ Teléfono:  70123456                      │
│                                          │
│ 🧯 DETALLES DE EXTINTORES (3)            │
│ ────────────────────────────────────     │
│ ┌──────────────────────────────────┐    │
│ │ Extintor #1                      │    │
│ │ Número: 001588                   │    │
│ │ Capacidad: 6 KILOS               │    │
│ │ Marca: KIDDE BRASIL              │    │
│ │ Tipo: ABC                        │    │
│ └──────────────────────────────────┘    │
│ ┌──────────────────────────────────┐    │
│ │ Extintor #2 ...                  │    │
│ └──────────────────────────────────┘    │
│                                          │
│ 📝 INFORMACIÓN ADICIONAL                 │
│ ────────────────────────────────────     │
│ Préstamo:      Sí (2 extintores)         │
│ Observaciones: Cliente requiere...       │
│                                          │
│ 🕐 FECHAS                                │
│ ────────────────────────────────────     │
│ Creación:      21/10/2025 08:30          │
│ Modificación:  21/10/2025 14:15          │
│                                          │
├──────────────────────────────────────────┤
│  [✏️ Editar]  [🗑️ Anular]               │ ← Acciones
└──────────────────────────────────────────┘
```

---

#### 3. Nueva Orden - Paso 1 (Cliente)

```
┌──────────────────────────────────────────┐
│ ← Nueva Orden - Paso 1/2                 │ ← Header
├──────────────────────────────────────────┤
│                                          │
│ INFORMACIÓN DEL CLIENTE                  │
│                                          │
│ Cliente *                                │
│ [Selecciona un cliente...        ▼] ✅  │
│                                          │
│ Fecha de Entrega *                       │
│ [21/10/2025                      📅] ✅  │
│                                          │
│ Dirección *                              │
│ [Av. 16 de Julio #1234          ] ✅    │
│                                          │
│ ⓘ Los campos con * son obligatorios     │
│                                          │
│                                          │
│                                          │
│              [Continuar →]               │ ← Habilitado si válido
└──────────────────────────────────────────┘
```

**Validación en tiempo real:**
- 🟢 Campo válido → ícono verde
- 🔴 Campo inválido → ícono rojo + mensaje
- ⚪ Campo sin tocar → sin ícono

**Campos condicionales:**
- Si cliente = "BANCO SOLIDARIO" → mostrar "Agencia"
- Si cliente ≠ "BANCO SOLIDARIO" → mostrar "Dirección"

---

#### 4. Nueva Orden - Paso 2 (Extintores)

```
┌──────────────────────────────────────────┐
│ ← Nueva Orden - Paso 2/2                 │ ← Header
├──────────────────────────────────────────┤
│ [✓ Cliente] ── [2 Extintores] ── [3]    │ ← Progress
├──────────────────────────────────────────┤
│                                          │
│ 🧯 DETALLES DE EXTINTORES                │
│                                          │
│ ▼ Extintor 1: 001588              ✅    │ ← Collapsible
│   Número:     [001588          ] ✅     │
│   Capacidad:  [KILOS ▼] [6 KILOS ▼] ✅  │
│   Marca:      [KIDDE BRASIL ▼   ] ✅    │
│   Tipo:       [ABC ▼            ] ✅    │
│                                          │
│ ▶ Extintor 2: (Vacío)              ❌    │
│                                          │
│ [+ Agregar Extintor] [📷 Escanear QR]   │
│                                          │
│ ⓘ Mínimo 1 extintor requerido            │
│                                          │
│              [Continuar →]               │
└──────────────────────────────────────────┘
```

**Cascada de Dropdowns:**
- Seleccionar "Capacidad Unidad" → filtra "Capacidad Valor"
- Ejemplo: KILOS → [1, 2.5, 4, 5, 6, 10, 12 KILOS]

**QR Scanner:**
- Escanea código JSON
- Auto-fill todos los campos del extintor
- Ahorra 67% del tiempo vs entrada manual

---

#### 5. Nueva Orden - Paso 2b (Info Final)

```
┌──────────────────────────────────────────┐
│ ← Nueva Orden - Paso 2/2                 │
├──────────────────────────────────────────┤
│ [✓ Cliente] ── [✓ Extintores] ── [3]    │ ← Progress
├──────────────────────────────────────────┤
│                                          │
│ 📝 INFORMACIÓN FINAL                     │
│                                          │
│ Teléfono *                               │
│ [70123456                       ] ✅     │
│                                          │
│ Observaciones                            │
│ ┌──────────────────────────────────┐    │
│ │ Cliente requiere servicio        │    │
│ │ urgente para mañana...           │    │
│ └──────────────────────────────────┘    │
│ 45 / 500 caracteres                      │
│                                          │
│ Préstamo de Extintores                   │
│ [◉] Sí   [○] No                          │
│                                          │
│ Cantidad de Préstamo                     │
│ [2                              ] ✅     │
│                                          │
│  [← Atrás]         [✅ Crear Orden]      │
└──────────────────────────────────────────┘
```

---

## 📊 Plan de Implementación Completo

### Timeline General: 35-45 horas (5-6 días)

```
┌─────────────────────────────────────────────────────────┐
│                    ROADMAP VISUAL                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DÍA 1-2    ███████░░░░░░░░░░░░░  FASE 1-3              │
│            Setup + Hooks + Components                   │
│                                                         │
│ DÍA 2-3    ░░░░░░░███████░░░░░░  FASE 4-5              │
│            Forms (Header + Detalles)                    │
│                                                         │
│ DÍA 3-4    ░░░░░░░░░░░░░██████░  FASE 5.5-6            │
│            QR Scanner + Final                           │
│                                                         │
│ DÍA 4-5    ░░░░░░░░░░░░░░░░░███  FASE 7                │
│            Navigation + CRUD                            │
│                                                         │
│ DÍA 5-6    ░░░░░░░░░░░░░░░░░░░█  FASE 8                │
│            Polish + Testing                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ FASE 1: Setup Inicial (2-3 horas)

### Objetivo
Preparar el proyecto base con todas las dependencias y estructura necesaria.

### Tareas

#### 1.1 Crear Proyecto Expo (15 min)

```powershell
# Crear proyecto
npx create-expo-app@latest testing-app --template blank-typescript

cd testing-app

# Verificar versión
npx expo --version
# Debe ser ~54.0.13
```

#### 1.2 Instalar Dependencias Core (20 min)

```powershell
# AsyncStorage (offline storage)
npx expo install @react-native-async-storage/async-storage

# Expo Router (navigation)
npx expo install expo-router expo-linking expo-constants expo-status-bar

# React Navigation
npx expo install @react-navigation/native react-native-screens react-native-safe-area-context

# Validación
npm install zod

# UI Components
npx expo install react-native-element-dropdown
npx expo install @react-native-picker/picker
npx expo install @react-native-community/datetimepicker

# QR Scanner
npx expo install expo-camera

# Haptics
npx expo install expo-haptics
```

**Total paquetes**: ~15 dependencias

#### 1.3 Configurar Expo Router (15 min)

**Archivo: `package.json`**
```json
{
  "main": "expo-router/entry"
}
```

**Archivo: `app.json`**
```json
{
  "expo": {
    "scheme": "rexmobile",
    "plugins": ["expo-router"],
    "userInterfaceStyle": "automatic"
  }
}
```

**Archivo: `babel.config.js`** (crear)
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

#### 1.4 Crear Estructura de Carpetas (20 min)

```
testing-app/
├── app/                    # 🆕 Expo Router
│   ├── _layout.tsx
│   ├── index.tsx
│   └── test.tsx
├── src/
│   ├── types/
│   │   └── ordenTrabajo.ts
│   ├── constants/
│   │   └── ordenTrabajoConstants.ts
│   ├── services/
│   │   ├── storageService.ts
│   │   └── validationService.ts
│   ├── hooks/
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   └── components/
│       ├── FormFields/
│       ├── Feedback/
│       ├── Navigation/
│       ├── QR/
│       └── OrdenTrabajo/
└── docs/
```

#### 1.5 Definir Types TypeScript (30 min)

**Archivo: `src/types/ordenTrabajo.ts`**

```typescript
export interface DetalleExtintor {
  id: string
  extintorNro: string
  capacidadUnidad: string
  capacidadValor: string
  marca: string
  tipo: string
}

export type EstadoOrden = 'completada' | 'anulada'

export interface OrdenTrabajoFormData {
  // Metadata
  id?: string
  estado?: EstadoOrden
  fechaCreacion?: Date
  fechaModificacion?: Date
  
  // Header
  fechaEntrega: Date
  cliente: string
  agencia: string
  direccion: string
  
  // Final
  telefono: string
  observaciones: string
  prestamoExtintores: boolean
  cantidadPrestamo: string
  
  // Detalles
  detalles: DetalleExtintor[]
}
```

#### 1.6 Crear Constants (20 min)

**Archivo: `src/constants/ordenTrabajoConstants.ts`**

```typescript
export const CLIENTES = [
  'BANCO NACIONAL DE BOLIVIA S.A.',
  'BANCO SOLIDARIO S.A.',
  'BANCO MERCANTIL SANTA CRUZ S.A.',
  // ... 8 más
]

export const MARCAS = [
  'KIDDE BRASIL',
  'AMEREX',
  'BADGER',
  // ... 8 más
]

export const TIPOS = ['ABC', 'BC', 'CO2', 'K', 'D', 'AGUA']

export const CAPACIDAD_UNIDADES = ['KILOS', 'LIBRAS', 'LITROS']

export const CAPACIDAD_VALORES = {
  KILOS: ['1 KILOS', '2.5 KILOS', '4 KILOS', '5 KILOS', '6 KILOS', '10 KILOS', '12 KILOS'],
  LIBRAS: ['2.5 LIBRAS', '5 LIBRAS', '10 LIBRAS', '20 LIBRAS'],
  LITROS: ['6 LITROS', '9 LITROS']
}
```

#### 1.7 Setup Validation con Zod (30 min)

**Archivo: `src/services/validationService.ts`**

```typescript
import { z } from 'zod'

export const HeaderSchema = z.object({
  cliente: z.string().min(1, 'Cliente requerido'),
  fechaEntrega: z.date({ required_error: 'Fecha requerida' }),
  agencia: z.string().optional(),
  direccion: z.string().optional(),
})

export const DetalleExtintorSchema = z.object({
  id: z.string(),
  extintorNro: z.string().regex(/^\d{1,10}$/, 'Debe ser un número (máximo 10 dígitos)'),
  capacidadUnidad: z.string().min(1, 'Unidad requerida'),
  capacidadValor: z.string().min(1, 'Capacidad requerida'),
  marca: z.string().min(1, 'Marca requerida'),
  tipo: z.string().min(1, 'Tipo requerido'),
})

export const DetallesSchema = z.object({
  detalles: z.array(DetalleExtintorSchema).min(1, 'Mínimo 1 extintor'),
})

export const FinalSchema = z.object({
  telefono: z.string().regex(/^\d{7,15}$/, 'Teléfono debe tener 7-15 dígitos'),
  observaciones: z.string().max(500, 'Máximo 500 caracteres').optional(),
  prestamoExtintores: z.boolean(),
  cantidadPrestamo: z.string().optional(),
})

export function validateData<T>(schema: z.ZodSchema<T>, data: any) {
  const result = schema.safeParse(data)
  return {
    valid: result.success,
    errors: result.success ? {} : result.error.flatten().fieldErrors,
  }
}
```

#### 1.8 Setup AsyncStorage Service (20 min)

**Archivo: `src/services/storageService.ts`**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

export const storageUtils = {
  async getJSON<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : (defaultValue ?? null)
    } catch (error) {
      console.error(`Error reading ${key}:`, error)
      return defaultValue ?? null
    }
  },

  async setJSON<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key}:`, error)
      return false
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
      return false
    }
  },

  async has(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key)
      return value !== null
    } catch (error) {
      return false
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys()
    } catch (error) {
      return []
    }
  },
}
```

#### 1.9 Crear ThemeContext (20 min)

**Archivo: `src/contexts/ThemeContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'

const lightTheme = {
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#dddddd',
  // ... más colores
}

const darkTheme = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#444444',
  // ... más colores
}

type Theme = typeof lightTheme

interface ThemeContextType {
  theme: Theme
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

#### 1.10 Setup Root Layout (15 min)

**Archivo: `app/_layout.tsx`**

```typescript
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '../src/contexts/ThemeContext'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="index"
            options={{ title: '📋 Mis Órdenes' }}
          />
          <Stack.Screen
            name="test"
            options={{ title: '🧪 Test', headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
```

### Resultado FASE 1

```
✅ Proyecto Expo creado
✅ 15+ dependencias instaladas
✅ Expo Router configurado
✅ Estructura de carpetas lista
✅ Types TypeScript definidos
✅ Constants creados (11 clientes, 11 marcas, etc.)
✅ Validation service con Zod
✅ AsyncStorage service
✅ ThemeContext con dark/light mode
✅ Root layout configurado

🎉 FASE 1 COMPLETADA - Base sólida lista
```

---

## 🪝 FASE 2: Hooks Base (3-4 horas)

### Objetivo
Crear hooks reutilizables para state management, storage y lógica de negocio.

### 2.1 useStorage Hook (45 min)

**Archivo: `src/hooks/useStorage.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react'
import { storageUtils } from '../services/storageService'

export function useStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [key])

  const loadData = async () => {
    const loaded = await storageUtils.getJSON<T>(key, defaultValue)
    if (loaded) setData(loaded)
    setLoading(false)
  }

  const saveData = useCallback(async (newData: T) => {
    setData(newData)
    await storageUtils.setJSON(key, newData)
  }, [key])

  const clearData = useCallback(async () => {
    setData(defaultValue)
    await storageUtils.remove(key)
  }, [key, defaultValue])

  return { data, saveData, clearData, loading }
}
```

### 2.2 useFormData Hook (1.5 horas)

**Archivo: `src/hooks/useFormData.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react'
import { storageUtils } from '../services/storageService'
import { z } from 'zod'

interface UseFormDataOptions {
  autoSave?: boolean
  debounceMs?: number
}

export function useFormData<T extends Record<string, any>>(
  storageKey: string,
  initialData: T,
  schema?: z.ZodSchema<T>,
  options: UseFormDataOptions = {}
) {
  const { autoSave = true, debounceMs = 500 } = options

  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  // Load from storage on mount
  useEffect(() => {
    loadData()
  }, [storageKey])

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSave || loading) return

    const timeoutId = setTimeout(() => {
      storageUtils.setJSON(storageKey, data)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [data, autoSave, debounceMs, storageKey, loading])

  const loadData = async () => {
    const loaded = await storageUtils.getJSON<T>(storageKey)
    if (loaded) setData(loaded)
    setLoading(false)
  }

  const updateField = useCallback((field: keyof T, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateMultiple = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const validate = useCallback(() => {
    if (!schema) return true

    const result = schema.safeParse(data)
    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors = result.error.flatten().fieldErrors
    const errorMessages: Record<string, string> = {}
    
    Object.entries(fieldErrors).forEach(([key, messages]) => {
      if (messages && messages.length > 0) {
        errorMessages[key] = messages[0]
      }
    })

    setErrors(errorMessages)
    return false
  }, [data, schema])

  const markTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
    storageUtils.remove(storageKey)
  }, [initialData, storageKey])

  return {
    data,
    errors,
    touched,
    loading,
    updateField,
    updateMultiple,
    validate,
    markTouched,
    setTouched,
    reset,
  }
}
```

### 2.3 useFieldVisibility Hook (30 min)

**Archivo: `src/hooks/useFieldVisibility.ts`**

```typescript
import { useMemo } from 'react'
import type { OrdenTrabajoFormData } from '../types/ordenTrabajo'

export function useFieldVisibility(data: OrdenTrabajoFormData) {
  const showAgencia = useMemo(() => {
    return data.cliente === 'BANCO SOLIDARIO S.A.'
  }, [data.cliente])

  const showDireccion = useMemo(() => {
    return data.cliente !== '' && !showAgencia
  }, [data.cliente, showAgencia])

  const showCantidadPrestamo = useMemo(() => {
    return data.prestamoExtintores
  }, [data.prestamoExtintores])

  return {
    showAgencia,
    showDireccion,
    showCantidadPrestamo,
  }
}
```

### 2.4 useQRReader Hook (45 min)

**Archivo: `src/hooks/useQRReader.ts`**

```typescript
import { useState, useCallback } from 'react'
import type { DetalleExtintor } from '../types/ordenTrabajo'
import { MARCAS, TIPOS, CAPACIDAD_VALORES } from '../constants/ordenTrabajoConstants'

interface QRPayload {
  version: string
  tipo: string
  detalles: Array<{
    extintorNro: string
    capacidadUnidad: string
    capacidadValor: string
    marca: string
    tipo: string
  }>
}

export function useQRReader() {
  const [error, setError] = useState<string | null>(null)

  const parseQRData = useCallback((qrString: string): DetalleExtintor[] | null => {
    try {
      setError(null)

      const payload: QRPayload = JSON.parse(qrString)

      // Validate payload structure
      if (!payload.version || !payload.tipo || !payload.detalles) {
        setError('Formato de QR inválido')
        return null
      }

      if (payload.tipo !== 'extintor_batch') {
        setError('Tipo de QR no soportado')
        return null
      }

      // Map to DetalleExtintor
      const detalles: DetalleExtintor[] = payload.detalles.map((item, index) => {
        // Validate against constants
        if (!MARCAS.includes(item.marca)) {
          throw new Error(`Marca no válida: ${item.marca}`)
        }
        if (!TIPOS.includes(item.tipo)) {
          throw new Error(`Tipo no válido: ${item.tipo}`)
        }

        return {
          id: `extintor_${Date.now()}_${index}`,
          extintorNro: item.extintorNro,
          capacidadUnidad: item.capacidadUnidad,
          capacidadValor: item.capacidadValor,
          marca: item.marca,
          tipo: item.tipo,
        }
      })

      return detalles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al parsear QR')
      return null
    }
  }, [])

  return { parseQRData, error }
}
```

### 2.5 useHapticFeedback Hook (30 min)

**Archivo: `src/hooks/useHapticFeedback.ts`**

```typescript
import { useCallback } from 'react'
import * as Haptics from 'expo-haptics'

export function useHapticFeedback() {
  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }, [])

  const error = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  }, [])

  const warning = useCallback() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  }, [])

  const selection = useCallback(() => {
    Haptics.selectionAsync()
  }, [])

  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    const impactStyle = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    }[style]
    
    Haptics.impactAsync(impactStyle)
  }, [])

  return { success, error, warning, selection, impact }
}
```

### Resultado FASE 2

```
✅ useStorage - Generic storage hook
✅ useFormData - Form state + validation + auto-save
✅ useFieldVisibility - Conditional logic
✅ useQRReader - QR parsing + validation
✅ useHapticFeedback - Tactile feedback

🎉 FASE 2 COMPLETADA - 5 hooks reutilizables listos
```

---

## 🧩 FASE 3: Componentes Base (2-3 horas)

### Objetivo
Crear componentes reutilizables de UI (inputs, dropdowns, date pickers, validation icons).

### 3.1 FormInput Component (30 min)

**Archivo: `src/components/FormFields/FormInput.tsx`**

```typescript
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'
import { ValidationIcon } from '../Feedback/ValidationIcon'

interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  touched?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
  multiline?: boolean
  maxLength?: number
  showCharCount?: boolean
}

export function FormInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  keyboardType = 'default',
  multiline = false,
  maxLength,
  showCharCount,
}: FormInputProps) {
  const { theme, isDark } = useTheme()

  const hasError = touched && error
  const isValid = touched && !error && value.length > 0

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: hasError ? theme.error : theme.border,
            },
          ]}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
        />
        
        {touched && (
          <View style={styles.iconContainer}>
            <ValidationIcon valid={isValid} />
          </View>
        )}
      </View>

      {hasError && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}

      {showCharCount && maxLength && (
        <Text style={[styles.charCount, { color: theme.textSecondary }]}>
          {value.length} / {maxLength}
        </Text>
      )}
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
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
})
```

### 3.2 FormDropdown Component (45 min)

**Archivo: `src/components/FormFields/FormDropdown.tsx`**

```typescript
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { useTheme } from '../../contexts/ThemeContext'
import { ValidationIcon } from '../Feedback/ValidationIcon'

export interface DropdownItem {
  label: string
  value: string | number
}

interface FormDropdownProps {
  label: string
  value: string | number | null
  onChange: (item: DropdownItem) => void
  onBlur?: () => void
  data: DropdownItem[]
  placeholder?: string
  error?: string
  touched?: boolean
  search?: boolean
  searchPlaceholder?: string
}

export function FormDropdown({
  label,
  value,
  onChange,
  onBlur,
  data,
  placeholder,
  error,
  touched,
  search = true,
  searchPlaceholder = 'Buscar...',
}: FormDropdownProps) {
  const { theme, isDark } = useTheme()

  const hasError = touched && error
  const isValid = touched && !error && value !== null

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.surface,
              borderColor: hasError ? theme.error : theme.border,
            },
          ]}
          containerStyle={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
          itemTextStyle={{ color: theme.text }}
          selectedTextStyle={{ color: theme.text }}
          placeholderStyle={{ color: theme.placeholder }}
          inputSearchStyle={{
            backgroundColor: theme.surface,
            color: theme.text,
            borderColor: theme.border,
          }}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          search={search}
        />
        
        {touched && (
          <View style={styles.iconContainer}>
            <ValidationIcon valid={isValid} />
          </View>
        )}
      </View>

      {hasError && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
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
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
  },
  iconContainer: {
    position: 'absolute',
    right: 40,
    top: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
```

### 3.3 FormDatePicker Component (40 min)

**Archivo: `src/components/FormFields/FormDatePicker.tsx`**

```typescript
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { ValidationIcon } from '../Feedback/ValidationIcon'

interface FormDatePickerProps {
  label: string
  value: Date
  onChange: (date: Date) => void
  onBlur?: () => void
  error?: string
  touched?: boolean
  minimumDate?: Date
  maximumDate?: Date
}

export function FormDatePicker({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  minimumDate,
  maximumDate,
}: FormDatePickerProps) {
  const { theme, isDark } = useTheme()
  const [showPicker, setShowPicker] = useState(false)

  const hasError = touched && error
  const isValid = touched && !error

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    if (selectedDate) {
      onChange(selectedDate)
    }
    if (onBlur) onBlur()
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: theme.surface,
            borderColor: hasError ? theme.error : theme.border,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDate(value)}
        </Text>
        
        <Text style={styles.calendarIcon}>📅</Text>
        
        {touched && (
          <View style={styles.iconContainer}>
            <ValidationIcon valid={isValid} />
          </View>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="es-BO"
        />
      )}

      {hasError && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
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
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  iconContainer: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
```

### 3.4 ValidationIcon Component (15 min)

**Archivo: `src/components/Feedback/ValidationIcon.tsx`**

```typescript
import { Text } from 'react-native'

interface ValidationIconProps {
  valid: boolean
}

export function ValidationIcon({ valid }: ValidationIconProps) {
  return (
    <Text style={{ fontSize: 20 }}>
      {valid ? '✅' : '❌'}
    </Text>
  )
}
```

### 3.5 Export Index (5 min)

**Archivo: `src/components/FormFields/index.ts`**

```typescript
export { FormInput } from './FormInput'
export { FormDropdown } from './FormDropdown'
export type { DropdownItem } from './FormDropdown'
export { FormDatePicker } from './FormDatePicker'
```

**Archivo: `src/components/Feedback/index.ts`**

```typescript
export { ValidationIcon } from './ValidationIcon'
```

### Resultado FASE 3

```
✅ FormInput - Text input con validación
✅ FormDropdown - Dropdown con búsqueda
✅ FormDatePicker - Date picker nativo
✅ ValidationIcon - Feedback visual (✅/❌)
✅ Todos los componentes con dark mode
✅ Todos los componentes touch-friendly (≥48px)

🎉 FASE 3 COMPLETADA - 4 componentes base listos
```

---

*(Continúa en el siguiente mensaje debido al límite de caracteres...)*
