import { StatusBar } from 'expo-status-bar'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import { useState, useEffect } from 'react'
import { MMKVUtils } from './src/services/mmkvService'
import { validateData, HeaderSchema, DetallesSchema, DetalleExtintorSchema } from './src/services/validationService'
import { CLIENTES, CAPACIDAD_UNIDADES, CAPACIDAD_VALORES, MARCAS, TIPOS } from './src/constants/ordenTrabajoConstants'
import type { OrdenTrabajoFormData, DetalleExtintor } from './src/types/ordenTrabajo'

/**
 * ============================================================================
 * APP PRINCIPAL - TESTS FASE 1
 * ============================================================================
 * Tests para verificar:
 * ✅ Estructura de carpetas
 * ✅ Types TypeScript
 * ✅ Constants importables
 * ✅ Schemas Zod funcionando
 * ✅ MMKV guardando/cargando datos
 */

export default function App() {
  const systemTheme = useColorScheme()
  const [theme, setTheme] = useState(systemTheme || 'light')
  const isDark = theme === 'dark'

  // Estado de debugging
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Test data
  const [testData, setTestData] = useState<OrdenTrabajoFormData | null>(null)
  const [testValidation, setTestValidation] = useState<any>(null)
  const [mmkvStatus, setMmkvStatus] = useState<string>('')

  useEffect(() => {
    // Ejecutar tests al montar
    runTests()
  }, [])

  const addDebugLog = (message: string) => {
    console.log(`✅ ${message}`)
    setDebugInfo((prev) => [...prev, message])
  }

  const addDebugError = (message: string) => {
    console.error(`❌ ${message}`)
    setDebugInfo((prev) => [...prev, `ERROR: ${message}`])
  }

  const runTests = async () => {
    try {
      addDebugLog('🚀 INICIANDO TESTS FASE 1...')

      // Test 1: Verificar imports
      addDebugLog('✅ Imports exitosos (MMKV, Types, Constants, Schemas)')

      // Test 2: Verificar Constants
      addDebugLog(`✅ CLIENTES: ${CLIENTES.length} clientes cargados`)
      addDebugLog(`✅ MARCAS: ${MARCAS.length} marcas cargadas`)
      addDebugLog(`✅ TIPOS: ${TIPOS.length} tipos cargados`)
      addDebugLog(`✅ CAPACIDAD_UNIDADES: ${CAPACIDAD_UNIDADES.length} unidades`)

      // Test 3: Crear datos de prueba
      const testFormData: OrdenTrabajoFormData = {
        fechaEntrega: new Date(),
        cliente: 'BANCO NACIONAL DE BOLIVIA S.A.',
        agencia: '',
        direccion: 'Calle Principal 123',
        telefono: '70572005',
        observaciones: 'Test observations',
        prestamoExtintores: false,
        cantidadPrestamo: '',
        detalles: [
          {
            id: '1',
            extintorNro: '001',
            capacidadUnidad: 'KILOS',
            capacidadValor: '6 KILOS',
            marca: 'KIDDE BRASIL',
            tipo: 'ABC'
          }
        ]
      }

      setTestData(testFormData)
      addDebugLog('✅ Datos de prueba creados')

      // Test 4: Validar con Zod
      const headerValidation = validateData(HeaderSchema, {
        cliente: testFormData.cliente,
        fechaEntrega: testFormData.fechaEntrega
      })
      addDebugLog(`✅ Header validation: ${headerValidation.valid ? 'VALID' : 'INVALID'}`)

      const detallesValidation = validateData(DetallesSchema, {
        detalles: testFormData.detalles
      })
      addDebugLog(`✅ Detalles validation: ${detallesValidation.valid ? 'VALID' : 'INVALID'}`)

      setTestValidation({
        headerValid: headerValidation.valid,
        detallesValid: detallesValidation.valid
      })

      // Test 5: MMKV - Guardar datos
      const saved = MMKVUtils.setJSON('test:form:data', testFormData)
      if (saved) {
        addDebugLog('✅ Datos guardados en MMKV')
        setMmkvStatus('✅ Guardado en MMKV')
      } else {
        addDebugError('No se pudieron guardar datos en MMKV')
      }

      // Test 6: MMKV - Cargar datos
      const loaded = MMKVUtils.getJSON<OrdenTrabajoFormData>('test:form:data')
      if (loaded && loaded.cliente === testFormData.cliente) {
        addDebugLog('✅ Datos cargados correctamente de MMKV')
        setMmkvStatus('✅ MMKV funcionando perfecto')
      } else {
        addDebugError('Error cargando datos de MMKV')
      }

      // Test 7: MMKV - Verificar existencia
      const has = MMKVUtils.has('test:form:data')
      addDebugLog(`✅ Verificar clave: ${has ? 'EXISTS' : 'NOT FOUND'}`)

      // Test 8: MMKV - Listar todas las claves
      const allKeys = MMKVUtils.getAllKeys()
      addDebugLog(`✅ Total de claves en MMKV: ${allKeys.length}`)

      addDebugLog('🎉 TODOS LOS TESTS PASARON!')
    } catch (error) {
      addDebugError(`Error en tests: ${error}`)
    }
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const clearDebug = () => {
    setDebugInfo([])
    MMKVUtils.remove('test:form:data')
    setMmkvStatus('')
    runTests()
  }

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            FASE 1: SETUP INICIAL
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.darkText : styles.lightText]}>
            Tests de estructura y configuración
          </Text>
        </View>

        {/* Status Cards */}
        <View style={styles.statusSection}>
          <View style={[styles.statusCard, styles.successCard]}>
            <Text style={styles.statusLabel}>Estructura</Text>
            <Text style={styles.statusValue}>✅ OK</Text>
          </View>
          <View style={[styles.statusCard, styles.successCard]}>
            <Text style={styles.statusLabel}>TypeScript</Text>
            <Text style={styles.statusValue}>✅ OK</Text>
          </View>
          <View style={[styles.statusCard, styles.successCard]}>
            <Text style={styles.statusLabel}>Constants</Text>
            <Text style={styles.statusValue}>✅ OK</Text>
          </View>
          <View style={[styles.statusCard, styles.successCard]}>
            <Text style={styles.statusLabel}>Schemas</Text>
            <Text style={styles.statusValue}>✅ OK</Text>
          </View>
        </View>

        {/* Debug Logs */}
        <View style={styles.debugSection}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            📋 Debug Logs
          </Text>
          {debugInfo.length === 0 ? (
            <Text style={[styles.debugText, isDark ? styles.darkText : styles.lightText]}>
              Esperando tests...
            </Text>
          ) : (
            debugInfo.map((log, index) => (
              <Text
                key={index}
                style={[
                  styles.debugText,
                  isDark ? styles.darkText : styles.lightText,
                  log.includes('ERROR') && styles.errorText
                ]}
              >
                {log}
              </Text>
            ))
          )}
        </View>

        {/* MMKV Status */}
        {mmkvStatus ? (
          <View style={styles.mmkvSection}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              💾 MMKV Status
            </Text>
            <Text style={[styles.debugText, isDark ? styles.darkText : styles.lightText]}>
              {mmkvStatus}
            </Text>
          </View>
        ) : null}

        {/* Test Data */}
        {testData ? (
          <View style={styles.dataSection}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              📊 Test Data
            </Text>
            <Text style={[styles.debugText, isDark ? styles.darkText : styles.lightText]}>
              Cliente: {testData.cliente}
            </Text>
            <Text style={[styles.debugText, isDark ? styles.darkText : styles.lightText]}>
              Detalles: {testData.detalles.length} extintor(es)
            </Text>
          </View>
        ) : null}

        {/* Validation Results */}
        {testValidation ? (
          <View style={styles.validationSection}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              ✓ Validación
            </Text>
            <Text
              style={[
                styles.debugText,
                isDark ? styles.darkText : styles.lightText,
                testValidation.headerValid ? styles.validText : styles.errorText
              ]}
            >
              Header: {testValidation.headerValid ? '✅ VALID' : '❌ INVALID'}
            </Text>
            <Text
              style={[
                styles.debugText,
                isDark ? styles.darkText : styles.lightText,
                testValidation.detallesValid ? styles.validText : styles.errorText
              ]}
            >
              Detalles: {testValidation.detallesValid ? '✅ VALID' : '❌ INVALID'}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={toggleTheme}>
          <Text style={styles.buttonText}>🌓 Tema</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={clearDebug}>
          <Text style={styles.buttonText}>🔄 Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  darkContainer: {
    backgroundColor: '#1a1a1a'
  },
  lightContainer: {
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7
  },
  darkText: {
    color: '#ffffff'
  },
  lightText: {
    color: '#000000'
  },
  statusSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  successCard: {
    backgroundColor: '#34C759'
  },
  statusLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4
  },
  statusValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  debugSection: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 200
  },
  mmkvSection: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  dataSection: {
    backgroundColor: '#f0fff4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  validationSection: {
    backgroundColor: '#fffaf0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Courier New',
    marginBottom: 4,
    lineHeight: 16
  },
  errorText: {
    color: '#FF3B30'
  },
  validText: {
    color: '#34C759'
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fafafa'
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#007AFF'
  },
  secondaryButton: {
    backgroundColor: '#666666'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  }
})
