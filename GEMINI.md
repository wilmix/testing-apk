# Project Overview

This is a React Native mobile application built with Expo, designed for field workers to manage work orders for fire extinguisher recharging. The app is designed to be "offline-first," allowing technicians to work without an internet connection.

The main goal of the project is to transform a web-based form into a mobile-optimized experience, improving user experience, enabling offline functionality, and reducing the time it takes to complete a work order.

**Target Platform**: The primary focus is **Android**, as it constitutes 90% of the user base. iOS is a secondary target and tested less frequently.

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
*   **Language:** TypeScript (~5.9.2, strict mode)
*   **State Management:** React Hooks
*   **Data Storage:** `@react-native-async-storage/async-storage`
*   **Validation:** `zod`
*   **UI Components:** `react-native-element-dropdown`, `@react-native-community/datetimepicker`
*   **QR Code Scanning:** `expo-camera`

## Key Architectural Patterns

*   **Library Compatibility (Expo Go):** The project must use libraries compatible with Expo Go, which means no custom native code or TurboModules. This is a critical constraint that led to choosing AsyncStorage over MMKV.
*   **Offline-First with AsyncStorage:** All form data is automatically persisted to local storage. This ensures the app is fully functional without an internet connection.
*   **Real-time Validation with Zod:** Schemas in `src/services/validationService.ts` ensure data integrity on-the-fly, providing immediate feedback.
*   **Custom Hooks for State Management:** Business logic is encapsulated in custom hooks like `useFormData` (manages state, validation, persistence) and `useFieldVisibility` (handles conditional logic).
*   **Component Composition:** The UI is built from small, reusable `FormFields` which are then composed into larger feature components.
*   **Progressive Disclosure:** The form is broken into logical sections to reduce cognitive load, revealing fields only when needed.

## UI/UX Principles

*   **Touch-Friendly:** Buttons and inputs are large (≥44-48px) with ample spacing (≥16px).
*   **Single Column Layout:** A mobile-first, vertical layout is used for clarity.
*   **Real-time Feedback:** Validation icons (🟢/🔴) and inline error messages provide immediate feedback.
*   **Offline Indicator:** The UI should have a visual indicator for data sync status.

## Project Status

*   ✅ FASE 1: Setup Inicial
*   ✅ FASE 2: Hooks Base
*   ✅ FASE 3: Componentes Base
*   ✅ FASE 4: Header Form
*   ✅ FASE 5: Detalles Dinámicos
*   📋 FASE 5.5: QR Reader (Optional)
*   ⏳ FASE 6: Final + Submit (Próxima)
*   ⏳ FASE 7: Testing (Pendiente)

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
    For a clean cache, use:
    ```powershell
    npx expo start --clear
    ```

4.  **Run on a specific platform:**
    *   **Android:** Press `a` in the terminal.
    *   **iOS:** Press `i`.
    *   **Web:** Press `w`.
