# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Orden de Trabajo Mobile** - An offline-first React Native + Expo mobile app for field workers (fire extinguisher recharge technicians). The app transforms a web-based form into an optimized mobile experience with 70-80% UX improvement.

## Development Philosophy: KISS, DRY, SOLID

**Core Principles**:
1. **KISS (Keep It Simple, Stupid)**: Simple solutions over clever ones. No over-engineering.
2. **DRY (Don't Repeat Yourself)**: Reuse code, avoid duplication. Single source of truth.
3. **SOLID**: Clean architecture, single responsibility, open for extension.

**Guidelines**:
- ✅ Write code that's **simple, efficient, elegant**
- ✅ Prefer native solutions over heavy libraries
- ✅ One library per problem (e.g., one safe area library, not multiple approaches)
- ✅ Delete code before adding complexity
- ❌ No over-abstraction or premature optimization
- ❌ No "just in case" features

## Environment

- **Platform**: Windows 10/11 (NOT Linux/Mac)
- **IDE**: Visual Studio Code
- **Terminal**: PowerShell (NOT bash)
- **Project Path**: `c:\Users\willy\projects\testing-apk` on Windows
- Use Windows-style paths (backslashes) in documentation/instructions for users
- Use PowerShell commands, not bash commands

## Target Platform

- **Primary**: **Android** (90% of users are Android)
- **Secondary**: iOS (tested occasionally, not priority)
- **Focus**: Optimize for Android first, ensure iOS compatibility second
- **Testing**: Android emulator + physical Android devices

## Tech Stack

| Component | Library | Version | Notes |
|-----------|---------|---------|-------|
| Framework | React Native + Expo | 0.81.4 / ~54.0.13 | Cross-platform |
| **Navigation** | **Expo Router + Stack** | **~6.0.13** | **File-based routing, Stack Navigation** |
| Language | TypeScript | ~5.9.2 | Strict mode enabled |
| Storage | AsyncStorage | 2.2.0 | Offline-first, included in Expo Go |
| Dropdowns | react-native-element-dropdown | 2.12.4 | Touch-optimized with search |
| Validation | Zod | 3.25.76 | Type-safe, Spanish messages |
| Date Picker | @react-native-community/datetimepicker | 8.4.4 | Native iOS/Android |
| QR Scanner | expo-camera | ~17.0.8 | Escaneo QR, permisos, Expo Go |
| Haptics | expo-haptics | ~15.0.7 | Vibration feedback |
| Safe Area | react-native-safe-area-context | ~5.6.0 | Cross-platform (Android + iOS) |
| Theming | React Context | Built-in | Dark/Light mode automático |
| State | React Hooks | Built-in | Simple, no Redux |

## Common Commands

### Development
```bash
# Start Expo dev server
npx expo start

# Start with clear cache (use if hot reload not working)
npx expo start --clear

# Open on specific platforms
# Press 'a' for Android, 'i' for iOS, 'w' for Web
```

### TypeScript & Testing
```bash
# Type check (no emit)
npx tsc --noEmit

# List installed dependencies
npm list

# Verify specific packages
npm list @react-native-async-storage/async-storage react-native-element-dropdown zod @react-native-community/datetimepicker
```

### Git Workflow
```bash
git status
git add -A
git commit -m "✨ feat: description"
```

Commit emoji convention:
- ✨ feat: new feature
- 🐛 fix: bug fix
- ♻️ refactor: refactoring
- 📝 docs: documentation
- 🔧 config: configuration

## Code Architecture

### Directory Structure

```
app/                              # 🆕 Expo Router file-based routing
├── _layout.tsx                   # Root Stack Navigation
├── index.tsx                     # Lista de Órdenes (Home)
├── about.tsx                     # About screen
├── configuracion.tsx             # Configuración screen
├── test.tsx                      # Testing screen (dev only)
├── orden/
│   ├── _layout.tsx               # Stack para detalles
│   └── [id].tsx                  # Detalles de orden (dynamic route)
└── nueva-orden/
    ├── _layout.tsx               # Stack para formulario
    ├── paso1.tsx                 # Cliente + Fecha + Ubicación
    └── paso2.tsx                 # Extintores + Info Final

src/
├── types/
│   └── ordenTrabajo.ts           # TypeScript interfaces + EstadoOrden
├── constants/
│   ├── ordenTrabajoConstants.ts  # Static data: CLIENTES, MARCAS, TIPOS, etc.
│   └── hapticConfig.ts           # Haptic feedback configuration
├── services/
│   ├── storageService.ts         # AsyncStorage utilities (StorageUtils)
│   ├── validationService.ts      # Zod schemas + validateData()
│   ├── ordenService.ts           # 🆕 CRUD operations for órdenes
│   └── migrationService.ts       # 🆕 Data migration (legacy → v1)
├── hooks/
│   ├── useStorage.ts             # Generic AsyncStorage hook
│   ├── useFormData.ts            # Form state + validation + persistence
│   ├── useFieldVisibility.ts    # Conditional field visibility logic
│   ├── useQRReader.ts            # QR scanner with validation
│   └── useHapticFeedback.ts      # Haptic feedback wrapper
├── contexts/
│   └── ThemeContext.tsx          # Theme provider (light/dark)
├── components/
│   ├── FormFields/               # Reusable form inputs
│   │   ├── FormInput.tsx         # Text input with validation
│   │   ├── FormDropdown.tsx      # Searchable dropdown
│   │   └── FormDatePicker.tsx    # Native date picker
│   ├── Feedback/
│   │   ├── ValidationIcon.tsx    # Visual validation feedback
│   │   └── FeedbackOverlay.tsx   # Full-screen feedback
│   ├── Navigation/               # 🆕 Navigation components
│   │   └── FAB.tsx               # Floating Action Button
│   ├── QR/                       # 🆕 QR Scanner
│   │   └── QRScanner.tsx         # Camera + QR detection
│   └── OrdenTrabajo/             # Feature components
│       ├── HeaderForm.tsx        # Cliente + Fecha + Ubicación (conditional)
│       ├── DetallesForm.tsx      # Dynamic list of extintores
│       ├── FinalForm.tsx         # Teléfono + Observaciones + Préstamo
│       ├── OrdenCard.tsx         # 🆕 Card for orden in list
│       └── SearchBar.tsx         # 🆕 Search with filters
└── components/index.ts           # Barrel exports
```

### Key Architectural Patterns

**1. Navigation Architecture (Expo Router + Stack)**
- **File-based routing**: Routes defined by file structure in `app/` folder
- **Stack Navigation**: Native headers, back navigation, no Drawer (Expo Go compatibility)
- **Nested Stacks**: Groups like `orden/` and `nueva-orden/` have their own Stack layouts
- **Dynamic routes**: `[id].tsx` for parametrized routes (e.g., `/orden/001`)
- **Reason for Stack over Drawer**: `react-native-reanimated` issues with Expo Go, simpler implementation

**2. CRUD Operations with ordenService**
- Centralized service for all orden operations: `createOrden()`, `getOrdenes()`, `updateOrden()`, `deleteOrden()`
- ID-based storage: Each orden stored separately (`ordenes:data:{id}`)
- Index list: `ordenes:list` maintains array of all orden IDs
- Auto-incrementing IDs: `ordenes:lastId` tracks next ID
- Search functionality: `searchByCliente()`, `searchByNumero()`

**3. Form Data Management (Progressive Disclosure)**
- **2-step form**: Paso 1 (Cliente) → Paso 2 (Extintores + Final)
- **Temporary storage**: `temp_nueva_orden` for in-progress forms, `temp_edit_orden` for edits
- `HeaderForm`: Client, delivery date, agency/direccion (conditional on client)
- `DetallesForm`: Dynamic list of fire extinguisher details with add/remove + QR scanner
- `FinalForm`: Teléfono, observaciones, préstamo de extintores
- Conditional fields based on selected values (e.g., agency only for "BANCO SOLIDARIO S.A.")

**4. Offline-First with AsyncStorage**
- All data persists automatically to AsyncStorage (Expo Go compatible)
- `StorageUtils` service provides type-safe wrappers: `getJSON<T>()`, `setJSON()`, `remove()`
- `useFormData` hook integrates auto-save with debouncing (500ms default)
- Migration service: `migrationService` handles data schema updates

**5. Real-time Validation with Zod**
- Schemas defined in `validationService.ts`: `HeaderSchema`, `DetallesSchema`, `FinalSchema`, `OrdenTrabajoSchemaComplete`
- `validateData()` function returns `{ valid: boolean, errors: Record<string, string> }`
- Validation occurs on field blur (touched) and before submit
- Spanish error messages configured in Zod schemas

**6. Custom Hooks Pattern**
- `useFormData<T>`: Generic hook managing form state, errors, touched fields, validation, and persistence
- `useFieldVisibility`: Encapsulates conditional field logic
- `useStorage<T>`: Low-level AsyncStorage wrapper
- `useQRReader`: QR scanning with validation and auto-fill
- `useHapticFeedback`: Wrapper for expo-haptics with configuration

**7. Component Composition**
- Atomic components in `FormFields/`: `FormInput`, `FormDropdown`, `FormDatePicker`
- Feature components: `OrdenCard`, `SearchBar`, `FAB`
- Each component accepts `isDark` prop for theming
- `ValidationIcon` provides visual feedback (🟢 valid, 🔴 error)

**8. Dynamic Lists & QR Integration**
- Each fire extinguisher is a `DetalleExtintor` object with unique `id`
- Add/remove/QR scan buttons manage the `detalles` array
- Cascading dropdowns: selecting `capacidadUnidad` filters `capacidadValor` options
- Collapsible items with header showing extintor number
- QR scanner auto-fills extintor data from JSON payload

**9. Dark Mode Support**
- `ThemeContext` provides theme state across app
- `useTheme()` hook for accessing theme in components
- All components support light/dark themes
- Configured in `app.json`: `userInterfaceStyle: "automatic"`

## Development Workflow

### Standard Flow (For Each Feature/Phase)

**CRITICAL: All development and testing MUST be done with Expo Go**

This is the mandatory workflow cycle - NO exceptions:

1. **Implement**:
   - Write code incrementally (one component/feature at a time)
   - Check TypeScript types (`npx tsc --noEmit`)
   - NO large commits - small, testable increments

2. **Test in Expo Go**:
   - ALWAYS run `npx expo start`
   - Scan QR on physical Android device
   - Test the specific feature implemented
   - Verify on actual device, NOT emulator

3. **User Approval**:
   - Show working feature to user
   - User MUST test and approve functionality
   - Get explicit "ok funciona bien" confirmation
   - If issues found, go back to step 1

4. **Documentation**:
   - Update relevant documentation in `docs/`
   - Document what was implemented
   - Include testing results
   - Add screenshots/logs if helpful

5. **Git Commit**:
   - ONLY commit after user approval
   - User provides commit message or approves provided message
   - Use conventional commit format with emoji
   - Keep commits focused on single feature

6. **Next Feature**:
   - Move to next component/feature in the phase
   - Repeat cycle from step 1

### Key Principles

- ✅ **Small iterations**: One component at a time
- ✅ **Test everything**: Every change tested in Expo Go
- ✅ **User approval**: No commit without "ok"
- ✅ **Documentation first**: Update docs before commit
- ✅ **Incremental progress**: Build confidence with each step

### Example Workflow (Subfase 7.2)

```
Step 1: ordenService.ts
  → Implement CRUD functions
  → Test in /test screen
  → User approval ✅
  → Update docs
  → Commit

Step 2: OrdenCard.tsx
  → Create card component
  → Test visual rendering in /test
  → User approval ✅
  → Update docs
  → Commit

Step 3: SearchBar.tsx
  → Create search component
  → Test search functionality in /test
  → User approval ✅
  → Update docs
  → Commit

Step 4: Continue...
```

### Never Skip Testing

- ❌ NO "it should work" assumptions
- ❌ NO commits without device testing
- ❌ NO batch testing of multiple features
- ✅ ALWAYS test on real Android device
- ✅ ALWAYS get user confirmation

### Library Compatibility (IMPORTANT)

**Expo Go Limitations:**
- Only works with libraries that have NO custom native code OR are included in Expo Go
- Does NOT support TurboModules or New Architecture features
- Check compatibility before installing: https://docs.expo.dev/versions/latest/

**Why AsyncStorage (not MMKV):**
- ❌ MMKV v3.x requires TurboModules → NOT in Expo Go
- ✅ AsyncStorage included in Expo Go, works with QR scan
- Sufficient performance for MVP (10-20x slower but acceptable)

**Checklist Before Installing Any Library:**
```
☐ Does it have native code? (check GitHub package.json)
☐ Is it included in Expo Go? (check expo.dev docs)
☐ Does it work with QR scan?
☐ Or does it require Development Build?
☐ Is there an alternative without native code?
```

If 3+ answers are ✅ → Install. Otherwise, find alternative or use Development Build.

## Type System

**Core Types** (`src/types/ordenTrabajo.ts`):
- `DetalleExtintor`: Individual fire extinguisher details
  - `id`, `extintorNro`, `capacidadUnidad`, `capacidadValor`, `marca`, `tipo`
- `EstadoOrden`: `'completada' | 'anulada'` (orden status)
- `OrdenTrabajoFormData`: Complete form data structure
  - **Metadata**: `id`, `estado`, `fechaCreacion`, `fechaModificacion`
  - Header fields: `fechaEntrega`, `cliente`, `agencia`, `direccion`
  - Final fields: `telefono`, `observaciones`, `prestamoExtintores`, `cantidadPrestamo`
  - Dynamic list: `detalles: DetalleExtintor[]`
- `FieldValidation`: Validation state for a single field
- `FormState`: Complete form state including errors, touched, loading, sync status

## Constants & Static Data

All dropdown options defined in `src/constants/ordenTrabajoConstants.ts`:
- `CLIENTES`: 11 client names (banks, companies)
- `MARCAS`: 11 fire extinguisher brands
- `TIPOS`: 6 extinguisher types (ABC, BC, CO2, etc.)
- `CAPACIDAD_UNIDADES`: 3 units (KILOS, LIBRAS, LITROS)
- `CAPACIDAD_VALORES`: Mapping of unit → available values (e.g., KILOS → ["1 KILOS", "2.5 KILOS", ...])

## Validation

**Zod Schemas** (`src/services/validationService.ts`):
- `HeaderSchema`: Validates fechaEntrega, cliente, conditional agencia/direccion
- `DetalleExtintorSchema`: Validates each extintor (all fields required, extintorNro: 1-10 digits)
- `DetallesSchema`: Validates array of extintores (min 1 item)
- `FinalSchema`: Validates telefono (7-15 digits), observaciones (max 500 chars), prestamo
- `OrdenTrabajoSchemaComplete`: Complete form validation (Header + Detalles + Final)

**Usage Pattern:**
```typescript
import { validateData, OrdenTrabajoSchemaComplete } from './services/validationService'

const result = validateData(OrdenTrabajoSchemaComplete, formData)
if (result.valid) {
  // Submit form
} else {
  // Display result.errors
}
```

## State Management Pattern

Form state managed through `useFormData` hook:

```typescript
const { data, errors, touched, updateField, validate } = useFormData(
  'orden_trabajo_key',      // AsyncStorage key
  initialFormData,          // Initial/default values
  HeaderSchema,             // Zod schema for validation
  { autoSave: true, debounceMs: 500 }  // Options
)

// Update single field
updateField('cliente', 'BANCO NACIONAL DE BOLIVIA S.A.')

// Validate before submit
if (validate()) {
  // Submit form
}
```

## Testing Approach

**Development Testing:**
- `app/test.tsx` screen for testing components and services during development
- Test CRUD operations, QR scanner, form components, etc.
- Run tests by navigating to `/test` route in app

**Manual Testing Workflow:**
1. Implement feature incrementally
2. Test in Expo Go on physical device (Android priority)
3. Verify TypeScript: `npx tsc --noEmit`
4. Get user approval before commit
5. Document changes and commit

**Testing Screens:**
- Lista de órdenes: Pull-to-refresh, search, navigation
- Detalles: All data display, back navigation
- Formulario: Validation, persistence, submit
- QR Scanner: Permissions, scanning, auto-fill

## UI/UX Principles

- **Touch-Friendly**: Buttons ≥48x48px, inputs ≥44px height, spacing ≥16px
- **Single Column Layout**: Mobile-first, vertical scrolling
- **Progressive Disclosure**: Show only relevant fields (conditional logic)
- **Real-time Feedback**: Validation icons (🟢/🔴), inline error messages
- **Offline Indicator**: Visual sync status (saved, syncing, error)

## Project Status

**Current Phase: FASE 8 - Actions & Polish** 🔄

Phase tracking (see README.md and docs/ for details):
- ✅ FASE 1: Setup Inicial (dependencies, structure, types, constants, services)
- ✅ FASE 2: Hooks Base (useStorage, useFormData, useFieldVisibility, useQRReader, useHapticFeedback)
- ✅ FASE 3: Componentes Base (FormInput, FormDropdown, FormDatePicker, ValidationIcon, FeedbackOverlay)
- ✅ FASE 4: Header Form (cliente + fecha + conditional agencia/direccion)
- ✅ FASE 5: Detalles Dinámicos (dynamic list, cascading dropdowns, validation, collapsible items)
- ✅ FASE 5.5: QR Reader (scan QR to auto-fill extintores, haptic feedback)
- ✅ FASE 6: Final + Submit (teléfono, observaciones, préstamo, submit with AsyncStorage)
- ✅ FASE 7: Navegación (Expo Router + Stack Navigation)
  - ✅ Subfase 7.0-7.1: Setup Expo Router, Stack Navigation
  - ✅ Subfase 7.2: Lista de Órdenes + CRUD (ordenService, OrdenCard, SearchBar, FAB)
  - ✅ Subfase 7.3: Detalles de Orden (dynamic route, full data display)
  - ✅ Subfase 7.4: Formulario 2 Pasos (paso1: Cliente, paso2: Extintores + Final)
- 🔄 FASE 8: Acciones y Polish (In Progress)
  - ✅ Subfase 8.1: Editar Orden (edit mode in formulario)
  - ⏳ Subfase 8.2: About + Configuración (secondary screens)
  - ⏳ Subfase 8.3: Compartir Orden (share/export functionality - optional)
  - ⏳ Subfase 8.4: Testing Final + Limpieza (exhaustive testing, cleanup)

**Progress: 87.5%** (7 of 8 phases completed, phase 8 in progress)

**Next Steps:**
1. Complete Subfase 8.2: About + Configuración screens
2. Subfase 8.4: Final testing and cleanup
3. (Optional) Subfase 8.3: Share functionality
4. Production ready! 🚀

## Important Notes

- **TypeScript strict mode** is ENABLED (`tsconfig.json`)
- **New Architecture is NOT enabled** (Expo Go limitation)
- **Stack Navigation over Drawer**: Drawer incompatible with Expo Go due to `react-native-reanimated` issues
- **Expo Go compatible**: All libraries work with QR scan, no Development Build required
- **Spanish language** used in UI, validation messages, and comments
- **All documentation** in `docs/` organized by phase (00-ANALISIS, 01-FASE1-SETUP, ..., 08-FASE8-ACCIONES)
- **Primary platform**: Android (90% of users), iOS tested occasionally
- See `copilot-instructions.md` for detailed GitHub Copilot context
- See `README.md` for complete project overview and setup instructions
- See `docs/07-FASE7-NAVEGACION/` for navigation architecture documentation
- See `docs/08-FASE8-ACCIONES/PLAN_FASE8.md` for current phase plan
