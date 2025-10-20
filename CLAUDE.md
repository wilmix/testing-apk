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
| Language | TypeScript | ~5.9.2 | Strict mode enabled |
| Storage | AsyncStorage | 2.2.0 | Offline-first, included in Expo Go |
| Dropdowns | react-native-element-dropdown | 2.12.4 | Touch-optimized with search |
| Validation | Zod | 3.25.76 | Type-safe, Spanish messages |
| Date Picker | @react-native-community/datetimepicker | 8.4.4 | Native iOS/Android |
| QR Scanner | expo-camera | 8.4.4 | Escaneo QR, permisos, Expo Go |
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
src/
├── types/
│   └── ordenTrabajo.ts           # TypeScript interfaces for form data
├── constants/
│   └── ordenTrabajoConstants.ts  # Static data: CLIENTES, MARCAS, TIPOS, etc.
├── services/
│   ├── mmkvService.ts             # AsyncStorage utilities (StorageUtils)
│   └── validationService.ts      # Zod schemas + validateData()
├── hooks/
│   ├── useMMKVStorage.ts         # Generic AsyncStorage hook
│   ├── useFormData.ts            # Form state + validation + persistence
│   └── useFieldVisibility.ts    # Conditional field visibility logic
├── components/
│   ├── FormFields/               # Reusable form inputs
│   │   ├── FormInput.tsx         # Text input with validation
│   │   ├── FormDropdown.tsx      # Searchable dropdown
│   │   └── FormDatePicker.tsx    # Native date picker
│   ├── Feedback/
│   │   └── ValidationIcon.tsx    # Visual validation feedback
│   └── OrdenTrabajo/             # Feature components
│       ├── HeaderForm.tsx        # Cliente + Fecha + Agencia (conditional)
│       └── DetallesForm.tsx      # Dynamic list of extintores
└── components/index.ts           # Barrel exports
```

### Key Architectural Patterns

**1. Form Data Management (Progressive Disclosure)**
- Form split into logical sections: Header → Detalles → Final
- `HeaderForm`: Client, delivery date, agency (conditional on client)
- `DetallesForm`: Dynamic list of fire extinguisher details with add/remove
- Conditional fields based on selected values (e.g., agency only for "BANCO SOLIDARIO")

**2. Offline-First with AsyncStorage**
- All form data persists automatically to AsyncStorage
- `StorageUtils` service provides type-safe wrappers: `getJSON<T>()`, `setJSON()`, `remove()`
- `useFormData` hook integrates auto-save with debouncing (500ms default)
- Data loads on mount, saves on change

**3. Real-time Validation with Zod**
- Schemas defined in `validationService.ts`: `HeaderSchema`, `DetallesSchema`, `DetalleExtintorSchema`
- `validateData()` function returns `{ valid: boolean, errors: Record<string, string> }`
- Validation occurs on field blur (touched) and before submit
- Spanish error messages configured in Zod schemas

**4. Custom Hooks Pattern**
- `useFormData<T>`: Generic hook managing form state, errors, touched fields, validation, and persistence
  - Returns: `{ data, errors, touched, updateField, updateMultiple, reset, validate, setTouched }`
  - Auto-saves to AsyncStorage with configurable debounce
- `useFieldVisibility`: Encapsulates conditional field logic (e.g., show agencia if client === "BANCO SOLIDARIO")
- `useMMKVStorage<T>`: Low-level AsyncStorage wrapper for any key-value storage needs

**5. Component Composition**
- Atomic components in `FormFields/`: `FormInput`, `FormDropdown`, `FormDatePicker`
- Each form field component accepts:
  - `value`, `onValueChange`
  - `label`, `placeholder`
  - `error`, `touched` (for validation UI)
  - `isDark` (for theme)
- `ValidationIcon` provides visual feedback (🟢 valid, 🔴 error)

**6. Dynamic Lists in DetallesForm**
- Each fire extinguisher is a `DetalleExtintor` object with unique `id`
- Add/remove buttons manage the `detalles` array
- Cascading dropdowns: selecting `capacidadUnidad` filters `capacidadValor` options
- Collapsible items with header showing extintor number
- Per-item validation using `DetalleExtintorSchema`

**7. Dark Mode Support**
- `useColorScheme()` detects system theme
- All components accept `isDark` prop
- Styles adjust for light/dark: background, text color, border color
- Configured in `app.json`: `userInterfaceStyle: "automatic"`

## Development Workflow

### Standard Flow (For Each Feature/Phase)
1. **Implement**: Write code, check types (`npx tsc --noEmit`)
2. **Test in Expo Go**: `npx expo start`, scan QR on device
3. **Verify on Phone**: Test functionality, check persistence
4. **Git Commit**: Only if tests pass
5. **Next Phase**: Move to next feature

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
- `OrdenTrabajoFormData`: Complete form data structure
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
- `DetalleExtintorSchema`: Validates each extintor (all fields required except agencia/direccion)
- `DetallesSchema`: Validates array of extintores (min 1 item)

**Usage Pattern:**
```typescript
import { validateData, HeaderSchema } from './services/validationService'

const result = validateData(HeaderSchema, formData)
if (result.valid) {
  // Proceed
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

- `App.tsx` contains test suite for all phases (Phases 1-5)
- Tests verify: imports, types, constants, validation, AsyncStorage, components
- Run tests by launching Expo and checking console output
- Expected output: "🎉 TODOS LOS TESTS PASARON!" in console

## UI/UX Principles

- **Touch-Friendly**: Buttons ≥48x48px, inputs ≥44px height, spacing ≥16px
- **Single Column Layout**: Mobile-first, vertical scrolling
- **Progressive Disclosure**: Show only relevant fields (conditional logic)
- **Real-time Feedback**: Validation icons (🟢/🔴), inline error messages
- **Offline Indicator**: Visual sync status (saved, syncing, error)

## Project Status

Phase tracking (see README.md for details):
- ✅ FASE 1: Setup Inicial (dependencies, structure, types, constants, services)
- ✅ FASE 2: Hooks Base (useMMKVStorage, useFormData, useFieldVisibility)
- ✅ FASE 3: Componentes Base (FormInput, FormDropdown, FormDatePicker, ValidationIcon)
- ✅ FASE 4: Header Form (cliente + fecha + conditional agencia)
- ✅ FASE 5: Detalles Dinámicos (dynamic list, cascading dropdowns, validation)
- 📋 FASE 5.5: QR Reader (optional - scan QR to auto-fill extintores)
- ⏳ FASE 6: Final + Submit (ubicación, teléfono, observaciones, préstamo, API integration)
- ⏳ FASE 7: Testing (end-to-end, offline, performance)

Progress: 5 of 7 phases completed (71%)

## Important Notes

- TypeScript strict mode is ENABLED (`tsconfig.json`)
- New Architecture is NOT enabled (Expo Go limitation)
- Spanish language used in UI, validation messages, and comments
- All documentation in `docs/` organized by phase (00-ANALISIS, 01-FASE1-SETUP, etc.)
- See `copilot-instructions.md` for detailed GitHub Copilot context
- See `README.md` for complete project overview and setup instructions
