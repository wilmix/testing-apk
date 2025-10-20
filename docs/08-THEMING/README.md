# 🎨 Sistema de Theming - Dark/Light Mode

## Descripción

Sistema centralizado de temas para dark/light mode que detecta automáticamente el color scheme del sistema y proporciona acceso global al tema actual.

## Implementación

### ThemeContext

Archivo: `src/contexts/ThemeContext.tsx`

**Características:**
- Detección automática del color scheme del sistema usando `useColorScheme()`
- Temas optimizados para light y dark mode
- Type-safe con TypeScript
- Sin dependencias externas (100% compatible con Expo Go)

### Temas Definidos

#### Light Theme
- **Background**: `#f5f5f5` - Gris muy claro
- **Surface**: `#ffffff` - Blanco
- **Text**: `#1a1a1a` - Casi negro
- **Primary**: `#007AFF` - Azul iOS
- **Success**: `#388e3c` - Verde
- **Error**: `#d32f2f` - Rojo

#### Dark Theme
- **Background**: `#121212` - Negro Material Design
- **Surface**: `#1e1e1e` - Gris muy oscuro
- **Text**: `#ffffff` - Blanco
- **Primary**: `#0a84ff` - Azul iOS dark
- **Success**: `#66bb6a` - Verde más brillante
- **Error**: `#ef5350` - Rojo más brillante

### Paleta Completa

Cada tema incluye:

**Backgrounds:**
- `background`: Background principal de la app
- `surface`: Superficie de componentes (cards, modals)
- `surfaceVariant`: Variante más clara/oscura según el tema

**Text:**
- `text`: Texto principal
- `textSecondary`: Texto secundario (menos prominente)
- `textTertiary`: Texto terciario (aún menos prominente)
- `placeholder`: Placeholders en inputs

**Borders:**
- `border`: Bordes normales
- `borderLight`: Bordes sutiles
- `borderFocus`: Borde cuando está en foco

**States:**
- Error: `error`, `errorBg`, `errorBorder`
- Success: `success`, `successBg`, `successBorder`
- Info: `info`, `infoBg`, `infoBorder`
- Warning: `warning`, `warningBg`, `warningBorder`

**Inputs:**
- `inputBg`: Background de inputs
- `inputBorder`: Borde de inputs
- `inputDisabled`: Background deshabilitado
- `inputDisabledText`: Texto deshabilitado

**Buttons:**
- `buttonPrimary`, `buttonPrimaryText`
- `buttonSecondary`, `buttonSecondaryText`
- `buttonDisabled`, `buttonDisabledText`

**Special:**
- `divider`: Líneas divisorias
- `shadow`: Sombras (usar con opacity)
- `overlay`: Overlays (usar con opacity)

## Uso

### 1. Wrap App con ThemeProvider

```typescript
import { ThemeProvider } from './src/contexts/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

### 2. Usar useTheme Hook en Componentes

```typescript
import { useTheme } from '@/contexts/ThemeContext'

export const MyComponent = () => {
  const { theme, isDark } = useTheme()

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>
        Modo: {isDark ? 'Oscuro' : 'Claro'}
      </Text>
    </View>
  )
}
```

### 3. Patrón Recomendado: Separar Estilos Estáticos y Dinámicos

```typescript
// ✅ CORRECTO
const MyComponent = () => {
  const { theme } = useTheme()

  return (
    <View style={[
      styles.container,  // Estilos estáticos (no cambian)
      { backgroundColor: theme.background }  // Estilos dinámicos (theme)
    ]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Título
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
```

### 4. Evitar Hardcodear Colores

```typescript
// ❌ INCORRECTO
<View style={{ backgroundColor: '#1a1a1a' }}>

// ✅ CORRECTO
<View style={{ backgroundColor: theme.background }}>
```

## Componentes Actualizados

Todos los componentes han sido actualizados para usar el ThemeContext:

- ✅ `FormInput` - Inputs con tema
- ✅ `FormDropdown` - Dropdowns con tema
- ✅ `FormDatePicker` - Date pickers con tema
- ✅ `ValidationIcon` - Iconos de validación con tema
- ✅ `HeaderForm` - Formulario header con tema
- ✅ `DetallesForm` - Formulario detalles con tema

**Importante**: Ninguno de estos componentes acepta un prop `isDark` manualmente. El tema se obtiene automáticamente a través de `useTheme()`.

## Cambios de Migración

### Antes (con isDark prop)

```typescript
// ❌ Viejo patrón
export interface MyComponentProps {
  isDark: boolean
}

export const MyComponent: React.FC<MyComponentProps> = ({ isDark }) => {
  return (
    <View style={isDark ? styles.darkContainer : styles.lightContainer}>
      <Text style={isDark ? styles.darkText : styles.lightText}>
        Texto
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  darkContainer: { backgroundColor: '#1a1a1a' },
  lightContainer: { backgroundColor: '#f5f5f5' },
  darkText: { color: '#ffffff' },
  lightText: { color: '#000000' },
})
```

### Después (con useTheme)

```typescript
// ✅ Nuevo patrón
export interface MyComponentProps {
  // No hay prop isDark
}

export const MyComponent: React.FC<MyComponentProps> = () => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Texto
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // Solo estilos que no cambian con el tema
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
})
```

## Testing

Para testear el tema:

### iOS
1. Abrir Settings → Display & Brightness
2. Cambiar entre Light y Dark
3. La app debería cambiar automáticamente

### Android
1. Abrir Settings → Display → Dark theme
2. Toggle on/off
3. La app debería cambiar automáticamente

### Emulador iOS (Comando rápido)
- `Cmd + Shift + A` para toggle dark mode

### Emulador Android (ADB)
```bash
# Activar dark mode
adb shell "cmd uimode night yes"

# Desactivar dark mode
adb shell "cmd uimode night no"
```

## Best Practices

### 1. Usa Nombres Semánticos

```typescript
// ✅ CORRECTO - Semántico
backgroundColor: theme.surface

// ❌ INCORRECTO - Hardcoded
backgroundColor: '#1e1e1e'
```

### 2. Agrupa Colores Relacionados

```typescript
// ✅ CORRECTO
<View style={{
  backgroundColor: theme.errorBg,
  borderColor: theme.errorBorder,
}}>
  <Text style={{ color: theme.error }}>Error message</Text>
</View>
```

### 3. Usa Opacity para Variantes

```typescript
// Sombras (usar shadow con opacity)
shadowColor: theme.shadow,
shadowOpacity: 0.1,

// Overlays
backgroundColor: theme.overlay,
opacity: 0.5,
```

### 4. Mantén Consistencia

Usa siempre los mismos colores para los mismos tipos de elementos:
- **Primarios**: `buttonPrimary`, `info`
- **Éxito**: `success`, `successBg`
- **Error**: `error`, `errorBg`
- **Advertencias**: `warning`, `warningBg`

## Ventajas del Sistema

✅ **Detección Automática**: No requiere toggle manual
✅ **Type-Safe**: TypeScript garantiza colores correctos
✅ **Centralizado**: Un solo lugar para definir colores
✅ **Sin Librerías**: 100% compatible con Expo Go
✅ **Optimizado**: Sigue Material Design 3 y iOS guidelines
✅ **Mantenible**: Fácil agregar nuevos colores

## Troubleshooting

### El tema no cambia automáticamente
- Verificar que `<ThemeProvider>` envuelve tu app
- Verificar que `useColorScheme()` funciona en tu dispositivo
- En emuladores, a veces requiere reinicio

### Error: "useTheme must be used within ThemeProvider"
- Verificar que el componente está dentro de `<ThemeProvider>`
- Verificar el orden de imports en App.tsx

### Colores no se ven bien en dark mode
- Revisar contraste en `src/contexts/ThemeContext.tsx`
- Ajustar opacidad si es necesario
- Usar colores más brillantes para dark mode

## Futuras Mejoras

Posibles extensiones:
- [ ] Selector manual de tema (light/dark/system)
- [ ] Temas personalizados (blue, green, purple)
- [ ] Persist selected theme en AsyncStorage
- [ ] Animaciones de transición entre temas
- [ ] Modo de alto contraste

## Referencias

- [Expo Color Themes](https://docs.expo.dev/develop/user-interface/color-themes/)
- [Material Design 3 Dark Theme](https://m3.material.io/styles/color/dark-theme/overview)
- [iOS Human Interface Guidelines - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

---

**Implementado**: Fase Theme Context
**Última actualización**: 2025-01-20
