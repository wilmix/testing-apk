# 📋 FASE 7: PLAN DE ACCIÓN DETALLADO

---

## 🗂️ Estructura de Carpetas Propuesta

### Nueva Arquitectura (Expo Router)

```
testing-apk/
├── app/                              # 🆕 Expo Router routes
│   ├── _layout.tsx                  # Root layout con Tabs
│   ├── index.tsx                    # Tab 1: Lista de Órdenes
│   │
│   ├── nueva-orden/                 # Stack: Nueva/Editar Orden
│   │   ├── _layout.tsx              # Stack layout
│   │   ├── paso1.tsx                # Header + Final
│   │   ├── paso2.tsx                # Detalles
│   │   └── [id].tsx                 # Editar orden (dynamic route)
│   │
│   ├── about.tsx                    # Tab 2: About
│   └── configuracion.tsx            # Tab 3: Configuración
│
├── src/
│   ├── components/
│   │   ├── OrdenTrabajo/
│   │   │   ├── OrdenCard.tsx              # 🆕 Card para lista
│   │   │   ├── OrdenFilters.tsx           # 🆕 Filtros
│   │   │   ├── HeaderFinalForm.tsx        # 🆕 Header+Final (Paso 1)
│   │   │   ├── DetallesForm.tsx           # ✅ Ya existe (Paso 2)
│   │   │   └── OrdenSummary.tsx           # 🆕 Resumen
│   │   │
│   │   ├── Navigation/
│   │   │   └── CustomTabBar.tsx           # 🆕 Tab bar personalizado
│   │   │
│   │   └── About/
│   │       └── InfoCard.tsx               # 🆕 Card de info
│   │
│   ├── services/
│   │   ├── ordenService.ts                # 🆕 CRUD órdenes
│   │   └── filterService.ts               # 🆕 Filtros
│   │
│   └── types/
│       └── navigation.ts                   # 🆕 Tipos navegación
│
├── App.tsx                                # ⚠️ ELIMINAR
└── package.json                           # ✏️ Modificar main
```

---

## 🗺️ Mapa de Navegación

### Tabs (Bottom Navigation)

```
┌─────────────────────────────────────────────┐
│  [📋 Órdenes]   [ℹ️ About]   [⚙️ Config]     │
└─────────────────────────────────────────────┘
       │              │              │
       ▼              ▼              ▼
   Lista Órdenes   AboutScreen   ConfigScreen
```

### Stack: Nueva Orden

```
Lista Órdenes
    ↓ (+ Nueva Orden)
┌─────────────────────────┐
│ Paso 1: Header + Final  │
│ - Cliente               │
│ - Fecha                 │
│ - Teléfono              │
│ - Observaciones         │
│ - Préstamo              │
│  [Continuar →]          │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ Paso 2: Detalles        │
│ - Lista extintores      │
│ - Add/Remove            │
│  [← Atrás] [Finalizar]  │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ Resumen + Confirmar     │
│ [Crear Orden]           │
└─────────────────────────┘
    ↓
[Alert Éxito] → Lista (actualizada)
```

---

## 📝 Subfase 7.1: Setup Expo Router (2-3h)

### Tareas

#### 1. Instalar Dependencias (15 min)
```bash
npx expo install expo-router expo-linking expo-constants
```

#### 2. Configurar package.json (5 min)
```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  }
}
```

#### 3. Configurar app.json (10 min)
```json
{
  "expo": {
    "scheme": "ordenestrabajo",
    "plugins": ["expo-router"]
  }
}
```

#### 4. Crear app/_layout.tsx (30 min)
```tsx
// Tabs con 3 tabs: Órdenes, About, Config
import { Tabs } from 'expo-router'

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Órdenes' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      <Tabs.Screen name="configuracion" options={{ title: 'Config' }} />
    </Tabs>
  )
}
```

#### 5. Crear app/index.tsx (30 min)
```tsx
// Lista de órdenes (placeholder)
export default function OrdenesScreen() {
  return <Text>Lista de Órdenes</Text>
}
```

#### 6. Crear app/nueva-orden/_layout.tsx (20 min)
```tsx
// Stack para formulario
import { Stack } from 'expo-router'

export default function NuevaOrdenLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
```

#### 7. Testing básico (20 min)
- Verificar navegación Tabs funciona
- Verificar Stack funciona
- Sin errores en console

**Resultado**: Navegación básica funcionando ✅

---

## 📝 Subfase 7.2: Refactor Formulario (3-4h)

### Tareas

#### 1. Crear HeaderFinalForm.tsx (90 min)

**Combinar**:
- HeaderForm (cliente, fecha, agencia/dirección)
- FinalForm (teléfono, observaciones, préstamo)

**Props**:
```tsx
interface HeaderFinalFormProps {
  data: OrdenTrabajoFormData
  onDataChange: (data: OrdenTrabajoFormData) => void
  onContinue: () => void
}
```

**Secciones**:
1. **Cliente y Ubicación**
   - Dropdown Cliente
   - DatePicker Fecha
   - Condicional: Agencia (Banco Solidario) o Dirección

2. **Contacto y Observaciones**
   - Input Teléfono (numérico)
   - TextArea Observaciones (contador 0/500)

3. **Préstamo**
   - Switch Préstamo
   - Input Cantidad (reveal condicional)

4. **Navegación**
   - Botón "Continuar →" (valida y navega)

#### 2. Crear HeaderFinalSchema (20 min)

```tsx
export const HeaderFinalSchema = z.object({
  cliente: z.string().min(1, 'Cliente requerido'),
  fechaEntrega: z.date(),
  agencia: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().min(7).max(15),
  observaciones: z.string().max(500).optional(),
  prestamoExtintores: z.boolean(),
  cantidadPrestamo: z.string().optional()
}).refine(/* validaciones condicionales */)
```

#### 3. Actualizar DetallesForm (30 min)

**Agregar**:
- Botón "← Atrás" (navega a paso1)
- Botón "Finalizar ✓" (submit)
- Props de navegación

#### 4. Crear app/nueva-orden/paso1.tsx (30 min)
```tsx
export default function Paso1Screen() {
  const router = useRouter()

  return (
    <HeaderFinalForm
      data={data}
      onDataChange={setData}
      onContinue={() => router.push('/nueva-orden/paso2')}
    />
  )
}
```

#### 5. Crear app/nueva-orden/paso2.tsx (30 min)
```tsx
export default function Paso2Screen() {
  const router = useRouter()

  return (
    <DetallesForm
      data={data}
      onDataChange={setData}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  )
}
```

**Resultado**: Formulario 2 pasos funcional ✅

---

## 📝 Subfase 7.3: Lista + CRUD (3-4h)

### Tareas

#### 1. Crear ordenService.ts (60 min)

**API**:
```tsx
interface OrdenService {
  getOrdenes(): Promise<OrdenTrabajoFormData[]>
  getOrdenById(id: string): Promise<OrdenTrabajoFormData | null>
  createOrden(data: OrdenTrabajoFormData): Promise<string>
  updateOrden(id: string, data: OrdenTrabajoFormData): Promise<void>
  deleteOrden(id: string): Promise<void>
  filterOrdenes(filters: Filters): Promise<OrdenTrabajoFormData[]>
}
```

**AsyncStorage keys**:
- `ordenes:list` - Array de IDs
- `ordenes:data:${id}` - Data de cada orden
- `ordenes:lastId` - Último ID usado

#### 2. Crear OrdenCard.tsx (30 min)

**Diseño**:
```
┌────────────────────────────────────┐
│ 📋 Orden #001                      │
│ Cliente: BANCO NACIONAL DE BOLIVIA │
│ Fecha: 20/10/2025                  │
│ Extintores: 3                      │
│                                    │
│ [Ver] [Editar] [Anular]            │
└────────────────────────────────────┘
```

#### 3. Crear OrdenFilters.tsx (40 min)

**Filtros**:
- Rango de fechas (desde - hasta)
- Dropdown cliente
- Botón "Limpiar filtros"

#### 4. Crear app/index.tsx completo (60 min)

**Funcionalidades**:
- FlatList con OrdenCard
- Pull-to-refresh
- Botón FAB "+ Nueva Orden"
- Empty state cuando no hay órdenes
- Filtros colapsables

#### 5. Integrar edición (30 min)

**Flujo**:
- Tap en "Editar" → Navega a `/nueva-orden/paso1?id=${id}`
- Pre-llenar formulario con datos existentes
- Submit actualiza en vez de crear

**Resultado**: CRUD completo funcional ✅

---

## 📝 Subfase 7.4: About + Config (1-2h)

### Tareas

#### 1. Crear app/about.tsx (30 min)

**Contenido**:
```
┌────────────────────────────────┐
│   [Logo de la App]             │
│                                │
│   Orden de Trabajo Mobile      │
│   Versión 1.0.0                │
│                                │
│   Desarrollado por:            │
│   Willy Salas Quiroga          │
│                                │
│   © 2025                       │
└────────────────────────────────┘
```

#### 2. Crear app/configuracion.tsx (30 min)

**Contenido**:
```
┌────────────────────────────────┐
│ CONFIGURACIÓN                  │
│                                │
│ API Configuration              │
│ Token: [________________]      │
│ (Placeholder - futuro)         │
│                                │
│ Preferencias                   │
│ ◉ Dark Mode                    │
│                                │
│ Caché                          │
│ [Limpiar Caché]                │
└────────────────────────────────┘
```

**Resultado**: Vistas adicionales listas ✅

---

## 📝 Subfase 7.5: Migración Completa (2h)

### Tareas

#### 1. Eliminar código de debug (30 min)

**Remover de App.tsx**:
- runTests()
- Debug logs
- Botones de test (Header, Detalles, Final)
- Vista de debug

**Mantener**:
- ThemeProvider (mover a app/_layout.tsx)
- SafeAreaProvider (mover a app/_layout.tsx)

#### 2. Migrar ThemeProvider (20 min)

```tsx
// app/_layout.tsx
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Tabs>...</Tabs>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
```

#### 3. Eliminar App.tsx (5 min)

Ya no se usa con Expo Router.

#### 4. Actualizar package.json (5 min)

Verificar `"main": "expo-router/entry"`.

#### 5. Testing completo (60 min)

**Checklist**:
- [ ] Navegación Tabs funciona
- [ ] Crear nueva orden (paso 1 → paso 2 → submit)
- [ ] Lista muestra órdenes creadas
- [ ] Filtros funcionan
- [ ] Editar orden funciona
- [ ] Anular orden funciona
- [ ] About muestra info correcta
- [ ] Config tiene placeholder
- [ ] Dark mode funciona en todas las vistas
- [ ] TypeScript sin errores
- [ ] No memory leaks

**Resultado**: App completa y limpia ✅

---

## ✅ Checklist de Migración

### Pre-Migración
- [ ] Backup de App.tsx actual
- [ ] Commit de FASE 6 completada
- [ ] Documentación FASE 7 creada

### Durante Migración
- [ ] Expo Router instalado
- [ ] package.json actualizado
- [ ] Estructura app/ creada
- [ ] HeaderFinalForm creado
- [ ] ordenService implementado
- [ ] Lista de órdenes funcional
- [ ] About y Config creados

### Post-Migración
- [ ] App.tsx eliminado
- [ ] Debug logs removidos
- [ ] Testing completo pasado
- [ ] TypeScript sin errores
- [ ] README.md actualizado
- [ ] Commit FASE 7

---

## 📊 Estimación por Subfase

| Subfase | Tareas | Tiempo | Prioridad |
|---------|--------|--------|-----------|
| 7.1: Setup Router | 7 | 2-3h | 🔴 Alta |
| 7.2: Refactor Form | 5 | 3-4h | 🔴 Alta |
| 7.3: CRUD Lista | 5 | 3-4h | 🔴 Alta |
| 7.4: About/Config | 2 | 1-2h | 🟡 Media |
| 7.5: Migración | 5 | 2h | 🔴 Alta |
| **TOTAL** | **24** | **11-15h** | - |

---

## 🚀 Orden de Ejecución Recomendado

**Día 1** (4-5h):
1. Subfase 7.1: Setup Expo Router
2. Subfase 7.2: Refactor Formulario (parte)

**Día 2** (4-5h):
1. Subfase 7.2: Refactor Formulario (completar)
2. Subfase 7.3: CRUD Lista (parte)

**Día 3** (3-5h):
1. Subfase 7.3: CRUD Lista (completar)
2. Subfase 7.4: About + Config
3. Subfase 7.5: Migración completa
4. Testing final

---

## ⚠️ Puntos Críticos

1. **Compatibilidad AsyncStorage**: Mantener formato de keys existentes
2. **Validación**: HeaderFinalSchema debe validar igual que Header+Final separados
3. **Navegación**: Pasar data entre paso1 y paso2 (usar Context o params)
4. **Testing**: Re-testear TODO después de migración

---

**Última actualización**: 2025-10-20
**Status**: 📋 Documentación completada - Lista para ejecutar
