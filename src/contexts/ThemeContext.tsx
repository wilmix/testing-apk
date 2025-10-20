/**
 * ThemeContext - Sistema de temas centralizado para dark/light mode
 *
 * Proporciona acceso global al tema actual y detecta automáticamente
 * el color scheme del sistema usando useColorScheme()
 *
 * Uso:
 * ```typescript
 * import { useTheme } from '@/contexts/ThemeContext'
 *
 * const MyComponent = () => {
 *   const { theme, isDark } = useTheme()
 *
 *   return <View style={{ backgroundColor: theme.background }}>...</View>
 * }
 * ```
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useColorScheme } from 'react-native'

/**
 * Definición de colores para Light Theme
 * Optimizado para máxima legibilidad en pantallas móviles
 */
const lightTheme = {
  // Backgrounds
  background: '#f5f5f5',          // Background principal (gris muy claro)
  surface: '#ffffff',             // Superficie de componentes (blanco)
  surfaceVariant: '#fafafa',      // Variante de superficie

  // Text
  text: '#1a1a1a',                // Texto principal (casi negro)
  textSecondary: '#666666',       // Texto secundario (gris medio)
  textTertiary: '#999999',        // Texto terciario (gris claro)
  placeholder: '#999999',         // Placeholder en inputs

  // Borders
  border: '#dddddd',              // Bordes normales
  borderLight: '#e8e8e8',         // Bordes sutiles
  borderFocus: '#007AFF',         // Borde cuando está en foco (azul iOS)

  // States - Error
  error: '#d32f2f',               // Color de error
  errorBg: '#ffebee',             // Background de error
  errorBorder: '#ef5350',         // Borde de error

  // States - Success
  success: '#388e3c',             // Color de éxito
  successBg: '#e8f5e9',           // Background de éxito
  successBorder: '#66bb6a',       // Borde de éxito

  // States - Info
  info: '#007AFF',                // Color de información
  infoBg: '#e3f2fd',              // Background de información
  infoBorder: '#42a5f5',          // Borde de información

  // States - Warning
  warning: '#f57c00',             // Color de advertencia
  warningBg: '#fff3e0',           // Background de advertencia
  warningBorder: '#ff9800',       // Borde de advertencia

  // Inputs
  inputBg: '#f5f5f5',             // Background de inputs
  inputBorder: '#dddddd',         // Borde de inputs
  inputDisabled: '#f0f0f0',       // Background de inputs deshabilitados
  inputDisabledText: '#999999',   // Texto de inputs deshabilitados

  // Buttons
  buttonPrimary: '#34C759',       // Botón primario (verde iOS)
  buttonPrimaryText: '#ffffff',   // Texto botón primario
  buttonSecondary: '#007AFF',     // Botón secundario (azul iOS)
  buttonSecondaryText: '#ffffff', // Texto botón secundario
  buttonDisabled: '#cccccc',      // Botón deshabilitado
  buttonDisabledText: '#999999',  // Texto botón deshabilitado

  // Special
  divider: '#e0e0e0',             // Divisores
  shadow: '#000000',              // Sombras (usar con opacity)
  overlay: '#000000',             // Overlays (usar con opacity 0.5)
} as const

/**
 * Definición de colores para Dark Theme
 * Optimizado para reducir fatiga visual en ambientes oscuros
 * Basado en Material Design 3 dark theme guidelines
 */
const darkTheme = {
  // Backgrounds
  background: '#121212',          // Background principal (negro Material)
  surface: '#1e1e1e',             // Superficie de componentes
  surfaceVariant: '#2c2c2c',      // Variante de superficie (más clara)

  // Text
  text: '#ffffff',                // Texto principal (blanco)
  textSecondary: '#b0b0b0',       // Texto secundario (gris claro)
  textTertiary: '#808080',        // Texto terciario (gris medio)
  placeholder: '#666666',         // Placeholder en inputs

  // Borders
  border: '#444444',              // Bordes normales
  borderLight: '#333333',         // Bordes sutiles
  borderFocus: '#0a84ff',         // Borde cuando está en foco (azul iOS dark)

  // States - Error
  error: '#ef5350',               // Color de error (más brillante para dark)
  errorBg: '#3a1f1f',             // Background de error (oscuro)
  errorBorder: '#e57373',         // Borde de error

  // States - Success
  success: '#66bb6a',             // Color de éxito (más brillante)
  successBg: '#1f3a1f',           // Background de éxito (oscuro)
  successBorder: '#81c784',       // Borde de éxito

  // States - Info
  info: '#0a84ff',                // Color de información (azul iOS dark)
  infoBg: '#1a2a3a',              // Background de información (oscuro)
  infoBorder: '#42a5f5',          // Borde de información

  // States - Warning
  warning: '#ff9800',             // Color de advertencia (más brillante)
  warningBg: '#3a2a1f',           // Background de advertencia (oscuro)
  warningBorder: '#ffa726',       // Borde de advertencia

  // Inputs
  inputBg: '#2c2c2c',             // Background de inputs
  inputBorder: '#444444',         // Borde de inputs
  inputDisabled: '#1a1a1a',       // Background de inputs deshabilitados
  inputDisabledText: '#666666',   // Texto de inputs deshabilitados

  // Buttons
  buttonPrimary: '#30d158',       // Botón primario (verde iOS dark)
  buttonPrimaryText: '#000000',   // Texto botón primario (negro para contraste)
  buttonSecondary: '#0a84ff',     // Botón secundario (azul iOS dark)
  buttonSecondaryText: '#ffffff', // Texto botón secundario
  buttonDisabled: '#3a3a3a',      // Botón deshabilitado
  buttonDisabledText: '#666666',  // Texto botón deshabilitado

  // Special
  divider: '#333333',             // Divisores
  shadow: '#000000',              // Sombras (usar con opacity)
  overlay: '#000000',             // Overlays (usar con opacity 0.7)
} as const

/**
 * Tipo del tema (exportado para TypeScript)
 */
export type Theme = {
  // Backgrounds
  background: string
  surface: string
  surfaceVariant: string

  // Text
  text: string
  textSecondary: string
  textTertiary: string
  placeholder: string

  // Borders
  border: string
  borderLight: string
  borderFocus: string

  // States - Error
  error: string
  errorBg: string
  errorBorder: string

  // States - Success
  success: string
  successBg: string
  successBorder: string

  // States - Info
  info: string
  infoBg: string
  infoBorder: string

  // States - Warning
  warning: string
  warningBg: string
  warningBorder: string

  // Inputs
  inputBg: string
  inputBorder: string
  inputDisabled: string
  inputDisabledText: string

  // Buttons
  buttonPrimary: string
  buttonPrimaryText: string
  buttonSecondary: string
  buttonSecondaryText: string
  buttonDisabled: string
  buttonDisabledText: string

  // Special
  divider: string
  shadow: string
  overlay: string
}

/**
 * Tipo del contexto
 */
interface ThemeContextType {
  theme: Theme
  isDark: boolean
}

/**
 * Context para el tema
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Props del ThemeProvider
 */
interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider - Componente que envuelve la app y proporciona el tema
 *
 * Detecta automáticamente el color scheme del sistema usando useColorScheme()
 * y proporciona el tema correspondiente a todos los componentes hijos
 *
 * @example
 * ```typescript
 * export default function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Detectar color scheme del sistema (null | 'light' | 'dark')
  const colorScheme = useColorScheme()

  // Determinar si es dark mode (default: light si es null)
  const isDark = colorScheme === 'dark'

  // Seleccionar tema según el color scheme
  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook useTheme - Acceso al tema actual
 *
 * Proporciona acceso al tema y al estado isDark desde cualquier componente
 *
 * @throws Error si se usa fuera de ThemeProvider
 *
 * @returns {ThemeContextType} { theme, isDark }
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const { theme, isDark } = useTheme()
 *
 *   return (
 *     <View style={{ backgroundColor: theme.background }}>
 *       <Text style={{ color: theme.text }}>
 *         Current mode: {isDark ? 'Dark' : 'Light'}
 *       </Text>
 *     </View>
 *   )
 * }
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

/**
 * Exports
 */
export { lightTheme, darkTheme }
