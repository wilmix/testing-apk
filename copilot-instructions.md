# Copilot Instructions for React Native & Expo Projects

Este documento proporciona instrucciones detalladas y mejores prácticas para trabajar en proyectos de React Native con Expo. Está diseñado para agentes de IA (como GitHub Copilot) y desarrolladores, basado en consultas previas, principios KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself) y SOLID, y recomendaciones actuales de Expo SDK 54 y React Native 0.81.4. Incluye configuraciones, componentes comunes, theming, librerías recomendadas y patrones prácticos.

## Overview
- **Framework**: React Native con Expo para desarrollo cross-platform (Android, iOS, Web).
- **Versiones**: Expo ~54.0.13, React Native 0.81.4, React 19.1.0, TypeScript ~5.9.2.
- **Enfoque**: Apps móviles simples a complejas, con énfasis en UI/UX, estado y navegación.
- **Principios**: KISS (soluciones simples), DRY (evitar duplicación), SOLID (responsabilidades claras).

## Project Setup
### Inicialización
- Usa `npx create-expo-app@latest` para proyectos nuevos.
- Configura `app.json` con `"userInterfaceStyle": "automatic"` para soporte de temas light/dark.
- Instala dependencias con `npx expo install` para compatibilidad.

### Estructura de Archivos
- `App.tsx`: Componente raíz.
- `app.json`: Configuración de Expo.
- `package.json`: Dependencias.
- Usa TypeScript para tipado fuerte.

### Configuración Inicial
- Habilita `newArchEnabled: true` en `app.json` para nueva arquitectura.
- Para temas: Importa `useColorScheme` de 'react-native'.

## Core Components and Features
### Componente Principal (App.tsx)
- **Estructura Básica**:
  ```tsx
  import { StatusBar } from 'expo-status-bar';
  import { StyleSheet, Text, View } from 'react-native';

  export default function App() {
    return (
      <View style={styles.container}>
        <Text>Texto de ejemplo</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  });
  ```
- **Funciones**: Punto de entrada, maneja estado global y navegación.

### Botones Interactivos
- Usa `TouchableOpacity` en lugar de `Button` para estilos custom.
- Ejemplo: Botón con onPress para alert o cambio de estado.
- Espaciado: `marginVertical`, `padding`, `flexDirection: 'row'` para layouts.

### Contadores y Estado
- Usa `useState` para estado local (ej. contador con + y -).
- Ejemplo:
  ```tsx
  const [count, setCount] = useState(0);
  // Botones para incrementar/decrementar
  ```

### Formularios y Selects
- Para selects: `@react-native-picker/picker` (instala con `npx expo install`).
- Ejemplo:
  ```tsx
  import { Picker } from '@react-native-picker/picker';
  const [selected, setSelected] = useState('');
  <Picker selectedValue={selected} onValueChange={setSelected}>
    <Picker.Item label="Opción" value="valor" />
  </Picker>
  ```
- Arrays de opciones: Define const fuera del componente.

### Alertas
- `Alert.alert()` para notificaciones simples.
- Nota: Estilo nativo, no afecta temas de app.

## Theming and Styling
### Sistema de Temas
- **Detección**: `useColorScheme()` para tema del sistema.
- **Manual**: Estado para override (ej. botón toggle).
- **Estilos Condicionales**:
  ```tsx
  const isDark = theme === 'dark';
  <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
  ```
- **StatusBar**: `style={isDark ? 'light' : 'dark'}`.
- **Configuración**: `"userInterfaceStyle": "automatic"` en `app.json`.

### Estilos Recomendados
- Usa `StyleSheet.create` para performance.
- Colores: Define objetos de tema (light/dark).
- Evita inline styles en producción.

## Best Practices (KISS, DRY, SOLID)
- **KISS**: Soluciones simples; prefiere built-ins sobre librerías complejas.
- **DRY**: Reusa estilos y componentes; evita duplicación en código.
- **SOLID**:
  - **Single Responsibility**: Un componente por función (ej. Button solo para toques).
  - **Open/Closed**: Extiende sin modificar (ej. temas via props).
  - **Liskov Substitution**: Componentes intercambiables.
  - **Interface Segregation**: Props minimalistas.
  - **Dependency Inversion**: Depende de abstracciones (ej. hooks).

## Recommended Libraries
Basado en Context7 y Expo docs (SDK 54):
- **UI/Forms**: `@react-native-picker/picker` (selects), `expo/react-native-action-sheet` (menus).
- **Navegación**: `react-native-screens`, `expo-router`.
- **Estado**: Built-in `useState`/`useReducer`; para global, `zustand` o `redux-toolkit`.
- **Animaciones**: `react-native-reanimated`.
- **Imágenes/Iconos**: `expo/vector-icons`, `expo-image`.
- **Almacenamiento**: `expo/secure-store` para datos sensibles.
- **Templates**: `obytes/react-native-template-obytes` (Expo + TypeScript + Tailwind).
- **Otras**: `react-native-logs` para logging, `react-native-blob-util` para archivos.

Instala con `npx expo install` para compatibilidad.

## Common Patterns
- **Estado Local**: `useState` para UI simple.
- **Efectos**: `useEffect` para side-effects (ej. API calls).
- **Layouts**: `flexDirection`, `justifyContent`, `alignItems`.
- **Responsive**: Usa `Dimensions` o hooks como `useWindowDimensions`.
- **Testing**: `jest` + `@testing-library/react-native`.
- **Build**: `eas build` para producción.

## Troubleshooting
- **Hot Reload**: Si no actualiza, `npx expo start --clear`.
- **Errores de Tema**: Verifica `userInterfaceStyle` y `expo-system-ui`.
- **Librerías**: Confirma versiones compatibles con Expo 54.
- **Performance**: Usa `React.memo` para componentes pesados.

Este documento es genérico y se actualiza basado en consultas. Para proyectos específicos, adapta según necesidades.</content>
<parameter name="filePath">c:\dev\react-native\testing-app\copilot-instructions.md