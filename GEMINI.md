# Project Overview

**REX/Mobile** - This is a React Native mobile application built with Expo, designed for field workers (fire extinguisher recharge technicians) to manage work orders. The app is designed to be "offline-first," allowing technicians to work without an internet connection.

The main goal of the project is to transform a web-based form into a mobile-optimized experience, improving user experience by 70-80%, enabling offline functionality, and reducing the time it takes to complete a work order from 5-10 minutes to 1-2 minutes.

**Target Platform**: The primary focus is **Android**, as it constitutes 90% of the user base. iOS is a secondary target and tested occasionally.

## Development Philosophy

The project adheres to the following core principles and guidelines:

### Core Principles
*   **KISS (Keep It Simple, Stupid):** Prioritize simple, straightforward, and elegant solutions over complex or clever ones. No over-engineering.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication by abstracting and reusing code wherever possible to maintain a single source of truth.
*   **SOLID:** Follow clean architecture principles for maintainable and scalable code (Single Responsibility, Open/Closed, etc.).

### Guidelines
*   ✅ Write code that is **simple, efficient, and elegant**.
*   ✅ Prefer native solutions or libraries already included in Expo over heavy third-party libraries.
*   ✅ Use **one library per problem** to avoid conflicting approaches (e.g., a single library for safe area).
*   ✅ **Delete code** before adding complexity; refactor aggressively.
*   ❌ No over-abstraction or premature optimization.
*   ❌ No "just in case" features that are not required.

## Key Technologies

*   **UI Framework:** React Native with Expo (~54.0.13)
*   **Navigation:** Expo Router (~6.0.13) with Stack Navigation
*   **Language:** TypeScript (~5.9.2, strict mode enabled)
*   **State Management:** React Hooks (no Redux)
*   **Data Storage:** `@react-native-async-storage/async-storage` (2.2.0)
*   **Validation:** `zod` (3.25.76)
*   **UI Components:** 
    *   `react-native-element-dropdown` (2.12.4) - Touch-optimized dropdowns
    *   `@react-native-community/datetimepicker` (8.4.4) - Native date picker
*   **QR Code Scanning:** `expo-camera` (~17.0.8)
*   **Haptic Feedback:** `expo-haptics` (~15.0.7)
*   **Safe Area:** `react-native-safe-area-context` (~5.6.0)
*   **Theming:** React Context (Dark/Light mode)

## Key Architectural Patterns

*   **Navigation Architecture (Expo Router + Stack):**
    *   File-based routing with routes defined by file structure in `app/` folder
    *   Stack Navigation with native headers (no Drawer - Expo Go compatibility)
    *   Nested Stacks for different sections (`orden/`, `nueva-orden/`)
    *   Dynamic routes using `[id].tsx` pattern (e.g., `/orden/001`)
    *   Reason for Stack over Drawer: `react-native-reanimated` compatibility issues with Expo Go

*   **CRUD Operations (ordenService):**
    *   Centralized service for all orden operations: create, read, update, delete
    *   ID-based storage: Each orden stored separately (`ordenes:data:{id}`)
    *   Index list: `ordenes:list` maintains array of all orden IDs
    *   Auto-incrementing IDs tracked by `ordenes:lastId`
    *   Search functionality: by client name or order number

*   **Form Data Management (2-Step Progressive Disclosure):**
    *   **Paso 1:** Cliente + Fecha + Ubicación (Agencia/Dirección condicional)
    *   **Paso 2:** Extintores (dynamic list) + Info Final (Teléfono, Observaciones, Préstamo)
    *   **Temporary storage:** `temp_nueva_orden` for new orders, `temp_edit_orden` for edits
    *   Conditional fields based on selected values (e.g., agencia only for "BANCO SOLIDARIO S.A.")

*   **Library Compatibility (Expo Go):** 
    *   The project must use libraries compatible with Expo Go, which means no custom native code or TurboModules. 
    *   This critical constraint led to choosing AsyncStorage over MMKV and Stack Navigation over Drawer.

*   **Offline-First with AsyncStorage:** 
    *   All data automatically persisted to local storage with auto-save (500ms debounce)
    *   Migration service handles data schema updates from legacy format
    *   Type-safe wrappers: `getJSON<T>()`, `setJSON()`, `remove()`
    *   App is fully functional without internet connection

*   **Real-time Validation with Zod:** 
    *   Schemas in `src/services/validationService.ts` ensure data integrity
    *   Validation on field blur (touched) and before submit
    *   Spanish error messages for user feedback
    *   Progressive validation: only relevant sections validated at each step

*   **Custom Hooks for State Management:** 
    *   `useFormData<T>`: Manages state, validation, persistence with auto-save
    *   `useFieldVisibility`: Handles conditional field logic
    *   `useStorage<T>`: Low-level AsyncStorage wrapper
    *   `useQRReader`: QR scanning with validation and auto-fill
    *   `useHapticFeedback`: Wrapper for haptic feedback

*   **Component Composition:** 
    *   Atomic components in `FormFields/`: `FormInput`, `FormDropdown`, `FormDatePicker`
    *   Feature components: `OrdenCard`, `SearchBar`, `FAB` (Floating Action Button)
    *   Form sections: `HeaderForm`, `DetallesForm`, `FinalForm`
    *   All components support theming with `isDark` prop

*   **Dynamic Lists & QR Integration:**
    *   Dynamic list of extintores with add/remove functionality
    *   QR scanner auto-fills extintor data from JSON payload
    *   Cascading dropdowns: unit selection filters available capacities
    *   Collapsible items for better UX
    *   Haptic feedback on successful scan

## UI/UX Principles

*   **Touch-Friendly:** Buttons ≥48x48px, inputs ≥44px height, spacing ≥16px
*   **Single Column Layout:** Mobile-first, vertical scrolling design
*   **Progressive Disclosure:** Show only relevant fields, conditional logic hides/shows sections
*   **Real-time Feedback:** Validation icons (🟢 valid/🔴 error), inline error messages with specific details
*   **Offline Indicator:** Visual sync status (saved, syncing, error)
*   **Dark Mode Support:** Automatic theme detection with manual override option
*   **Pull-to-Refresh:** Standard mobile pattern for reloading data
*   **Search & Filter:** Quick access to orders by client name or order number
*   **FAB Navigation:** Floating Action Button for primary actions (create new order)

## Project Status

**Current Phase: FASE 8 - Actions & Polish** 🔄

**Progress: 87.5%** (7 of 8 phases completed)

*   ✅ **FASE 1:** Setup Inicial (dependencies, structure, types, constants, services)
*   ✅ **FASE 2:** Hooks Base (useStorage, useFormData, useFieldVisibility, useQRReader, useHapticFeedback)
*   ✅ **FASE 3:** Componentes Base (FormInput, FormDropdown, FormDatePicker, ValidationIcon, FeedbackOverlay)
*   ✅ **FASE 4:** Header Form (cliente + fecha + conditional agencia/direccion)
*   ✅ **FASE 5:** Detalles Dinámicos (dynamic list, cascading dropdowns, validation, collapsible items)
*   ✅ **FASE 5.5:** QR Reader (scan QR to auto-fill extintores with haptic feedback)
*   ✅ **FASE 6:** Final + Submit (teléfono, observaciones, préstamo, submit with AsyncStorage)
*   ✅ **FASE 7:** Navegación (Expo Router + Stack Navigation)
    *   ✅ Subfase 7.0-7.1: Setup Expo Router, Stack Navigation
    *   ✅ Subfase 7.2: Lista de Órdenes + CRUD (ordenService, OrdenCard, SearchBar, FAB)
    *   ✅ Subfase 7.3: Detalles de Orden (dynamic route, full data display)
    *   ✅ Subfase 7.4: Formulario 2 Pasos (paso1: Cliente, paso2: Extintores + Final)
*   🔄 **FASE 8:** Acciones y Polish (In Progress)
    *   ✅ Subfase 8.1: Editar Orden (edit mode in formulario)
    *   ⏳ Subfase 8.2: About + Configuración (secondary screens)
    *   ⏳ Subfase 8.3: Compartir Orden (share/export functionality - optional)
    *   ⏳ Subfase 8.4: Testing Final + Limpieza (exhaustive testing, cleanup)

**Next Steps:**
1. Complete Subfase 8.2: About + Configuración screens
2. Subfase 8.4: Final testing and cleanup
3. (Optional) Subfase 8.3: Share functionality
4. Production ready! 🚀

## Git Workflow

Use the following emoji convention for commit messages:
*   `✨ feat:` New feature
*   `🐛 fix:` Bug fix
*   `♻️ refactor:` Code refactoring
*   `📝 docs:` Documentation changes
*   `🔧 config:` Configuration changes

## Building and Running

### Prerequisites

*   Node.js >= 18
*   npm or yarn
*   Expo CLI (`npm install -g expo-cli`)
*   Physical Android device with Expo Go app installed (recommended)

### Development Workflow

1.  **Install Dependencies:**
    ```powershell
    npm install
    ```

2.  **Type Check:**
    ```powershell
    npx tsc --noEmit
    ```

3.  **Start the development server:**
    ```powershell
    npx expo start
    ```
    For a clean cache, use:
    ```powershell
    npx expo start --clear
    ```

4.  **Run on a specific platform:**
    *   **Android (Expo Go):** Scan QR code with Expo Go app or press `a` in terminal
    *   **iOS (Expo Go):** Scan QR code with Camera app or press `i` in terminal
    *   **Web:** Press `w` in terminal

### Testing Workflow

**CRITICAL:** All development and testing MUST be done with Expo Go

1. Implement feature incrementally (one component at a time)
2. Test in Expo Go on physical Android device
3. Verify TypeScript: `npx tsc --noEmit`
4. Get user approval before commit
5. Document changes and commit with conventional format

### Important Notes

*   **Expo Go Compatibility:** All libraries must work with Expo Go (no custom native code)
*   **Stack Navigation:** Uses Stack instead of Drawer (Expo Go compatibility)
*   **AsyncStorage:** Uses AsyncStorage instead of MMKV (Expo Go limitation)
*   **TypeScript Strict Mode:** Enabled - all code must be type-safe
*   **Spanish Language:** UI, validation messages, and comments in Spanish
*   **Primary Testing:** Physical Android devices with Expo Go

## Documentation

*   **Main Docs:** `CLAUDE.md` - Complete guide for AI assistants
*   **README:** `README.md` - Project setup and overview
*   **Copilot Instructions:** `copilot-instructions.md` - GitHub Copilot context
*   **Phase Docs:** `docs/` - Documentation organized by development phase
    *   `docs/07-FASE7-NAVEGACION/` - Navigation architecture details
    *   `docs/08-FASE8-ACCIONES/PLAN_FASE8.md` - Current phase plan
