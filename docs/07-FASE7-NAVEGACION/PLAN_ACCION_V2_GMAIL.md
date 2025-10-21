# 🚀 FASE 7: NAVEGACIÓN ESTILO GMAIL - PLAN DE ACCIÓN V2

**Fecha**: 2025-10-20
**Status**: 📋 PLANEADO - Listo para implementar
**Tiempo estimado**: 17-21.5 horas (3-4 días)
**Prioridad**: 🔴 ALTA
**Versión**: 2.0 (Basado en UX estilo Gmail)

---

## 🎯 Visión del Proyecto

Migrar la app de navegación simple (useState) a **Expo Router con Drawer Navigation**, siguiendo el patrón de diseño de **Gmail**:

- **Lista principal** de órdenes (Home)
- **Header personalizado** (☰ | Buscador | Logo)
- **FAB flotante** para nueva orden
- **Drawer lateral** para navegación secundaria
- **Pantalla de detalles** con botones de acción

---

## 📱 Wireframes y Diseño

### 1. Pantalla Principal (Lista de Órdenes)

```
┌──────────────────────────────────────────┐
│ ☰  [🔍 Buscar...] [Buscar] 📱 Logo       │ ← Header fijo
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 Orden #001                      │  │
│  │ BANCO NACIONAL DE BOLIVIA          │  │
│  │ 20/10/2025 · 3 extintores          │  │
│  │ Estado: Completada 🟢              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 Orden #002                      │  │
│  │ BANCO SOLIDARIO                    │  │
│  │ 19/10/2025 · 5 extintores          │  │
│  │ Estado: Anulada 🔴                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 Orden #003                      │  │
│  │ ...                                │  │
│  └────────────────────────────────────┘  │
│                                          │
│                                 [+]      │ ← FAB flotante
└──────────────────────────────────────────┘
```

**Componentes**:
- **Header**: `AppHeader.tsx` (☰, Buscador, Logo)
- **Buscador**: `SearchBar.tsx` (Input + Dropdown + Botón)
- **Lista**: FlatList con `OrdenCard.tsx`
- **FAB**: `FAB.tsx` (Floating Action Button)

---

### 2. Pantalla de Detalles de Orden

```
┌──────────────────────────────────────────┐
│ ← Orden #001                    📱 Logo  │ ← Header
├──────────────────────────────────────────┤
│                                          │
│ Cliente: BANCO NACIONAL DE BOLIVIA       │
│ Fecha: 20/10/2025                        │
│ Agencia: Oficina Central                 │
│ Teléfono: 77123456                       │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ Extintores (3):                          │
│ • Extintor 001 - ABC 10 KILOS - BUCL    │
│ • Extintor 002 - BC 5 KILOS - AMEREX    │
│ • Extintor 003 - CO2 2.5 KILOS - BADGER │
│                                          │
│ ─────────────────────────────────────    │
│                                          │
│ Observaciones:                           │
│ Entrega urgente para mañana              │
│                                          │
│ Préstamo: Sí (2 extintores)             │
│                                          │
│ Estado: Completada 🟢                    │
│                                          │
├──────────────────────────────────────────┤
│  [✏️ Editar] [🗑️ Anular] [🖨️ Imprimir]   │ ← Botones acción
└──────────────────────────────────────────┘
```

**Componentes**:
- **Detalles**: `OrdenDetails.tsx`
- **Botones**: `OrdenActions.tsx`

---

### 3. Menú Lateral (Drawer)

```
┌─────────────────────────┐
│ 📱 Orden de Trabajo     │
│ v1.0.0                  │
├─────────────────────────┤
│ 📋 Mis Órdenes          │ ← Home (index.tsx)
│ ℹ️  About               │
│ ⚙️  Configuración       │
│ ─────────────────────   │
│ 🌙 Dark Mode            │ ← Toggle
│    ◉ Automático         │
│    ○ Light              │
│    ○ Dark               │
└─────────────────────────┘
```

**Componente**: `DrawerContent.tsx`

---

### 4. Formulario Nueva Orden (2 Pasos)

```
Tap [+] FAB
   ↓
┌──────────────────────────────────────────┐
│ ← Nueva Orden - Paso 1/2        📱 Logo  │
├──────────────────────────────────────────┤
│                                          │
│ Cliente: [Dropdown ▼]                    │
│ Fecha: [20/10/2025 📅]                   │
│ Agencia: [Dropdown ▼]                    │
│ Teléfono: [_____________]                │
│ Observaciones: [___________]             │
│ Préstamo: ☐ Sí  Cantidad: [__]          │
│                                          │
│              [Continuar →]               │
└──────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────┐
│ ← Nueva Orden - Paso 2/2        📱 Logo  │
├──────────────────────────────────────────┤
│                                          │
│ Extintores:                              │
│                                          │
│ ▼ Extintor 001                           │
│   Capacidad: [10 KILOS ▼]                │
│   Marca: [BUCL ▼]                        │
│   Tipo: [ABC ▼]                          │
│                                          │
│ [+ Agregar Extintor]                     │
│                                          │
│  [← Atrás]           [✅ Crear Orden]    │
└──────────────────────────────────────────┘
   ↓
Alert "Orden creada" → Volver a Lista
```

**Componentes**:
- **Paso 1**: `HeaderFinalForm.tsx` (Header + Final combinados)
- **Paso 2**: `DetallesForm.tsx` (ya existe, actualizar)

---

## 🏗️ Arquitectura de Navegación

### Estructura de Carpetas

```
app/
├── _layout.tsx                    # 🆕 Drawer Navigation
├── index.tsx                      # 🆕 Lista de Órdenes (Home)
│
├── orden/
│   └── [id].tsx                   # 🆕 Detalles de Orden
│
├── nueva-orden/
│   ├── _layout.tsx                # 🆕 Stack Navigation
│   ├── paso1.tsx                  # 🆕 Header + Final
│   └── paso2.tsx                  # 🆕 Detalles Extintores
│
├── about.tsx                      # 🆕 About (Drawer)
└── configuracion.tsx              # 🆕 Config (Drawer)

src/
├── components/
│   ├── Navigation/
│   │   ├── AppHeader.tsx          # 🆕 Header personalizado
│   │   ├── FAB.tsx                # 🆕 Floating Action Button
│   │   ├── DrawerContent.tsx      # 🆕 Contenido drawer
│   │   └── index.ts
│   │
│   ├── OrdenTrabajo/
│   │   ├── OrdenCard.tsx          # 🆕 Card en lista
│   │   ├── OrdenDetails.tsx       # 🆕 Vista de detalles
│   │   ├── OrdenActions.tsx       # 🆕 Botones: Editar, Anular, Imprimir
│   │   ├── SearchBar.tsx          # 🆕 Buscador + filtros
│   │   ├── HeaderFinalForm.tsx    # 🆕 Paso 1 combinado
│   │   ├── DetallesForm.tsx       # ✏️ Actualizar (ya existe)
│   │   ├── HeaderForm.tsx         # ⚠️ Mantener (referencia)
│   │   └── FinalForm.tsx          # ⚠️ Mantener (referencia)
│   │
│   └── FormFields/                # ✅ Ya existen
│       ├── FormInput.tsx
│       ├── FormDropdown.tsx
│       ├── FormDatePicker.tsx
│       └── index.ts
│
├── services/
│   ├── ordenService.ts            # 🆕 CRUD órdenes
│   ├── searchService.ts           # 🆕 Búsqueda
│   ├── migrationService.ts        # 🆕 Migración AsyncStorage
│   ├── storageService.ts          # ✅ Ya existe
│   └── validationService.ts       # ✅ Ya existe
│
├── types/
│   ├── ordenTrabajo.ts            # ✏️ Actualizar (agregar estado)
│   └── navigation.ts              # 🆕 Tipos de navegación
│
├── hooks/                         # ✅ Ya existen
│   ├── useStorage.ts
│   ├── useFormData.ts
│   └── useFieldVisibility.ts
│
└── contexts/
    └── ThemeContext.tsx           # ✅ Ya existe
```

**Leyenda**:
- 🆕 Nuevo archivo
- ✏️ Modificar archivo existente
- ✅ Sin cambios
- ⚠️ Mantener para referencia, no eliminar

---

## 🔄 Flujos de Navegación

### Flujo 1: Ver Orden Existente

```
Lista (index.tsx)
   ↓ (Tap en OrdenCard)
Detalles (/orden/001)
   ↓ (Tap en [✏️ Editar])
Formulario Paso 1 (/nueva-orden/paso1?id=001&mode=edit)
   ↓ (Continuar)
Formulario Paso 2 (/nueva-orden/paso2?id=001&mode=edit)
   ↓ (Actualizar Orden)
Alert "Orden actualizada" → Volver a Detalles (/orden/001)
```

---

### Flujo 2: Crear Nueva Orden

```
Lista (index.tsx)
   ↓ (Tap en FAB [+])
Formulario Paso 1 (/nueva-orden/paso1)
   ↓ (Continuar)
Formulario Paso 2 (/nueva-orden/paso2)
   ↓ (Crear Orden)
Alert "Orden #004 creada" → Volver a Lista (index.tsx)
```

---

### Flujo 3: Buscar Orden

```
Lista (index.tsx)
   ↓ (Escribir en buscador)
   ↓ (Seleccionar filtro: "Cliente" o "Número")
   ↓ (Tap en botón [Buscar])
Lista filtrada (mismo screen, data filtrada)
   ↓ (Limpiar búsqueda - botón X)
Lista completa restaurada
```

---

### Flujo 4: Anular Orden

```
Detalles (/orden/001)
   ↓ (Tap en [🗑️ Anular])
Alert confirmación: "¿Anular orden #001?"
   ↓ (Confirmar)
Estado cambia a "anulada" + Update AsyncStorage
Alert "Orden anulada" → Volver a Lista (index.tsx)
```

---

### Flujo 5: Navegación Drawer

```
Cualquier pantalla
   ↓ (Tap en ☰)
Drawer se abre desde izquierda
   ↓ (Tap en opción)
Navegar a: Mis Órdenes / About / Configuración
```

---

## 📊 Subfases Detalladas

### 📝 Subfase 7.0: Pre-Setup y Validación (1-1.5h)

**⚠️ CRÍTICO: Ejecutar ANTES de empezar implementación**

#### Objetivo
Validar compatibilidad de Expo Router con el proyecto actual y preparar migración de datos.

#### Tareas

**1. Crear rama experimental (5 min)**
```bash
git checkout -b fase7-expo-router-gmail
git push -u origin fase7-expo-router-gmail
```

**2. Backup completo (10 min)**
```bash
# Commit estado actual
git add -A
git commit -m "📸 backup: Pre-FASE7 snapshot - App funcionando sin Expo Router"

# Exportar datos AsyncStorage actuales (documentar keys)
# Keys actuales:
# - orden_trabajo_header
# - orden_trabajo_detalles
# - orden_trabajo_final
```

**3. Instalar dependencias Expo Router (10 min)**
```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

**4. Test de compatibilidad inicial (20 min)**
```bash
# Verificar que app sigue funcionando
npx expo start

# Checkear en Expo Go que no hay crashes
# Verificar TypeScript
npx tsc --noEmit
```

**Si falla**: Ver Plan B (Development Build)

**5. Crear migration script (30 min)**

Crear archivo `src/services/migrationService.ts`:

```typescript
/**
 * Migration Service - AsyncStorage Data Migration
 * Migra datos de FASE 6 (keys individuales) a FASE 7 (CRUD con IDs)
 */
import { storageUtils } from './storageService'
import type { OrdenTrabajoFormData } from '../types/ordenTrabajo'

const OLD_KEYS = {
  HEADER: 'orden_trabajo_header',
  DETALLES: 'orden_trabajo_detalles',
  FINAL: 'orden_trabajo_final',
} as const

const NEW_KEYS = {
  LIST: 'ordenes:list',
  LAST_ID: 'ordenes:lastId',
  DATA: (id: string) => `ordenes:data:${id}`,
  MIGRATION_FLAG: 'ordenes:migrated_v1',
} as const

export const migrationService = {
  /**
   * Verifica si ya se ejecutó la migración
   */
  isMigrated: async (): Promise<boolean> => {
    return await storageUtils.has(NEW_KEYS.MIGRATION_FLAG)
  },

  /**
   * Migra datos de formato antiguo (FASE 6) a formato nuevo (FASE 7)
   */
  migrateToV1: async (): Promise<boolean> => {
    try {
      // Verificar si ya se migró
      if (await migrationService.isMigrated()) {
        console.log('✅ Migración ya ejecutada previamente')
        return true
      }

      console.log('🔄 Iniciando migración de AsyncStorage...')

      // Leer datos antiguos
      const header = await storageUtils.getJSON(OLD_KEYS.HEADER)
      const detalles = await storageUtils.getJSON(OLD_KEYS.DETALLES)
      const final = await storageUtils.getJSON(OLD_KEYS.FINAL)

      // Si NO hay datos antiguos, solo marcar como migrado
      if (!header && !detalles && !final) {
        console.log('ℹ️ No hay datos antiguos para migrar')
        await storageUtils.setJSON(NEW_KEYS.MIGRATION_FLAG, {
          migratedAt: new Date().toISOString(),
          hadOldData: false
        })
        return true
      }

      // Combinar datos en una orden completa
      const ordenCompleta: Partial<OrdenTrabajoFormData> = {
        ...header,
        ...detalles,
        ...final,
        estado: 'completada', // Estado por defecto
        fechaCreacion: new Date(),
      }

      // Generar ID para la orden migrada
      const ordenId = '001'
      const ordenKey = NEW_KEYS.DATA(ordenId)

      // Guardar orden en nuevo formato
      await storageUtils.setJSON(ordenKey, ordenCompleta)

      // Guardar lista de IDs
      await storageUtils.setJSON(NEW_KEYS.LIST, [ordenId])

      // Guardar último ID usado
      await storageUtils.setJSON(NEW_KEYS.LAST_ID, 1)

      // Marcar migración como completada
      await storageUtils.setJSON(NEW_KEYS.MIGRATION_FLAG, {
        migratedAt: new Date().toISOString(),
        hadOldData: true,
        migratedOrdenId: ordenId,
      })

      console.log('✅ Migración completada exitosamente')
      console.log(`📋 Orden migrada con ID: ${ordenId}`)

      return true
    } catch (error) {
      console.error('❌ Error en migración:', error)
      return false
    }
  },

  /**
   * Rollback de migración (para testing)
   */
  rollback: async (): Promise<void> => {
    await storageUtils.remove(NEW_KEYS.MIGRATION_FLAG)
    await storageUtils.remove(NEW_KEYS.LIST)
    await storageUtils.remove(NEW_KEYS.LAST_ID)
    const keys = await storageUtils.getAllKeys()
    for (const key of keys) {
      if (key.startsWith('ordenes:data:')) {
        await storageUtils.remove(key)
      }
    }
    console.log('🔄 Rollback completado')
  },
}
```

**6. Documentar decisiones (10 min)**

Ya documentado en este archivo.

#### Resultado
- ✅ Expo Router instalado y verificado
- ✅ Migration script creado
- ✅ Backup completo realizado
- ✅ TypeScript sin errores

---

### 📝 Subfase 7.1: Setup Drawer Navigation (2.5-3h)

#### Objetivo
Configurar Expo Router con Drawer Navigation y header personalizado.

#### Tareas

**1. Configurar package.json (5 min)**

Actualizar `package.json`:
```json
{
  "main": "expo-router/entry"
}
```

**2. Configurar app.json (10 min)**

Actualizar `app.json`:
```json
{
  "expo": {
    "scheme": "ordenestrabajo",
    "plugins": [
      "expo-router",
      [
        "react-native-reanimated/plugin",
        {
          "relativeSourceLocation": true
        }
      ]
    ]
  }
}
```

**3. Crear app/_layout.tsx con Drawer (60 min)**

```typescript
import { Drawer } from 'expo-router/drawer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import { migrationService } from '../src/services/migrationService'
import { View, Text, ActivityIndicator } from 'react-native'

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Migrando datos...</Text>
    </View>
  )
}

export default function RootLayout() {
  const [isMigrating, setIsMigrating] = useState(true)

  useEffect(() => {
    async function runMigration() {
      await migrationService.migrateToV1()
      setIsMigrating(false)
    }
    runMigration()
  }, [])

  if (isMigrating) {
    return <LoadingScreen />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Drawer screenOptions={{ headerShown: false }}>
            <Drawer.Screen
              name="index"
              options={{
                title: 'Mis Órdenes',
                drawerLabel: '📋 Mis Órdenes'
              }}
            />
            <Drawer.Screen
              name="about"
              options={{
                title: 'About',
                drawerLabel: 'ℹ️ About'
              }}
            />
            <Drawer.Screen
              name="configuracion"
              options={{
                title: 'Configuración',
                drawerLabel: '⚙️ Configuración'
              }}
            />
            <Drawer.Screen
              name="orden/[id]"
              options={{
                drawerItemStyle: { display: 'none' }
              }}
            />
            <Drawer.Screen
              name="nueva-orden"
              options={{
                drawerItemStyle: { display: 'none' }
              }}
            />
          </Drawer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
```

**4. Crear AppHeader.tsx (40 min)**

```typescript
// src/components/Navigation/AppHeader.tsx
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'

interface AppHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchPress: () => void
  isDark: boolean
}

export function AppHeader({ searchValue, onSearchChange, onSearchPress, isDark }: AppHeaderProps) {
  const navigation = useNavigation()

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      {/* Menú Hamburguesa */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Text style={{ fontSize: 24, color: isDark ? '#fff' : '#000' }}>☰</Text>
      </TouchableOpacity>

      {/* Buscador */}
      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder="Buscar..."
        placeholderTextColor={isDark ? '#888' : '#666'}
        style={[styles.searchInput, {
          backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
          color: isDark ? '#fff' : '#000'
        }]}
      />

      {/* Botón Buscar */}
      <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
        <Text style={{ color: '#007AFF', fontWeight: '600' }}>Buscar</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={{ fontSize: 20 }}>📱</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  logoContainer: {
    marginLeft: 8,
    padding: 4,
  },
})
```

**5. Crear FAB.tsx (20 min)**

```typescript
// src/components/Navigation/FAB.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface FABProps {
  onPress: () => void
  isDark: boolean
}

export function FAB({ onPress, isDark }: FABProps) {
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: '#007AFF' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
})
```

**6. Crear index.ts de Navigation (5 min)**

```typescript
// src/components/Navigation/index.ts
export { AppHeader } from './AppHeader'
export { FAB } from './FAB'
```

**7. Testing básico (20 min)**
- [ ] Drawer abre/cierra con ☰
- [ ] Header se muestra correctamente
- [ ] FAB es visible
- [ ] TypeScript sin errores
- [ ] App compila

#### Resultado
✅ Drawer Navigation funcionando con header personalizado

---

### 📝 Subfase 7.2: Lista de Órdenes + CRUD (4-5h)

#### Objetivo
Implementar lista de órdenes con búsqueda y operaciones CRUD.

#### Tareas

**1. Actualizar types/ordenTrabajo.ts (15 min)**

Agregar campos nuevos:

```typescript
// src/types/ordenTrabajo.ts

export type EstadoOrden = 'completada' | 'anulada'

export interface OrdenTrabajoFormData {
  // Campos existentes...
  cliente: string
  fechaEntrega: Date
  agencia?: string
  direccion?: string
  telefono: string
  observaciones?: string
  prestamoExtintores: boolean
  cantidadPrestamo?: string
  detalles: DetalleExtintor[]

  // 🆕 Nuevos campos
  id?: string                    // ID de la orden (ej: "001", "002")
  estado: EstadoOrden            // Estado: completada | anulada
  fechaCreacion: Date            // Timestamp de creación
  fechaModificacion?: Date       // Última modificación
}
```

**2. Crear ordenService.ts (90 min)**

```typescript
// src/services/ordenService.ts
import { storageUtils } from './storageService'
import type { OrdenTrabajoFormData, EstadoOrden } from '../types/ordenTrabajo'

const KEYS = {
  LIST: 'ordenes:list',
  LAST_ID: 'ordenes:lastId',
  DATA: (id: string) => `ordenes:data:${id}`,
} as const

/**
 * Genera el siguiente ID de orden
 */
async function getNextId(): Promise<string> {
  const lastId = await storageUtils.getJSON<number>(KEYS.LAST_ID, 0)
  const nextId = lastId + 1
  await storageUtils.setJSON(KEYS.LAST_ID, nextId)
  return String(nextId).padStart(3, '0') // "001", "002", etc.
}

export const ordenService = {
  /**
   * Obtiene todas las órdenes
   */
  getOrdenes: async (): Promise<OrdenTrabajoFormData[]> => {
    const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, [])
    const ordenes: OrdenTrabajoFormData[] = []

    for (const id of ids) {
      const orden = await storageUtils.getJSON<OrdenTrabajoFormData>(KEYS.DATA(id))
      if (orden) {
        ordenes.push({ ...orden, id })
      }
    }

    // Ordenar por fecha de creación (más reciente primero)
    return ordenes.sort((a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    )
  },

  /**
   * Obtiene una orden por ID
   */
  getOrdenById: async (id: string): Promise<OrdenTrabajoFormData | null> => {
    const orden = await storageUtils.getJSON<OrdenTrabajoFormData>(KEYS.DATA(id))
    return orden ? { ...orden, id } : null
  },

  /**
   * Crea una nueva orden
   */
  createOrden: async (data: Omit<OrdenTrabajoFormData, 'id'>): Promise<string> => {
    const id = await getNextId()
    const orden: OrdenTrabajoFormData = {
      ...data,
      id,
      estado: data.estado || 'completada',
      fechaCreacion: new Date(),
    }

    // Guardar orden
    await storageUtils.setJSON(KEYS.DATA(id), orden)

    // Actualizar lista de IDs
    const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, [])
    await storageUtils.setJSON(KEYS.LIST, [...ids, id])

    return id
  },

  /**
   * Actualiza una orden existente
   */
  updateOrden: async (id: string, data: Partial<OrdenTrabajoFormData>): Promise<void> => {
    const orden = await ordenService.getOrdenById(id)
    if (!orden) {
      throw new Error(`Orden ${id} no encontrada`)
    }

    const updatedOrden: OrdenTrabajoFormData = {
      ...orden,
      ...data,
      id,
      fechaModificacion: new Date(),
    }

    await storageUtils.setJSON(KEYS.DATA(id), updatedOrden)
  },

  /**
   * Elimina una orden (soft delete - cambia a anulada)
   */
  deleteOrden: async (id: string): Promise<void> => {
    await ordenService.updateOrden(id, {
      estado: 'anulada',
      fechaModificacion: new Date()
    })
  },

  /**
   * Anula una orden
   */
  anularOrden: async (id: string): Promise<void> => {
    await ordenService.deleteOrden(id)
  },

  /**
   * Completa una orden
   */
  completarOrden: async (id: string): Promise<void> => {
    await ordenService.updateOrden(id, {
      estado: 'completada',
      fechaModificacion: new Date()
    })
  },

  /**
   * Busca órdenes por cliente
   */
  searchByCliente: async (cliente: string): Promise<OrdenTrabajoFormData[]> => {
    const ordenes = await ordenService.getOrdenes()
    const searchTerm = cliente.toLowerCase().trim()

    return ordenes.filter(orden =>
      orden.cliente.toLowerCase().includes(searchTerm)
    )
  },

  /**
   * Busca órdenes por número
   */
  searchByNumero: async (numero: string): Promise<OrdenTrabajoFormData[]> => {
    const ordenes = await ordenService.getOrdenes()
    const searchTerm = numero.trim()

    return ordenes.filter(orden =>
      orden.id?.includes(searchTerm)
    )
  },

  /**
   * Filtra órdenes por estado
   */
  filterByEstado: async (estado: EstadoOrden): Promise<OrdenTrabajoFormData[]> => {
    const ordenes = await ordenService.getOrdenes()
    return ordenes.filter(orden => orden.estado === estado)
  },
}
```

**3. Crear OrdenCard.tsx (40 min)**

```typescript
// src/components/OrdenTrabajo/OrdenCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'

interface OrdenCardProps {
  orden: OrdenTrabajoFormData
  onPress: () => void
  isDark: boolean
}

export function OrdenCard({ orden, onPress, isDark }: OrdenCardProps) {
  const estadoColor = orden.estado === 'completada' ? '#4CAF50' : '#F44336'
  const estadoEmoji = orden.estado === 'completada' ? '🟢' : '🔴'

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <TouchableOpacity
      style={[styles.card, {
        backgroundColor: isDark ? '#2a2a2a' : '#fff',
        borderColor: isDark ? '#444' : '#e0e0e0'
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.ordenNumero, { color: isDark ? '#fff' : '#000' }]}>
          📋 Orden #{orden.id}
        </Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          {estadoEmoji} {orden.estado}
        </Text>
      </View>

      {/* Cliente */}
      <Text style={[styles.cliente, { color: isDark ? '#ddd' : '#333' }]}>
        {orden.cliente}
      </Text>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.infoText, { color: isDark ? '#999' : '#666' }]}>
          {formatDate(orden.fechaEntrega)} · {orden.detalles.length} extintor{orden.detalles.length !== 1 ? 'es' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ordenNumero: {
    fontSize: 16,
    fontWeight: '600',
  },
  estado: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cliente: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  info: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
  },
})
```

**4. Crear SearchBar.tsx (40 min)**

```typescript
// src/components/OrdenTrabajo/SearchBar.tsx
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'

interface SearchBarProps {
  onSearch: (query: string, filter: 'cliente' | 'numero') => void
  isDark: boolean
}

const FILTER_OPTIONS = [
  { label: 'Cliente', value: 'cliente' },
  { label: 'Número de Orden', value: 'numero' },
]

export function SearchBar({ onSearch, isDark }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'cliente' | 'numero'>('cliente')

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filter)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      {/* Dropdown de filtro */}
      <Dropdown
        data={FILTER_OPTIONS}
        labelField="label"
        valueField="value"
        value={filter}
        onChange={item => setFilter(item.value as 'cliente' | 'numero')}
        style={[styles.dropdown, {
          backgroundColor: isDark ? '#2a2a2a' : '#fff',
          borderColor: isDark ? '#444' : '#ddd'
        }]}
        selectedTextStyle={{ color: isDark ? '#fff' : '#000', fontSize: 12 }}
        placeholderStyle={{ color: isDark ? '#888' : '#666' }}
        containerStyle={{ backgroundColor: isDark ? '#2a2a2a' : '#fff' }}
        itemTextStyle={{ color: isDark ? '#fff' : '#000' }}
      />

      {/* Input de búsqueda */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={`Buscar por ${filter === 'cliente' ? 'cliente' : 'número'}...`}
        placeholderTextColor={isDark ? '#888' : '#666'}
        style={[styles.input, {
          backgroundColor: isDark ? '#2a2a2a' : '#fff',
          color: isDark ? '#fff' : '#000',
          borderColor: isDark ? '#444' : '#ddd'
        }]}
        onSubmitEditing={handleSearch}
      />

      {/* Botón Buscar */}
      <TouchableOpacity
        onPress={handleSearch}
        style={[styles.button, { opacity: query.trim() ? 1 : 0.5 }]}
        disabled={!query.trim()}
      >
        <Text style={styles.buttonText}>🔍</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dropdown: {
    width: 100,
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
  },
})
```

**5. Crear app/index.tsx (90 min)**

```typescript
// app/index.tsx
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../src/contexts/ThemeContext'
import { AppHeader, FAB } from '../src/components/Navigation'
import { OrdenCard } from '../src/components/OrdenTrabajo/OrdenCard'
import { SearchBar } from '../src/components/OrdenTrabajo/SearchBar'
import { ordenService } from '../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../src/types/ordenTrabajo'

export default function OrdenesListScreen() {
  const router = useRouter()
  const { theme, isDark } = useTheme()

  const [ordenes, setOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Cargar órdenes
  const loadOrdenes = useCallback(async () => {
    const data = await ordenService.getOrdenes()
    setOrdenes(data)
    setFilteredOrdenes(data)
  }, [])

  useEffect(() => {
    loadOrdenes()
  }, [loadOrdenes])

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadOrdenes()
    setIsRefreshing(false)
    setIsSearching(false)
  }

  // Búsqueda
  const handleSearch = async (query: string, filter: 'cliente' | 'numero') => {
    if (filter === 'cliente') {
      const results = await ordenService.searchByCliente(query)
      setFilteredOrdenes(results)
    } else {
      const results = await ordenService.searchByNumero(query)
      setFilteredOrdenes(results)
    }
    setIsSearching(true)
  }

  // Renderizar card
  const renderOrden = ({ item }: { item: OrdenTrabajoFormData }) => (
    <OrdenCard
      orden={item}
      onPress={() => router.push(`/orden/${item.id}`)}
      isDark={isDark}
    />
  )

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
        {isSearching ? '🔍 No se encontraron órdenes' : '📋 No hay órdenes creadas'}
      </Text>
      {!isSearching && (
        <Text style={[styles.emptyHint, { color: isDark ? '#666' : '#999' }]}>
          Toca el botón + para crear una nueva orden
        </Text>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Buscador */}
      <SearchBar onSearch={handleSearch} isDark={isDark} />

      {/* Lista */}
      <FlatList
        data={filteredOrdenes}
        renderItem={renderOrden}
        keyExtractor={item => item.id || ''}
        contentContainerStyle={filteredOrdenes.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />

      {/* FAB */}
      <FAB
        onPress={() => router.push('/nueva-orden/paso1')}
        isDark={isDark}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
})
```

**6. Testing (30 min)**
- [ ] Lista muestra órdenes
- [ ] Pull-to-refresh funciona
- [ ] Búsqueda por cliente funciona
- [ ] Búsqueda por número funciona
- [ ] Empty state se muestra
- [ ] FAB navega a nueva orden

#### Resultado
✅ Lista de órdenes funcional con búsqueda

---

### 📝 Subfase 7.3: Detalles de Orden (2-3h)

#### Objetivo
Crear pantalla de detalles con botones de acción.

#### Tareas

**1. Crear OrdenDetails.tsx (60 min)**

```typescript
// src/components/OrdenTrabajo/OrdenDetails.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'

interface OrdenDetailsProps {
  orden: OrdenTrabajoFormData
  isDark: boolean
}

export function OrdenDetails({ orden, isDark }: OrdenDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const estadoColor = orden.estado === 'completada' ? '#4CAF50' : '#F44336'
  const estadoEmoji = orden.estado === 'completada' ? '🟢' : '🔴'

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Información General
        </Text>

        <DetailRow
          label="Cliente"
          value={orden.cliente}
          isDark={isDark}
        />
        <DetailRow
          label="Fecha de Entrega"
          value={formatDate(orden.fechaEntrega)}
          isDark={isDark}
        />
        {orden.agencia && (
          <DetailRow
            label="Agencia"
            value={orden.agencia}
            isDark={isDark}
          />
        )}
        {orden.direccion && (
          <DetailRow
            label="Dirección"
            value={orden.direccion}
            isDark={isDark}
          />
        )}
        <DetailRow
          label="Teléfono"
          value={orden.telefono}
          isDark={isDark}
        />
      </View>

      {/* Extintores */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Extintores ({orden.detalles.length})
        </Text>

        {orden.detalles.map((detalle, index) => (
          <View
            key={detalle.id}
            style={[styles.extintorCard, {
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              borderColor: isDark ? '#444' : '#e0e0e0'
            }]}
          >
            <Text style={[styles.extintorTitle, { color: isDark ? '#fff' : '#000' }]}>
              • Extintor {String(index + 1).padStart(3, '0')}
            </Text>
            <Text style={[styles.extintorInfo, { color: isDark ? '#ddd' : '#666' }]}>
              {detalle.tipo} - {detalle.capacidadValor} - {detalle.marca}
            </Text>
          </View>
        ))}
      </View>

      {/* Observaciones */}
      {orden.observaciones && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Observaciones
          </Text>
          <Text style={[styles.observaciones, { color: isDark ? '#ddd' : '#333' }]}>
            {orden.observaciones}
          </Text>
        </View>
      )}

      {/* Préstamo */}
      {orden.prestamoExtintores && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Préstamo
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? '#ddd' : '#333' }]}>
            Sí ({orden.cantidadPrestamo || '0'} extintor{orden.cantidadPrestamo !== '1' ? 'es' : ''})
          </Text>
        </View>
      )}

      {/* Estado */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Estado
        </Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          {estadoEmoji} {orden.estado}
        </Text>
      </View>
    </ScrollView>
  )
}

function DetailRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: isDark ? '#999' : '#666' }]}>
        {label}:
      </Text>
      <Text style={[styles.detailValue, { color: isDark ? '#fff' : '#000' }]}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  extintorCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  extintorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  extintorInfo: {
    fontSize: 13,
  },
  observaciones: {
    fontSize: 14,
    lineHeight: 20,
  },
  estado: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
})
```

**2. Crear OrdenActions.tsx (40 min)**

```typescript
// src/components/OrdenTrabajo/OrdenActions.tsx
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'

interface OrdenActionsProps {
  ordenId: string
  estado: 'completada' | 'anulada'
  onEdit: () => void
  onAnular: () => void
  onImprimir: () => void
  isDark: boolean
}

export function OrdenActions({
  ordenId,
  estado,
  onEdit,
  onAnular,
  onImprimir,
  isDark
}: OrdenActionsProps) {
  return (
    <View style={[styles.container, {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderTopColor: isDark ? '#444' : '#e0e0e0'
    }]}>
      {/* Editar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007AFF' }]}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>✏️ Editar</Text>
      </TouchableOpacity>

      {/* Anular */}
      <TouchableOpacity
        style={[styles.button, {
          backgroundColor: estado === 'anulada' ? '#999' : '#F44336'
        }]}
        onPress={onAnular}
        activeOpacity={0.8}
        disabled={estado === 'anulada'}
      >
        <Text style={styles.buttonText}>
          {estado === 'anulada' ? '✓ Anulada' : '🗑️ Anular'}
        </Text>
      </TouchableOpacity>

      {/* Imprimir */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={onImprimir}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>🖨️ Imprimir</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
```

**3. Crear app/orden/[id].tsx (60 min)**

```typescript
// app/orden/[id].tsx
import { View, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { OrdenDetails } from '../../src/components/OrdenTrabajo/OrdenDetails'
import { OrdenActions } from '../../src/components/OrdenTrabajo/OrdenActions'
import { ordenService } from '../../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

export default function OrdenDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { theme, isDark } = useTheme()

  const [orden, setOrden] = useState<OrdenTrabajoFormData | null>(null)

  useEffect(() => {
    loadOrden()
  }, [id])

  const loadOrden = async () => {
    if (id) {
      const data = await ordenService.getOrdenById(id)
      setOrden(data)
    }
  }

  const handleEdit = () => {
    router.push(`/nueva-orden/paso1?id=${id}&mode=edit`)
  }

  const handleAnular = () => {
    Alert.alert(
      'Anular Orden',
      `¿Estás seguro de anular la orden #${id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Anular',
          style: 'destructive',
          onPress: async () => {
            await ordenService.anularOrden(id!)
            Alert.alert('✓', 'Orden anulada exitosamente')
            router.back()
          },
        },
      ]
    )
  }

  const handleImprimir = () => {
    Alert.alert('Próximamente', 'La función de impresión estará disponible pronto')
  }

  if (!orden) {
    return null // O loading spinner
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <OrdenDetails orden={orden} isDark={isDark} />

      <OrdenActions
        ordenId={id!}
        estado={orden.estado}
        onEdit={handleEdit}
        onAnular={handleAnular}
        onImprimir={handleImprimir}
        isDark={isDark}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
```

**4. Testing (30 min)**
- [ ] Detalles se muestran correctamente
- [ ] Botón Editar navega a formulario
- [ ] Botón Anular muestra confirmación
- [ ] Botón Imprimir muestra toast
- [ ] Estado se actualiza al anular

#### Resultado
✅ Pantalla de detalles funcional con botones de acción

---

### 📝 Subfase 7.4: Formulario 2 Pasos (3-4h)

#### Objetivo
Crear formulario de 2 pasos para crear/editar órdenes.

#### Tareas

**1. Crear HeaderFinalForm.tsx (90 min)**

Combina HeaderForm + FinalForm en un solo componente.

```typescript
// src/components/OrdenTrabajo/HeaderFinalForm.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { FormInput, FormDropdown, FormDatePicker } from '../FormFields'
import { CLIENTES } from '../../constants/ordenTrabajoConstants'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'

interface HeaderFinalFormProps {
  data: Partial<OrdenTrabajoFormData>
  errors: Record<string, string>
  touched: Record<string, boolean>
  onDataChange: (field: keyof OrdenTrabajoFormData, value: any) => void
  onContinue: () => void
  isDark: boolean
}

export function HeaderFinalForm({
  data,
  errors,
  touched,
  onDataChange,
  onContinue,
  isDark
}: HeaderFinalFormProps) {
  const [showPrestamoInput, setShowPrestamoInput] = useState(data.prestamoExtintores || false)

  const isBancoSolidario = data.cliente === 'BANCO SOLIDARIO'

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      contentContainerStyle={styles.content}
    >
      {/* Sección 1: Cliente y Ubicación */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Cliente y Ubicación
        </Text>

        <FormDropdown
          label="Cliente"
          value={data.cliente || ''}
          onValueChange={(value) => onDataChange('cliente', value)}
          data={CLIENTES.map(c => ({ label: c, value: c }))}
          error={errors.cliente}
          touched={touched.cliente}
          isDark={isDark}
        />

        <FormDatePicker
          label="Fecha de Entrega"
          value={data.fechaEntrega || new Date()}
          onValueChange={(value) => onDataChange('fechaEntrega', value)}
          error={errors.fechaEntrega}
          touched={touched.fechaEntrega}
          isDark={isDark}
        />

        {isBancoSolidario ? (
          <FormDropdown
            label="Agencia"
            value={data.agencia || ''}
            onValueChange={(value) => onDataChange('agencia', value)}
            data={AGENCIAS.map(a => ({ label: a, value: a }))}
            error={errors.agencia}
            touched={touched.agencia}
            isDark={isDark}
          />
        ) : (
          <FormInput
            label="Dirección"
            value={data.direccion || ''}
            onValueChange={(value) => onDataChange('direccion', value)}
            placeholder="Ej: Av. 6 de Agosto #123"
            error={errors.direccion}
            touched={touched.direccion}
            isDark={isDark}
          />
        )}
      </View>

      {/* Sección 2: Contacto y Observaciones */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Contacto y Observaciones
        </Text>

        <FormInput
          label="Teléfono"
          value={data.telefono || ''}
          onValueChange={(value) => onDataChange('telefono', value)}
          placeholder="Ej: 77123456"
          keyboardType="phone-pad"
          error={errors.telefono}
          touched={touched.telefono}
          isDark={isDark}
        />

        <FormInput
          label="Observaciones (opcional)"
          value={data.observaciones || ''}
          onValueChange={(value) => onDataChange('observaciones', value)}
          placeholder="Información adicional..."
          multiline
          numberOfLines={4}
          maxLength={500}
          error={errors.observaciones}
          touched={touched.observaciones}
          isDark={isDark}
        />
      </View>

      {/* Sección 3: Préstamo */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Préstamo de Extintores
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => {
            const newValue = !showPrestamoInput
            setShowPrestamoInput(newValue)
            onDataChange('prestamoExtintores', newValue)
            if (!newValue) {
              onDataChange('cantidadPrestamo', '')
            }
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, showPrestamoInput && styles.checkboxChecked]}>
            {showPrestamoInput && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.checkboxLabel, { color: isDark ? '#fff' : '#000' }]}>
            Préstamo de extintores
          </Text>
        </TouchableOpacity>

        {showPrestamoInput && (
          <FormInput
            label="Cantidad de extintores"
            value={data.cantidadPrestamo || ''}
            onValueChange={(value) => onDataChange('cantidadPrestamo', value)}
            placeholder="Ej: 2"
            keyboardType="numeric"
            error={errors.cantidadPrestamo}
            touched={touched.cantidadPrestamo}
            isDark={isDark}
          />
        )}
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={onContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Continuar →</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

// Constantes de agencias (reutilizar de ordenTrabajoConstants si existe)
const AGENCIAS = [
  'OFICINA CENTRAL',
  'SUCURSAL NORTE',
  'SUCURSAL SUR',
  // ... agregar todas las agencias
]
```

**2. Crear HeaderFinalSchema (20 min)**

```typescript
// src/services/validationService.ts

// Agregar al archivo existente:

export const HeaderFinalSchema = z.object({
  cliente: z.string().min(1, 'Cliente es requerido'),
  fechaEntrega: z.date(),
  agencia: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string()
    .min(7, 'Teléfono debe tener al menos 7 dígitos')
    .max(15, 'Teléfono debe tener máximo 15 dígitos'),
  observaciones: z.string().max(500, 'Máximo 500 caracteres').optional(),
  prestamoExtintores: z.boolean(),
  cantidadPrestamo: z.string().optional(),
}).refine(
  (data) => {
    // Si es Banco Solidario, agencia es requerida
    if (data.cliente === 'BANCO SOLIDARIO') {
      return !!data.agencia
    }
    // Si no es Banco Solidario, dirección es requerida
    return !!data.direccion
  },
  {
    message: 'Agencia o Dirección es requerida según el cliente',
    path: ['agencia'],
  }
).refine(
  (data) => {
    // Si hay préstamo, cantidad es requerida
    if (data.prestamoExtintores) {
      return !!data.cantidadPrestamo && parseInt(data.cantidadPrestamo) > 0
    }
    return true
  },
  {
    message: 'Cantidad de préstamo es requerida',
    path: ['cantidadPrestamo'],
  }
)
```

**3. Actualizar DetallesForm.tsx (30 min)**

Agregar props de navegación:

```typescript
// src/components/OrdenTrabajo/DetallesForm.tsx

// Agregar a la interfaz:
interface DetallesFormProps {
  // ... props existentes
  onBack?: () => void          // 🆕
  onSubmit?: () => void        // 🆕
  submitText?: string          // 🆕 "Crear Orden" o "Actualizar Orden"
}

// Agregar botones al final del componente:
<View style={styles.buttonRow}>
  {onBack && (
    <TouchableOpacity
      style={[styles.button, styles.buttonSecondary]}
      onPress={onBack}
    >
      <Text style={styles.buttonSecondaryText}>← Atrás</Text>
    </TouchableOpacity>
  )}

  {onSubmit && (
    <TouchableOpacity
      style={[styles.button, styles.buttonPrimary]}
      onPress={onSubmit}
    >
      <Text style={styles.buttonPrimaryText}>
        {submitText || '✅ Crear Orden'}
      </Text>
    </TouchableOpacity>
  )}
</View>
```

**4. Crear app/nueva-orden/_layout.tsx (10 min)**

```typescript
// app/nueva-orden/_layout.tsx
import { Stack } from 'expo-router'

export default function NuevaOrdenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="paso1" />
      <Stack.Screen name="paso2" />
    </Stack>
  )
}
```

**5. Crear app/nueva-orden/paso1.tsx (40 min)**

```typescript
// app/nueva-orden/paso1.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { HeaderFinalForm } from '../../src/components/OrdenTrabajo/HeaderFinalForm'
import { useFormData } from '../../src/hooks/useFormData'
import { HeaderFinalSchema } from '../../src/services/validationService'
import { ordenService } from '../../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

const initialData: Partial<OrdenTrabajoFormData> = {
  cliente: '',
  fechaEntrega: new Date(),
  telefono: '',
  observaciones: '',
  prestamoExtintores: false,
  cantidadPrestamo: '',
}

export default function Paso1Screen() {
  const router = useRouter()
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>()
  const { theme, isDark } = useTheme()

  const { data, errors, touched, updateField, validate, setData } = useFormData(
    'orden_trabajo_draft',
    initialData,
    HeaderFinalSchema,
    { autoSave: true, debounceMs: 500 }
  )

  // Cargar datos si es modo edición
  useEffect(() => {
    async function loadOrden() {
      if (id && mode === 'edit') {
        const orden = await ordenService.getOrdenById(id)
        if (orden) {
          setData(orden)
        }
      }
    }
    loadOrden()
  }, [id, mode])

  const handleContinue = () => {
    if (validate()) {
      router.push(`/nueva-orden/paso2${id ? `?id=${id}&mode=${mode}` : ''}`)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HeaderFinalForm
        data={data}
        errors={errors}
        touched={touched}
        onDataChange={updateField}
        onContinue={handleContinue}
        isDark={isDark}
      />
    </SafeAreaView>
  )
}
```

**6. Crear app/nueva-orden/paso2.tsx (40 min)**

```typescript
// app/nueva-orden/paso2.tsx
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { DetallesForm } from '../../src/components/OrdenTrabajo/DetallesForm'
import { useFormData } from '../../src/hooks/useFormData'
import { DetallesSchema } from '../../src/services/validationService'
import { ordenService } from '../../src/services/ordenService'
import { storageUtils } from '../../src/services/storageService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

export default function Paso2Screen() {
  const router = useRouter()
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>()
  const { theme, isDark } = useTheme()

  const { data, errors, touched, updateField, validate, setData } = useFormData(
    'orden_trabajo_draft',
    { detalles: [] },
    DetallesSchema,
    { autoSave: true }
  )

  // Cargar datos del draft
  useEffect(() => {
    async function loadDraft() {
      const draft = await storageUtils.getJSON<OrdenTrabajoFormData>('orden_trabajo_draft')
      if (draft) {
        setData(draft)
      }
    }
    loadDraft()
  }, [])

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    try {
      const draft = await storageUtils.getJSON<OrdenTrabajoFormData>('orden_trabajo_draft')

      if (id && mode === 'edit') {
        // Actualizar orden existente
        await ordenService.updateOrden(id, draft!)
        await storageUtils.remove('orden_trabajo_draft')
        Alert.alert('✓', 'Orden actualizada exitosamente', [
          { text: 'OK', onPress: () => router.push(`/orden/${id}`) }
        ])
      } else {
        // Crear nueva orden
        const newId = await ordenService.createOrden({
          ...draft!,
          estado: 'completada',
          fechaCreacion: new Date(),
        })
        await storageUtils.remove('orden_trabajo_draft')
        Alert.alert('✓', `Orden #${newId} creada exitosamente`, [
          { text: 'OK', onPress: () => router.push('/') }
        ])
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la orden')
      console.error(error)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <DetallesForm
        data={data}
        errors={errors}
        touched={touched}
        onDataChange={updateField}
        onBack={handleBack}
        onSubmit={handleSubmit}
        submitText={mode === 'edit' ? '✅ Actualizar Orden' : '✅ Crear Orden'}
        isDark={isDark}
      />
    </SafeAreaView>
  )
}
```

**7. Testing (30 min)**
- [ ] Paso 1 → Paso 2 funciona
- [ ] Validación funciona en paso 1
- [ ] Crear orden funciona
- [ ] Editar orden funciona
- [ ] Data persiste entre pasos
- [ ] Back button funciona

#### Resultado
✅ Formulario de 2 pasos funcional para crear/editar órdenes

---

### 📝 Subfase 7.5: About + Configuración (1.5-2h)

#### Objetivo
Crear pantallas de About y Configuración con Dark Mode toggle.

#### Tareas

**1. Crear app/about.tsx (30 min)**

```typescript
// app/about.tsx
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../src/contexts/ThemeContext'

export default function AboutScreen() {
  const { theme, isDark } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>📱</Text>
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Orden de Trabajo Mobile
        </Text>

        {/* Versión */}
        <Text style={[styles.version, { color: isDark ? '#999' : '#666' }]}>
          Versión 1.0.0
        </Text>

        {/* Desarrollador */}
        <View style={styles.infoSection}>
          <Text style={[styles.label, { color: isDark ? '#999' : '#666' }]}>
            Desarrollado por:
          </Text>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>
            Willy Salas Quiroga
          </Text>
        </View>

        {/* Copyright */}
        <Text style={[styles.copyright, { color: isDark ? '#666' : '#999' }]}>
          © 2025
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    marginBottom: 32,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyright: {
    fontSize: 12,
    position: 'absolute',
    bottom: 32,
  },
})
```

**2. Crear app/configuracion.tsx (60 min)**

```typescript
// app/configuracion.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useTheme } from '../src/contexts/ThemeContext'
import { FormInput } from '../src/components/FormFields/FormInput'
import { storageUtils } from '../src/services/storageService'

type ThemePreference = 'auto' | 'light' | 'dark'

export default function ConfiguracionScreen() {
  const { theme, isDark } = useTheme()
  const [themePreference, setThemePreference] = useState<ThemePreference>('auto')
  const [apiToken, setApiToken] = useState('')

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    const savedTheme = await storageUtils.getJSON<ThemePreference>('theme_preference', 'auto')
    setThemePreference(savedTheme)
  }

  const handleThemeChange = async (newTheme: ThemePreference) => {
    setThemePreference(newTheme)
    await storageUtils.setJSON('theme_preference', newTheme)
    // Aquí aplicarías el cambio de tema en ThemeContext
  }

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      '¿Estás seguro de limpiar toda la caché?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            // Aquí implementarías la limpieza de caché
            Alert.alert('✓', 'Caché limpiada exitosamente')
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* API Configuration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            API Configuration
          </Text>
          <Text style={[styles.sectionSubtitle, { color: isDark ? '#999' : '#666' }]}>
            (Próximamente)
          </Text>

          <FormInput
            label="Token de API"
            value={apiToken}
            onValueChange={setApiToken}
            placeholder="Ingrese su token..."
            isDark={isDark}
            editable={false}
          />
        </View>

        {/* Preferencias */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Preferencias
          </Text>

          <Text style={[styles.label, { color: isDark ? '#999' : '#666' }]}>
            Tema
          </Text>

          <View style={styles.themeOptions}>
            <ThemeOption
              label="Automático"
              value="auto"
              selected={themePreference === 'auto'}
              onPress={() => handleThemeChange('auto')}
              isDark={isDark}
            />
            <ThemeOption
              label="Light"
              value="light"
              selected={themePreference === 'light'}
              onPress={() => handleThemeChange('light')}
              isDark={isDark}
            />
            <ThemeOption
              label="Dark"
              value="dark"
              selected={themePreference === 'dark'}
              onPress={() => handleThemeChange('dark')}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Caché */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            Caché
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#F44336' }]}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Limpiar Caché</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

function ThemeOption({
  label,
  value,
  selected,
  onPress,
  isDark
}: {
  label: string
  value: string
  selected: boolean
  onPress: () => void
  isDark: boolean
}) {
  return (
    <TouchableOpacity
      style={styles.themeOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.themeLabel, { color: isDark ? '#fff' : '#000' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  themeLabel: {
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
```

**3. Actualizar ThemeContext para preferencias (20 min)**

```typescript
// src/contexts/ThemeContext.tsx

// Agregar manejo de preferencias de tema:
// - Leer "theme_preference" de AsyncStorage
// - Aplicar según preferencia: auto | light | dark
```

**4. Testing (20 min)**
- [ ] About muestra info correctamente
- [ ] Config muestra opciones
- [ ] Theme toggle funciona
- [ ] Limpiar caché muestra confirmación

#### Resultado
✅ Pantallas de About y Configuración funcionando

---

### 📝 Subfase 7.6: Migración Completa + Testing (2-3h)

#### Objetivo
Finalizar migración y testing exhaustivo.

#### Tareas

**1. Eliminar código de debug de App.tsx (30 min)**

- Remover función `runTests()`
- Remover debug logs
- Remover botones de test
- Mantener solo código necesario para referencia

**2. Confirmar migración AsyncStorage (10 min)**

Ya integrada en `app/_layout.tsx` (Subfase 7.1).

**3. Actualizar package.json (5 min)**

Ya actualizado en Subfase 7.1.

**4. Testing completo (90 min)**

**Checklist de Testing**:

**Navegación**:
- [ ] Drawer abre/cierra con ☰
- [ ] Menú lateral muestra todas las opciones
- [ ] Navegación entre screens funciona
- [ ] Back button funciona en todas las pantallas

**Lista de Órdenes**:
- [ ] Lista muestra órdenes guardadas
- [ ] Pull-to-refresh funciona
- [ ] Empty state se muestra cuando no hay órdenes
- [ ] FAB navega a nueva orden

**Búsqueda**:
- [ ] Buscar por cliente funciona
- [ ] Buscar por número funciona
- [ ] Resultados se filtran correctamente
- [ ] Limpiar búsqueda restaura lista

**Detalles de Orden**:
- [ ] Tap en card abre detalles
- [ ] Todos los datos se muestran correctamente
- [ ] Botón Editar navega a formulario
- [ ] Botón Anular muestra confirmación y funciona
- [ ] Botón Imprimir muestra toast
- [ ] Estados se muestran con colores correctos

**Formulario Nueva Orden**:
- [ ] FAB abre paso 1
- [ ] Paso 1 valida correctamente
- [ ] Continuar navega a paso 2
- [ ] Paso 2 valida detalles
- [ ] Agregar/remover extintores funciona
- [ ] Crear orden funciona
- [ ] Alert se muestra
- [ ] Navega a lista actualizada

**Formulario Editar Orden**:
- [ ] Botón Editar pre-llena formulario
- [ ] Paso 1 muestra datos existentes
- [ ] Paso 2 muestra extintores existentes
- [ ] Actualizar orden funciona
- [ ] Navega a detalles actualizados

**About y Config**:
- [ ] About muestra info correcta
- [ ] Config muestra opciones
- [ ] Dark mode toggle funciona
- [ ] Limpiar caché funciona

**General**:
- [ ] Dark mode funciona en todas las pantallas
- [ ] TypeScript sin errores (`npx tsc --noEmit`)
- [ ] No hay warnings en consola
- [ ] No hay memory leaks
- [ ] AsyncStorage persiste datos correctamente

**5. Documentar (15 min)**

Actualizar README.md del proyecto con nueva navegación.

#### Resultado
✅ App completa, testeada y funcionando

---

## 📊 Estimación Total de Tiempo

| Subfase | Tiempo | Tareas |
|---------|--------|--------|
| 7.0: Pre-Setup | 1-1.5h | 6 |
| 7.1: Setup Drawer | 2.5-3h | 7 |
| 7.2: Lista + CRUD | 4-5h | 6 |
| 7.3: Detalles | 2-3h | 6 |
| 7.4: Formulario | 3-4h | 8 |
| 7.5: About + Config | 1.5-2h | 4 |
| 7.6: Migración + Testing | 2-3h | 5 |
| **TOTAL** | **17-21.5h** | **42** |

**Contingencia (Plan B)**: +2h si se requiere Development Build

**Total con contingencia**: **19-23.5h (3-4 días a 6h/día)**

---

## ⚠️ Plan B: Si Expo Router No Funciona en Expo Go

### Síntomas de Incompatibilidad
- ❌ App crash al escanear QR
- ❌ Error: "expo-router requires New Architecture"
- ❌ Navegación no funciona

### Solución: Development Build

**Tiempo adicional**: +2h

```bash
# Instalar expo-dev-client
npx expo install expo-dev-client

# Crear build de desarrollo
npx expo prebuild

# Ejecutar en Android
npx expo run:android
```

**Ventajas**:
- ✅ Expo Router funcionará 100%
- ✅ Acceso a todas las features
- ✅ Mejor para producción

**Desventajas**:
- ❌ No más escaneo de QR
- ❌ Requiere compilar app nativa
- ❌ +500MB de espacio

---

## ✅ Checklist Pre-Implementación

### Pre-Requisitos Técnicos
- [ ] Git status limpio
- [ ] FASE 6 completada y funcionando
- [ ] TypeScript sin errores
- [ ] App funciona en Expo Go

### Backup y Seguridad
- [ ] Commit actual realizado
- [ ] Rama experimental creada
- [ ] Datos AsyncStorage documentados
- [ ] Screenshots de app actual

### Instalación y Validación
- [ ] Dependencias Expo Router instaladas
- [ ] `npx expo start` funciona
- [ ] App abre en Expo Go sin crashes
- [ ] TypeScript compila sin errores

### Migración
- [ ] `migrationService.ts` creado
- [ ] Migration script testeado
- [ ] Rollback probado

---

## 🎯 Próximo Paso

**Ejecutar Subfase 7.0: Pre-Setup**

---

**Última actualización**: 2025-10-20
**Autor**: Claude Code + Willy Salas
**Status**: ✅ PLAN COMPLETADO - LISTO PARA IMPLEMENTAR
