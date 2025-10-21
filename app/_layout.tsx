import { Stack, useRouter } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { migrationService } from '../src/services/migrationService'

/**
 * Loading screen mostrado durante la migración
 */
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Preparando aplicación...</Text>
    </View>
  )
}

/**
 * Botones del header para navegación
 */
function HeaderButtons() {
  const router = useRouter()

  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity
        onPress={() => router.push('/about')}
        style={styles.headerButton}
        activeOpacity={0.7}
      >
        <Text style={styles.headerButtonText}>ℹ️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/configuracion')}
        style={styles.headerButton}
        activeOpacity={0.7}
      >
        <Text style={styles.headerButtonText}>⚙️</Text>
      </TouchableOpacity>
    </View>
  )
}

/**
 * Root Layout con Stack Navigation
 * Temporal hasta resolver problemas con Drawer + Expo Go
 */
export default function RootLayout() {
  const [isMigrating, setIsMigrating] = useState(true)

  useEffect(() => {
    async function runMigration() {
      await migrationService.migrateToV1()
      setIsMigrating(false)
    }
    runMigration()
  }, [])

  if (isMigrating) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="index"
            options={{
              title: '📋 Mis Órdenes',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#fff',
              headerRight: () => <HeaderButtons />,
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              title: 'About',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="configuracion"
            options={{
              title: 'Configuración',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="test"
            options={{
              title: '🧪 Test',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="orden"
            options={{
              headerShown: false, // Usa su propio Stack layout
            }}
          />
          <Stack.Screen
            name="nueva-orden"
            options={{
              headerShown: false, // Usa su propio Stack layout
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 22,
  },
})
