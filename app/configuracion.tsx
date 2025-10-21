import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Pantalla de Configuración
 * (Temporal para testing - será implementada en Subfase 7.5)
 */
export default function ConfiguracionScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const backgroundColor = isDark ? '#121212' : '#f5f5f5'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          ⚙️ Configuración
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#999' : '#666' }]}>
          Próximamente: Dark Mode toggle, API config
        </Text>
        <Text style={[styles.info, { color: isDark ? '#666' : '#999' }]}>
          Subfase 7.1 - Testing ✅
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  info: {
    fontSize: 12,
    fontStyle: 'italic',
  },
})
