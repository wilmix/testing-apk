import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../src/contexts/ThemeContext'

/**
 * Pantalla About
 * Muestra información de la aplicación, versión, desarrollador y copyright
 */
export default function AboutScreen() {
  const { theme, isDark } = useTheme()

  const handleOpenWebsite = async () => {
    const url = 'https://willysalas.com/'
    try {
      const canOpen = await Linking.canOpenURL(url)
      if (canOpen) {
        await Linking.openURL(url)
      } else {
        Alert.alert('Error', 'No se puede abrir el enlace')
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el navegador')
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo */}
          <Text style={styles.logo}>🔥</Text>

          {/* Título */}
          <Text style={[styles.title, { color: theme.text }]}>
            REX/Mobile
          </Text>

          {/* Versión */}
          <Text style={[styles.version, { color: theme.textSecondary }]}>
            Versión 0.0.1
          </Text>

          {/* Descripción */}
          <View style={[styles.descriptionBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Aplicación móvil offline-first para técnicos de recarga de extintores.
              Optimizada para trabajo en campo con sincronización automática.
            </Text>
          </View>

          {/* Información del Desarrollador */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              👨‍💻 Desarrollador
            </Text>
            <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
              Willy Salas Quiroga
            </Text>
            
            {/* Link al sitio web */}
            <TouchableOpacity
              style={[
                styles.websiteButton,
                { 
                  backgroundColor: '#007AFF',
                  borderColor: '#007AFF'
                }
              ]}
              onPress={handleOpenWebsite}
              activeOpacity={0.7}
            >
              <Text style={styles.websiteButtonText}>
                🌐 willysalas.com
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tecnologías */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              🛠️ Tecnologías
            </Text>
            <Text style={[styles.techText, { color: theme.textSecondary }]}>
              React Native • Expo • TypeScript
            </Text>
            <Text style={[styles.techText, { color: theme.textSecondary }]}>
              Expo Router • AsyncStorage • Zod
            </Text>
          </View>

          {/* Copyright */}
          <View style={styles.footer}>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <Text style={[styles.copyright, { color: theme.textTertiary }]}>
              © 2025 REX/Mobile
            </Text>
            <Text style={[styles.copyright, { color: theme.textTertiary }]}>
              Todos los derechos reservados
            </Text>
          </View>
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
    flexGrow: 1,
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  descriptionBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  websiteButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  techText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    height: 1,
    width: '60%',
    marginBottom: 16,
  },
  copyright: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
})
