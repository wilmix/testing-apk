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


## Best Practices (KISS, DRY, SOLID)
- **KISS**: Soluciones simples; prefiere built-ins sobre librerías complejas.
- **DRY**: Reusa estilos y componentes; evita duplicación en código.
- **SOLID**:
  - **Single Responsibility**: Un componente por función (ej. Button solo para toques).
  - **Open/Closed**: Extiende sin modificar (ej. temas via props).
  - **Liskov Substitution**: Componentes intercambiables.
  - **Interface Segregation**: Props minimalistas.
  - **Dependency Inversion**: Depende de abstracciones (ej. hooks).

## Troubleshooting
- **Hot Reload**: Si no actualiza, `npx expo start --clear`.
- **Errores de Tema**: Verifica `userInterfaceStyle` y `expo-system-ui`.
- **Librerías**: Confirma versiones compatibles con Expo 54.
- **Performance**: Usa `React.memo` para componentes pesados.
