# 📋 SUBFASE 7.3 - Pantalla de Detalles de Orden

**Fecha**: 2025-10-21
**Duración**: ~45 minutos
**Status**: ✅ COMPLETADO Y APROBADO
**Testing**: ✅ Probado en Expo Go - Android

---

## 🎯 Objetivo

Crear la pantalla de detalles completos de una orden individual, mostrando toda la información organizada en secciones: cliente, extintores, información adicional, y fechas.

---

## 📝 Archivos Creados/Modificados

### 1. `app/orden/[id].tsx` (NUEVO)

**Pantalla de detalles completos de orden con parámetro dinámico `[id]`.**

#### Características:

**Estados:**
```typescript
const [orden, setOrden] = useState<OrdenTrabajoFormData | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(false)
```

**Carga de datos:**
```typescript
const { id } = useLocalSearchParams<{ id: string }>()

const loadOrden = async () => {
  try {
    setLoading(true)
    setError(false)
    const data = await ordenService.getOrdenById(id)

    if (data) {
      setOrden(data)
    } else {
      setError(true)
    }
  } catch (err) {
    console.error('Error al cargar orden:', err)
    setError(true)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  loadOrden()
}, [id])
```

**Tres estados visuales:**

1. **Loading**:
   - ActivityIndicator azul
   - Texto "Cargando orden..."

2. **Error**:
   - Emoji ⚠️
   - "No se pudo cargar la orden"
   - Muestra ID que se intentó cargar

3. **Success** (orden cargada):
   - Muestra todos los detalles en secciones

**Secciones de información:**

1. **Header** (Tarjeta superior):
   ```
   ┌────────────────────────────────┐
   │ Orden #001      🟢 completada  │
   └────────────────────────────────┘
   ```
   - Número de orden grande (24px, bold)
   - Badge de estado con color y emoji

2. **📋 Información del Cliente**:
   - Cliente
   - Agencia (condicional)
   - Dirección (condicional)
   - Teléfono
   - Fecha de Entrega (formateada: "21 de octubre de 2025")

3. **🧯 Detalles de Extintores**:
   - Contador: "(3 extintores)"
   - Cards individuales por cada extintor
   - Cada card muestra:
     - Extintor #1, #2, etc.
     - Número de extintor
     - Capacidad (valor + unidad)
     - Marca
     - Tipo

4. **📝 Información Adicional**:
   - Préstamo de Extintores (Sí/No)
   - Cantidad de Préstamo (si aplica)
   - Observaciones (si hay, con más espacio)

5. **🕐 Fechas (Metadata)**:
   - Fecha de Creación
   - Última Modificación (si existe)

**Componente auxiliar `InfoRow`:**
```typescript
interface InfoRowProps {
  label: string
  value: string
  isDark: boolean
  compact?: boolean
}

function InfoRow({ label, value, isDark, compact = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, compact && styles.infoRowCompact]}>
      <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
        {value}
      </Text>
    </View>
  )
}
```

**Utilidad de formato de fechas:**
```typescript
const formatDate = (date: Date | undefined) => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

**Dark Mode:**
- ✅ Todos los textos ajustados según tema
- ✅ Backgrounds de cards cambian (light: #fff / dark: #1c1c1e)
- ✅ Cards de extintores con background secundario (light: #f5f5f5 / dark: #2c2c2e)
- ✅ Borders sutiles (light: #e0e0e0 / dark: #3a3a3c)

---

### 2. `app/_layout.tsx` (MODIFICADO)

**Problema resuelto**: Doble header superpuesto.

**Cambio**:
```typescript
<Stack.Screen
  name="orden"
  options={{
    headerShown: false, // Usa su propio Stack layout
  }}
/>
<Stack.Screen
  name="nueva-orden"
  options={{
    headerShown: false, // Usa su propio Stack layout
  }}
/>
```

**Por qué:**
- El layout principal mostraba header genérico "orden"
- El layout de orden (`orden/_layout.tsx`) mostraba header "Detalles de Orden"
- Resultado: dos headers superpuestos
- Solución: `headerShown: false` en layout principal para rutas anidadas

**Ahora**:
- Solo aparece un header azul: "← Detalles de Orden"
- Configurado en `orden/_layout.tsx`

---

## 🧪 Testing Realizado

### Test en Expo Go (Android)

**Procedimiento:**
1. ✅ `npx expo start`
2. ✅ Escanear QR en Android
3. ✅ Navegar a lista principal (`/`)
4. ✅ Presionar una card de orden
5. ✅ Verificar navegación a `/orden/[id]`
6. ✅ Verificar loading state (spinner breve)
7. ✅ Verificar todos los datos se muestran correctamente
8. ✅ Scroll por toda la pantalla
9. ✅ Presionar "←" para regresar
10. ✅ Probar con diferentes órdenes

**Logs obtenidos:**
```
LOG  ✅ Migración ya ejecutada previamente
```

### Validaciones:

| Característica | Resultado | Notas |
|----------------|-----------|-------|
| Navegación desde lista | ✅ PASS | router.push(`/orden/${id}`) funciona |
| Loading state | ✅ PASS | ActivityIndicator + texto |
| Header único | ✅ PASS | Solo "← Detalles de Orden" (fix doble header) |
| Número de orden | ✅ PASS | "Orden #001" en grande |
| Badge de estado | ✅ PASS | 🟢 completada / 🔴 anulada con color correcto |
| Info cliente completa | ✅ PASS | Cliente, agencia/dirección, teléfono, fecha |
| Fecha formateada | ✅ PASS | "21 de octubre de 2025" en español |
| Cards de extintores | ✅ PASS | Cada extintor en card individual |
| Contador extintores | ✅ PASS | "(3)" en título de sección |
| Info adicional | ✅ PASS | Préstamo, cantidad, observaciones |
| Fechas metadata | ✅ PASS | Creación + modificación |
| Scroll funciona | ✅ PASS | Todo el contenido scrolleable |
| Dark mode | ✅ PASS | Colores ajustados correctamente |
| Navegación atrás | ✅ PASS | Botón "←" regresa a lista |
| Error state | ⏳ N/A | No probado (requiere ID inexistente) |

---

## 🎨 Diseño Visual

### Layout Completo

```
┌────────────────────────────────────┐
│ ← Detalles de Orden         (HEADER)│
├────────────────────────────────────┤
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Orden #001      🟢 completada  │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 📋 Información del Cliente     │ │
│ │                                │ │
│ │ CLIENTE                        │ │
│ │ BANCO NACIONAL DE BOLIVIA S.A. │ │
│ │                                │ │
│ │ TELÉFONO                       │ │
│ │ 12345678                       │ │
│ │                                │ │
│ │ FECHA DE ENTREGA               │ │
│ │ 21 de octubre de 2025          │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 🧯 Detalles de Extintores (3)  │ │
│ │                                │ │
│ │ ┌────────────────────────────┐ │ │
│ │ │ Extintor #1                │ │ │
│ │ │ NÚMERO: E001               │ │ │
│ │ │ CAPACIDAD: 5 KILOS (KILOS) │ │ │
│ │ │ MARCA: AMEREX              │ │ │
│ │ │ TIPO: ABC                  │ │ │
│ │ └────────────────────────────┘ │ │
│ │                                │ │
│ │ ┌────────────────────────────┐ │ │
│ │ │ Extintor #2                │ │ │
│ │ │ ...                        │ │ │
│ │ └────────────────────────────┘ │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 📝 Información Adicional       │ │
│ │                                │ │
│ │ PRÉSTAMO DE EXTINTORES         │ │
│ │ Sí                             │ │
│ │                                │ │
│ │ CANTIDAD DE PRÉSTAMO           │ │
│ │ 2                              │ │
│ │                                │ │
│ │ OBSERVACIONES                  │ │
│ │ Cliente requiere servicio      │ │
│ │ urgente...                     │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 🕐 Fechas                      │ │
│ │                                │ │
│ │ CREACIÓN                       │ │
│ │ 21 de octubre de 2025          │ │
│ │                                │ │
│ │ ÚLTIMA MODIFICACIÓN            │ │
│ │ 21 de octubre de 2025          │ │
│ └────────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘
```

### Loading State

```
┌────────────────────────────────────┐
│ ← Detalles de Orden                │
├────────────────────────────────────┤
│                                    │
│              🔄                    │
│      (ActivityIndicator)           │
│                                    │
│      Cargando orden...             │
│                                    │
└────────────────────────────────────┘
```

### Error State

```
┌────────────────────────────────────┐
│ ← Detalles de Orden                │
├────────────────────────────────────┤
│                                    │
│              ⚠️                     │
│                                    │
│   No se pudo cargar la orden       │
│                                    │
│           ID: 999                  │
│                                    │
└────────────────────────────────────┘
```

---

## 🔧 Decisiones Técnicas

### 1. useLocalSearchParams para ID Dinámico

```typescript
const { id } = useLocalSearchParams<{ id: string }>()
```

**Por qué:**
- Expo Router usa `[id]` como parámetro dinámico en nombre de archivo
- `useLocalSearchParams` extrae el parámetro de la URL
- Type-safe con `<{ id: string }>`

### 2. Tres Estados Visuales

**Loading → Success o Error**

**Por qué:**
- UX: Usuario ve feedback inmediato (no pantalla en blanco)
- AsyncStorage es rápido pero no instantáneo
- Error state importante para debugging

### 3. Componente InfoRow Reutilizable

```typescript
<InfoRow label="Cliente" value={orden.cliente} isDark={isDark} />
```

**Ventajas:**
- DRY: No repetir layout label/value
- Consistencia: Mismo estilo en toda la app
- Mantenibilidad: Cambiar estilo en un solo lugar
- Prop `compact`: Espaciado reducido para cards de extintor

### 4. Formateo de Fechas en Español

```typescript
d.toLocaleDateString('es-BO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
```

**Por qué:**
- Locale `es-BO` (español Bolivia)
- Formato largo legible: "21 de octubre de 2025"
- Más profesional que "2025-10-21"

### 5. Cards Anidadas para Extintores

```typescript
{orden.detalles.map((detalle, index) => (
  <View key={detalle.id} style={styles.extintorCard}>
    <Text>Extintor #{index + 1}</Text>
    <InfoRow label="Número" value={detalle.extintorNro} compact />
    {/* ... */}
  </View>
))}
```

**Por qué:**
- Separación visual clara entre extintores
- Background secundario diferencia del container principal
- `index + 1` para numeración amigable (1, 2, 3 en vez de 0, 1, 2)
- `compact` prop reduce espaciado dentro de cards

### 6. Condicionales para Campos Opcionales

```typescript
{orden.agencia ? (
  <InfoRow label="Agencia" value={orden.agencia} isDark={isDark} />
) : null}

{orden.direccion ? (
  <InfoRow label="Dirección" value={orden.direccion} isDark={isDark} />
) : null}
```

**Por qué:**
- Agencia solo para BANCO SOLIDARIO
- Dirección solo para otros clientes
- No mostrar campos vacíos (UX limpia)

### 7. ScrollView con contentContainerStyle

```typescript
<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
```

**Por qué:**
- `style`: Flex 1 para ocupar todo el espacio
- `contentContainerStyle`: Padding interno del contenido
- Permite scroll vertical cuando contenido excede pantalla

### 8. SafeAreaView con edges: ['bottom']

```typescript
<SafeAreaView edges={['bottom']}>
```

**Por qué:**
- `edges: ['bottom']`: Solo safe area abajo (evita botón home)
- NO en top: El header del Stack ya maneja safe area superior
- Evita doble padding arriba

---

## 📊 Estadísticas

**Líneas de código:**
- `app/orden/[id].tsx`: ~290 líneas
- `app/_layout.tsx`: +12 líneas (configuración rutas anidadas)
- **Total**: ~302 líneas

**Componentes creados**: 1
1. `OrdenDetailsScreen` (pantalla completa)
2. `InfoRow` (componente auxiliar interno)

**Funcionalidades:**
- ✅ Navegación dinámica con parámetro [id]
- ✅ Loading, error, y success states
- ✅ 5 secciones de información organizadas
- ✅ Formato de fechas en español
- ✅ Dark mode support completo
- ✅ Scroll para contenido largo
- ✅ Navegación de regreso

**Métodos de ordenService usados:**
- `getOrdenById(id)` - Obtener orden por ID

---

## 🚀 Próximos Pasos

### Subfase 7.4 (Formulario 2 Pasos)
- [ ] Crear `app/nueva-orden/paso1.tsx`
  - Integrar `HeaderForm` existente
  - Validación antes de paso 2
  - Navegación condicional
- [ ] Crear `app/nueva-orden/paso2.tsx`
  - Integrar `DetallesForm` existente
  - Integrar `FinalForm` existente
  - Submit final con ordenService.createOrden()
- [ ] Cambiar FAB en `app/index.tsx`
  - De `/test` a `/nueva-orden/paso1`
- [ ] Testing completo del flujo create

### Subfase 7.5 (Acciones de Orden - Futuro)
- [ ] Botón "Editar" en detalles
- [ ] Botón "Anular" (cambiar estado)
- [ ] Botón "Compartir/Imprimir" (futuro)

---

## 🐛 Troubleshooting

### Error: "No se pudo cargar la orden"

**Causas posibles:**
1. ID no existe en AsyncStorage
2. Datos corruptos
3. Error de serialización (fecha)

**Solución:**
- Verificar que ID existe: usar `/test` para ver IDs creados
- Verificar logs: `console.error` en catch
- Verificar formato de fecha en AsyncStorage

### Cards de extintor no aparecen

**Causa**: Array `detalles` vacío
**Solución**: Verificar que orden tiene `detalles.length > 0`

### Doble header

**Causa**: Layout principal muestra header + layout anidado muestra header
**Solución**: Ya resuelto con `headerShown: false` en `app/_layout.tsx:74-85`

### Fecha muestra "N/A"

**Causas:**
- Campo es `undefined`
- Fecha no es objeto Date válido

**Solución:**
```typescript
const formatDate = (date: Date | undefined) => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-BO', {...})
}
```

---

## 🎓 Aprendizajes

### 1. Parámetros Dinámicos en Expo Router

```typescript
// Archivo: app/orden/[id].tsx
// Ruta: /orden/001, /orden/002, etc.

const { id } = useLocalSearchParams<{ id: string }>()

// Navegación:
router.push(`/orden/${item.id}`)
```

**Patrón:**
- Nombre de archivo: `[parametro].tsx`
- Hook: `useLocalSearchParams`
- Type-safe con TypeScript

### 2. Stack Layouts Anidados

```
app/
├── _layout.tsx          (Root Stack)
│   ├── headerShown: true para pantallas simples
│   └── headerShown: false para grupos con su propio layout
├── index.tsx            (usa header de root)
├── orden/
│   ├── _layout.tsx      (Stack anidado)
│   │   └── headerShown: true
│   └── [id].tsx         (usa header de orden/_layout)
```

**Regla:**
- Root layout: `headerShown: false` para grupos
- Layout anidado: Configurar headers específicos

### 3. Estados Visuales: Loading, Error, Success

```typescript
if (loading) return <LoadingView />
if (error || !data) return <ErrorView />
return <SuccessView data={data} />
```

**Por qué es mejor que mostrar todo junto:**
- UX clara: Usuario sabe qué está pasando
- No mostrar UI parcial mientras carga
- Error handling explícito

### 4. Componente Auxiliar Interno vs Externo

**InfoRow como componente interno:**
```typescript
// Dentro del mismo archivo
function InfoRow({ label, value, isDark }: InfoRowProps) {
  // ...
}
```

**Cuándo usar:**
- ✅ Solo se usa en este archivo
- ✅ Lógica simple
- ✅ No necesita testing independiente

**Cuándo extraer a componente separado:**
- ❌ Se usa en múltiples pantallas
- ❌ Lógica compleja
- ❌ Requiere testing

### 5. Dark Mode con StyleSheet Condicional

```typescript
// ❌ Incorrecto: Crear StyleSheet por cada render
const styles = StyleSheet.create({
  text: { color: isDark ? '#fff' : '#000' }
})

// ✅ Correcto: StyleSheet estático + inline condicional
const styles = StyleSheet.create({
  text: { fontSize: 16 }
})

<Text style={[styles.text, { color: isDark ? '#fff' : '#000' }]}>
```

**Por qué:**
- StyleSheet.create es costoso
- Mejor: Estilos estáticos + dinámicos separados

---

## 📝 Notas

### Navegación Bidireccional

**Lista → Detalles:**
```typescript
// En OrdenCard
<OrdenCard
  orden={item}
  onPress={() => router.push(`/orden/${item.id}`)}
/>
```

**Detalles → Lista:**
- Automático con header "←"
- Configurado en `orden/_layout.tsx`

### Formato de Fechas

**Input**: Date object o string ISO
**Output**: "21 de octubre de 2025"

**Locale**: `es-BO` (español Bolivia)
**Formato**: `{ year: 'numeric', month: 'long', day: 'numeric' }`

**Alternativas probadas:**
- `toISOString()`: "2025-10-21T00:00:00.000Z" (muy técnico)
- `toDateString()`: "Tue Oct 21 2025" (en inglés)
- `toLocaleDateString()`: ✅ Configurable y localizado

### Estados de Orden

**Actual:**
- `completada`: 🟢 verde
- `anulada`: 🔴 rojo
- `undefined`: Muestra "activa" por defecto

**Futuro (Subfase 7.5):**
- Botón "Anular" → cambiar estado a "anulada"
- Botón "Completar" → cambiar estado a "completada"

---

## ✅ Resumen Subfase 7.3

**Archivos:**
1. ✅ `app/orden/[id].tsx` - Pantalla de detalles completos
2. ✅ `app/_layout.tsx` - Fix doble header

**Funcionalidades:**
- ✅ Navegación dinámica desde lista
- ✅ Loading/Error/Success states
- ✅ 5 secciones de información
- ✅ Formato de fechas en español
- ✅ Dark mode support
- ✅ Navegación de regreso

**Testing:**
- ✅ Probado en Expo Go - Android
- ✅ TypeScript compilación sin errores
- ✅ Aprobado por usuario

---

**Última actualización**: 2025-10-21
**Autor**: Claude Code + Willy Salas
**Status**: ✅ SUBFASE 7.3 COMPLETADA - Detalles de orden funcionando perfectamente

---

## 📦 Progreso FASE 7

**Completadas:**
- ✅ Subfase 7.0: Pre-Setup Expo Router
- ✅ Subfase 7.1: Stack Navigation básico
- ✅ Subfase 7.2: Lista de Órdenes + CRUD (5 partes)
- ✅ **Subfase 7.3: Detalles de Orden** ← ACTUAL

**Próximas:**
- ⏳ Subfase 7.4: Formulario 2 Pasos (nueva-orden/paso1, paso2)
- ⏳ Subfase 7.5: Acciones de Orden (Editar, Anular)

**Progreso**: 4 de 5 subfases completadas (80%)

**Listo para comenzar Subfase 7.4**.
