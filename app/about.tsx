import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Pantalla About
 * (Temporal para testing - será implementada en Subfase 7.5)
 */
export default function AboutScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const backgroundColor = isDark ? '#121212' : '#f5f5f5'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={styles.logo}>📱</Text>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Orden de Trabajo Mobile
        </Text>
        <Text style={[styles.version, { color: isDark ? '#999' : '#666' }]}>
          Versión 1.0.0
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
  logo: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    marginBottom: 32,
  },
  info: {
    fontSize: 12,
    fontStyle: 'italic',
  },
})
