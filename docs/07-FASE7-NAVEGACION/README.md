# 🚀 FASE 7: NAVEGACIÓN ESTILO GMAIL - APPROVAL POINT 4

**Status**: 📋 PLANEADA - Documentación completada
**Tiempo estimado**: 17-21.5 horas (3-4 días)
**Prioridad**: 🔴 ALTA
**Versión**: 2.0 (Estilo Gmail con Drawer Navigation)

---

## 🎯 Objetivos

Migrar la app de navegación simple (useState) a **Expo Router con Drawer Navigation**, siguiendo el patrón de diseño de **Gmail**:

1. **📋 Lista de Órdenes** - Home con CRUD + búsqueda
2. **🔍 Búsqueda** - Por cliente y número de orden
3. **📄 Detalles de Orden** - Vista completa con acciones
4. **✏️ Formulario (2 pasos)** - Crear/Editar orden
5. **☰ Menú Lateral** - Drawer con About y Configuración

---

## 🏗️ Arquitectura Propuesta

### Navegación: Drawer (Estilo Gmail)

```
app/
├── _layout.tsx                    # Drawer Navigation
├── index.tsx                      # Lista de Órdenes (Home)
│
├── orden/
│   └── [id].tsx                   # Detalles de Orden
│
├── nueva-orden/
│   ├── _layout.tsx                # Stack Navigation
│   ├── paso1.tsx                  # Header + Final
│   └── paso2.tsx                  # Detalles Extintores
│
├── about.tsx                      # About (Drawer)
└── configuracion.tsx              # Config (Drawer)
```

### UI Principal
```
┌──────────────────────────────────────────┐
│ ☰  [🔍 Buscar...] [Buscar] 📱 Logo       │ ← Header
├──────────────────────────────────────────┤
│                                          │
│  [Orden Cards...]                        │
│                                          │
│                                 [+]      │ ← FAB
└──────────────────────────────────────────┘
```

---

## 📋 Cambios Principales

### 1. Formulario: 3 pasos → 2 pasos

**Antes** (FASE 6):
- Paso 1: HeaderForm (cliente, fecha, agencia)
- Paso 2: DetallesForm (extintores)
- Paso 3: FinalForm (teléfono, observaciones, préstamo)

**Después** (FASE 7):
- **Paso 1**: HeaderFinalForm (Header + Final combinados)
  - Cliente, Fecha, Agencia/Dirección
  - Teléfono, Observaciones, Préstamo
  - Botón "Continuar →"
- **Paso 2**: DetallesForm (mantener actual)
  - Lista extintores
  - Botón "← Atrás" | "Finalizar ✓"

**Beneficio**: Menos navegación, UX más fluida

### 2. Lista de Órdenes (CRUD Completo)

**Funcionalidades**:
- ✅ Ver todas las órdenes guardadas
- ✅ Filtrar por fecha y cliente
- ✅ Crear nueva orden
- ✅ Editar orden existente
- ✅ Anular orden
- ✅ Ver detalles de orden

**Componentes nuevos**:
- `OrdenCard.tsx` - Card individual
- `OrdenFilters.tsx` - Filtros fecha/cliente
- `ordenService.ts` - CRUD AsyncStorage

### 3. Eliminación de Debug Logs

**Remover**:
- ❌ Tests FASE 1-6 en App.tsx
- ❌ Vista de debug con logs
- ❌ Botones "📝 Header", "📋 Detalles", "✅ Final"
- ❌ Función runTests()

**Mantener**:
- ✅ Componentes (HeaderForm, DetallesForm, FinalForm)
- ✅ Validaciones Zod
- ✅ AsyncStorage
- ✅ ThemeContext

---

## 📊 Subfases

### Subfase 7.0: Pre-Setup y Validación (1-1.5h) 🆕
- Crear rama experimental
- Backup completo
- Instalar dependencias Expo Router
- Validar compatibilidad Expo Go
- Crear migration script
- Testing inicial

### Subfase 7.1: Setup Drawer Navigation (2.5-3h)
- Configurar package.json y app.json
- Crear app/_layout.tsx con Drawer
- Crear AppHeader.tsx (☰ | 🔍 | Logo)
- Crear FAB.tsx (Floating Action Button)
- Testing básico

### Subfase 7.2: Lista de Órdenes + CRUD (4-5h) 🆕
- Actualizar types/ordenTrabajo.ts (agregar estado)
- Crear ordenService.ts (CRUD completo)
- Crear OrdenCard.tsx
- Crear SearchBar.tsx
- Crear app/index.tsx (lista completa)
- Integrar búsqueda
- Testing

### Subfase 7.3: Detalles de Orden (2-3h) 🆕
- Crear OrdenDetails.tsx
- Crear OrdenActions.tsx (Editar, Anular, Imprimir)
- Crear app/orden/[id].tsx
- Implementar "Anular"
- Implementar "Imprimir" (placeholder)
- Testing

### Subfase 7.4: Formulario 2 Pasos (3-4h)
- Crear HeaderFinalForm.tsx (combinar Header + Final)
- Crear HeaderFinalSchema
- Actualizar DetallesForm.tsx (botones navegación)
- Crear app/nueva-orden/_layout.tsx
- Crear app/nueva-orden/paso1.tsx
- Crear app/nueva-orden/paso2.tsx
- Implementar edición
- Testing

### Subfase 7.5: About + Configuración (1.5-2h)
- Crear app/about.tsx
- Crear app/configuracion.tsx (Dark Mode toggle)
- Integrar Dark Mode persistente
- Testing

### Subfase 7.6: Migración Completa + Testing (2-3h)
- Ejecutar migración AsyncStorage
- Eliminar código de debug
- Actualizar package.json
- Testing completo (checklist extenso)
- Documentar

---

## ✅ Criterios de Aceptación

### Funcionalidad
- [ ] Drawer Navigation funcionando (☰ abre/cierra)
- [ ] Header personalizado (☰ | 🔍 | Logo)
- [ ] Lista de órdenes muestra todas las guardadas
- [ ] Búsqueda por cliente funciona
- [ ] Búsqueda por número de orden funciona
- [ ] FAB navega a nueva orden
- [ ] Tap en card abre detalles
- [ ] Detalles muestra toda la información
- [ ] Botones de acción funcionan (Editar, Anular, Imprimir)
- [ ] Crear nueva orden (2 pasos) funciona
- [ ] Editar orden existente funciona
- [ ] Anular orden funciona con confirmación
- [ ] Estados (Completada/Anulada) se muestran correctamente
- [ ] Navegación Paso 1 ↔ Paso 2 fluida
- [ ] About muestra autor y versión
- [ ] Config tiene Dark Mode toggle
- [ ] Dark Mode automático funciona

### Código
- [ ] TypeScript sin errores
- [ ] No debug logs en producción
- [ ] Componentes reutilizables
- [ ] AsyncStorage compatible con datos existentes
- [ ] Dark mode funciona en todas las vistas

### UX
- [ ] Navegación intuitiva (Drawer estilo Gmail)
- [ ] Formulario más corto (2 pasos vs 3)
- [ ] Lista de órdenes responsive
- [ ] Búsqueda fácil de usar
- [ ] FAB visible y accesible
- [ ] Cards legibles con info clara
- [ ] Touch-friendly (botones ≥48px)

---

## 📦 Dependencias Nuevas

```json
{
  "expo-router": "~4.0.0",
  "expo-linking": "~7.0.0",
  "expo-constants": "~18.0.0",
  "@react-navigation/drawer": "latest",
  "react-native-gesture-handler": "latest",
  "react-native-reanimated": "latest"
}
```

(react-native-safe-area-context ya instalada)

---

## ⚠️ Breaking Changes

1. **App.tsx eliminado** → Reemplazado por app/
2. **Navegación cambia** → useState → Expo Router con Drawer
3. **Formulario reestructurado** → 3 pasos → 2 pasos
4. **Entry point** → package.json main cambia
5. **AsyncStorage keys cambian** → Migración automática
6. **Types actualizados** → Agregar `estado`, `fechaCreacion`, `id`

---

## 🔗 Referencias

- **Plan detallado V2**: `PLAN_ACCION_V2_GMAIL.md` ⭐
- **Plan original**: `PLAN_ACCION.md` (referencia)
- **Expo Router docs**: https://docs.expo.dev/router/introduction/
- **Drawer Navigation**: https://reactnavigation.org/docs/drawer-navigator/

---

## 📈 Progreso

| Subfase | Status | Tiempo |
|---------|--------|--------|
| 7.0: Pre-Setup | ⏳ Pendiente | 1-1.5h |
| 7.1: Setup Drawer | ⏳ Pendiente | 2.5-3h |
| 7.2: Lista + CRUD | ⏳ Pendiente | 4-5h |
| 7.3: Detalles | ⏳ Pendiente | 2-3h |
| 7.4: Formulario | ⏳ Pendiente | 3-4h |
| 7.5: About + Config | ⏳ Pendiente | 1.5-2h |
| 7.6: Migración + Testing | ⏳ Pendiente | 2-3h |
| **TOTAL** | **0%** | **17-21.5h** |

**Siguiente**: Ejecutar Subfase 7.0 (Pre-Setup y Validación)

---

## 🎯 Notas Importantes

1. **UX basada en Gmail**: Drawer lateral, FAB flotante, header personalizado
2. **Búsqueda manual**: Por cliente y número de orden (con botón)
3. **Estados de órdenes**: Completada (🟢) y Anulada (🔴)
4. **Botones en detalles**: Editar, Anular, Imprimir (placeholder)
5. **Dark Mode**: Automático por defecto + toggle manual en Config
6. **Migración de datos**: Automática en primer arranque

---

**Última actualización**: 2025-10-20
**Autor**: Claude Code + Willy Salas
**Status**: ✅ DOCUMENTACIÓN COMPLETADA - LISTO PARA IMPLEMENTAR
