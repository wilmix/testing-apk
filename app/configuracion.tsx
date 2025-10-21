import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, ThemeMode } from '../src/contexts/ThemeContext'

/**
 * Pantalla de Configuración
 * Permite al usuario configurar preferencias de la aplicación
 */
export default function ConfiguracionScreen() {
  const { theme, isDark, themeMode, setThemeMode } = useTheme()

  /**
   * Opciones de tema disponibles
   */
  const themeOptions: { value: ThemeMode; label: string; description: string; icon: string }[] = [
    {
      value: 'auto',
      label: 'Automático',
      description: 'Sigue la configuración del sistema',
      icon: '🌓',
    },
    {
      value: 'light',
      label: 'Claro',
      description: 'Siempre usa tema claro',
      icon: '☀️',
    },
    {
      value: 'dark',
      label: 'Oscuro',
      description: 'Siempre usa tema oscuro',
      icon: '🌙',
    },
  ]

  /**
   * Maneja el cambio de tema
   */
  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await setThemeMode(mode)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el tema. Inténtalo de nuevo.')
    }
  }

  /**
   * Botón opcional para limpiar caché (futuro)
   */
  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      'Esta función estará disponible en una próxima actualización.',
      [{ text: 'OK' }]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección: Apariencia */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🎨 Apariencia
          </Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Selecciona el tema de la aplicación
          </Text>

          {/* Opciones de tema */}
          <View style={styles.themeOptions}>
            {themeOptions.map((option) => {
              const isSelected = themeMode === option.value
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: theme.surface,
                      borderColor: isSelected ? theme.info : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleThemeChange(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeOptionContent}>
                    {/* Icono */}
                    <Text style={styles.themeOptionIcon}>{option.icon}</Text>

                    {/* Textos */}
                    <View style={styles.themeOptionTexts}>
                      <Text style={[styles.themeOptionLabel, { color: theme.text }]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.themeOptionDescription, { color: theme.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>

                    {/* Checkmark si está seleccionado */}
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Sección: Almacenamiento */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            💾 Almacenamiento
          </Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Gestiona los datos guardados localmente
          </Text>

          {/* Botón Limpiar Caché */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              🗑️ Limpiar Caché
            </Text>
            <Text style={[styles.actionButtonDescription, { color: theme.textTertiary }]}>
              Próximamente
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info del tema actual */}
        <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Tema actual: <Text style={{ fontWeight: '600', color: theme.text }}>
              {isDark ? 'Oscuro' : 'Claro'}
            </Text> ({themeMode})
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    borderRadius: 12,
    padding: 16,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOptionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  themeOptionTexts: {
    flex: 1,
  },
  themeOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  checkmark: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '700',
  },
  actionButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 12,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
})
