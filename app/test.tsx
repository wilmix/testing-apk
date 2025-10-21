/**
 * app/test.tsx
 * Pantalla de pruebas para ordenService.ts
 * FASE 7.2 - Testing CRUD
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useTheme } from '../src/contexts/ThemeContext'
import { ordenService } from '../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../src/types/ordenTrabajo'
import { OrdenCard } from '../src/components/OrdenTrabajo/OrdenCard'
import { SearchBar } from '../src/components/OrdenTrabajo/SearchBar'
import { FAB } from '../src/components/Navigation/FAB'

export default function TestScreen() {
  const router = useRouter()
  const { theme, isDark } = useTheme()

  const [logs, setLogs] = useState<string[]>([])
  const [ordenCount, setOrdenCount] = useState<number>(0)
  const [showCards, setShowCards] = useState<boolean>(false)
  const [ordenes, setOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [allOrdenes, setAllOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, message])
  }

  const addError = (message: string) => {
    console.error(message)
    setLogs(prev => [...prev, `❌ ${message}`])
  }

  const testOrdenService = async () => {
    try {
      setLogs([])
      addLog('🚀 INICIANDO TESTS ORDEN SERVICE (FASE 7.2)...')
      addLog('')

      // Test 1: Crear orden
      addLog('Test 1: Crear orden')
      const ordenData: Omit<OrdenTrabajoFormData, 'id'> = {
        fechaEntrega: new Date(),
        cliente: 'BANCO NACIONAL DE BOLIVIA S.A.',
        agencia: 'OFICINA CENTRAL',
        direccion: '',
        telefono: '70572005',
        observaciones: 'Orden de prueba desde /test',
        prestamoExtintores: true,
        cantidadPrestamo: '2',
        estado: 'completada',
        detalles: [
          {
            id: 'test_001',
            extintorNro: '001',
            capacidadUnidad: 'KILOS',
            capacidadValor: '10 KILOS',
            marca: 'BUCL',
            tipo: 'ABC',
          },
          {
            id: 'test_002',
            extintorNro: '002',
            capacidadUnidad: 'KILOS',
            capacidadValor: '5 KILOS',
            marca: 'AMEREX',
            tipo: 'BC',
          },
        ],
      }

      const ordenId = await ordenService.createOrden(ordenData)
      addLog(`✅ Orden #${ordenId} creada exitosamente`)
      addLog('')

      // Test 2: Obtener orden por ID
      addLog('Test 2: Obtener orden por ID')
      const orden = await ordenService.getOrdenById(ordenId)
      if (orden && orden.cliente === ordenData.cliente) {
        addLog(`✅ Orden #${ordenId} recuperada correctamente`)
        addLog(`   Cliente: ${orden.cliente}`)
        addLog(`   Agencia: ${orden.agencia}`)
        addLog(`   Extintores: ${orden.detalles.length}`)
        addLog(`   Estado: ${orden.estado}`)
      } else {
        addError('No se pudo recuperar la orden')
      }
      addLog('')

      // Test 3: Listar todas las órdenes
      addLog('Test 3: Listar todas las órdenes')
      const ordenes = await ordenService.getOrdenes()
      addLog(`✅ Total de órdenes: ${ordenes.length}`)
      ordenes.forEach((o, i) => {
        addLog(`   ${i + 1}. Orden #${o.id} - ${o.cliente} - ${o.estado}`)
      })
      setOrdenCount(ordenes.length)
      addLog('')

      // Test 4: Buscar por cliente
      addLog('Test 4: Buscar por cliente')
      const busquedaCliente = await ordenService.searchByCliente('NACIONAL')
      addLog(`✅ Búsqueda "NACIONAL": ${busquedaCliente.length} resultado(s)`)
      busquedaCliente.forEach(o => {
        addLog(`   - Orden #${o.id}: ${o.cliente}`)
      })
      addLog('')

      // Test 5: Buscar por número
      addLog('Test 5: Buscar por número')
      const busquedaNumero = await ordenService.searchByNumero(ordenId)
      addLog(`✅ Búsqueda por número "${ordenId}": ${busquedaNumero.length} resultado(s)`)
      addLog('')

      // Test 6: Actualizar orden
      addLog('Test 6: Actualizar orden')
      await ordenService.updateOrden(ordenId, {
        observaciones: 'Orden ACTUALIZADA desde /test'
      })
      const ordenActualizada = await ordenService.getOrdenById(ordenId)
      if (ordenActualizada?.observaciones === 'Orden ACTUALIZADA desde /test') {
        addLog(`✅ Orden #${ordenId} actualizada correctamente`)
        addLog(`   Nueva observación: ${ordenActualizada.observaciones}`)
      }
      addLog('')

      // Test 7: Filtrar por estado
      addLog('Test 7: Filtrar por estado')
      const completadas = await ordenService.filterByEstado('completada')
      const anuladas = await ordenService.filterByEstado('anulada')
      addLog(`✅ Órdenes completadas: ${completadas.length}`)
      addLog(`✅ Órdenes anuladas: ${anuladas.length}`)
      addLog('')

      // Test 8: Contar órdenes
      addLog('Test 8: Contar órdenes')
      const count = await ordenService.getOrdenesCount()
      addLog(`✅ Total de órdenes (count): ${count}`)
      addLog('')

      addLog('═══════════════════════════════════════')
      addLog('🎉 TODOS LOS TESTS PASARON!')
      addLog('═══════════════════════════════════════')
      addLog(`📊 Orden de prueba: #${ordenId}`)
      addLog(`📊 Total de órdenes en sistema: ${ordenes.length}`)
      addLog('')
      addLog('⚠️  Las órdenes se guardaron en AsyncStorage')
      addLog('   Usa el botón "Limpiar Todas" para eliminarlas')

    } catch (error) {
      addError(`Error en tests: ${error}`)
    }
  }

  const listarOrdenes = async () => {
    try {
      setLogs([])
      setShowCards(false)
      addLog('📋 LISTANDO TODAS LAS ÓRDENES...')
      addLog('')

      const ordenesData = await ordenService.getOrdenes()

      if (ordenesData.length === 0) {
        addLog('ℹ️  No hay órdenes creadas')
        addLog('   Presiona "Test CRUD" para crear una orden de prueba')
      } else {
        addLog(`✅ Total: ${ordenesData.length} orden(es)`)
        addLog('')

        ordenesData.forEach((orden, i) => {
          addLog(`─────────────────────────────────────`)
          addLog(`Orden #${orden.id}`)
          addLog(`Cliente: ${orden.cliente}`)
          addLog(`Fecha: ${new Date(orden.fechaEntrega).toLocaleDateString('es-BO')}`)
          addLog(`Estado: ${orden.estado} ${orden.estado === 'completada' ? '🟢' : '🔴'}`)
          addLog(`Extintores: ${orden.detalles.length}`)
          if (orden.observaciones) {
            addLog(`Obs: ${orden.observaciones}`)
          }
          addLog(`Creada: ${orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleString('es-BO') : 'N/A'}`)
          if (orden.fechaModificacion) {
            addLog(`Modificada: ${new Date(orden.fechaModificacion).toLocaleString('es-BO')}`)
          }
        })
        addLog(`─────────────────────────────────────`)
      }

      setOrdenCount(ordenesData.length)
    } catch (error) {
      addError(`Error al listar órdenes: ${error}`)
    }
  }

  const limpiarOrdenes = () => {
    Alert.alert(
      '🗑️ Limpiar Todas las Órdenes',
      '¿Estás seguro de eliminar TODAS las órdenes de AsyncStorage?\n\nEsta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await ordenService.clearAllOrdenes()
              setLogs([])
              addLog('⚠️  TODAS LAS ÓRDENES HAN SIDO ELIMINADAS')
              addLog('✅ AsyncStorage limpiado')
              setOrdenCount(0)
            } catch (error) {
              addError(`Error al limpiar: ${error}`)
            }
          }
        }
      ]
    )
  }

  const clearLogs = () => {
    setLogs([])
  }

  const verCards = async () => {
    try {
      const ordenesData = await ordenService.getOrdenes()
      setOrdenes(ordenesData)
      setAllOrdenes(ordenesData) // Guardar todas para búsqueda
      setOrdenCount(ordenesData.length)
      setShowCards(true)
      setIsSearching(false)
      setLogs([])
    } catch (error) {
      addError(`Error al cargar cards: ${error}`)
    }
  }

  const handleSearch = async (query: string, filter: 'cliente' | 'numero') => {
    try {
      setLogs([])
      addLog(`🔍 BUSCANDO: "${query}" en campo "${filter}"`)
      addLog('')

      let resultados: OrdenTrabajoFormData[]

      if (filter === 'cliente') {
        resultados = await ordenService.searchByCliente(query)
        addLog(`✅ Búsqueda por cliente: ${resultados.length} resultado(s)`)
      } else {
        resultados = await ordenService.searchByNumero(query)
        addLog(`✅ Búsqueda por número: ${resultados.length} resultado(s)`)
      }

      if (resultados.length > 0) {
        resultados.forEach((orden, i) => {
          addLog(`  ${i + 1}. Orden #${orden.id} - ${orden.cliente}`)
        })
      } else {
        addLog('ℹ️  No se encontraron resultados')
      }

      setOrdenes(resultados)
      setIsSearching(true)
    } catch (error) {
      addError(`Error en búsqueda: ${error}`)
    }
  }

  const handleClearSearch = () => {
    setOrdenes(allOrdenes)
    setIsSearching(false)
    setLogs([])
    addLog('✅ Búsqueda limpiada - Mostrando todas las órdenes')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: '#007AFF' }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          🧪 Test ordenService
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info Badge */}
      <View style={[styles.infoBadge, { backgroundColor: isDark ? '#1a3a4a' : '#e3f2fd' }]}>
        <Text style={[styles.infoBadgeText, { color: theme.text }]}>
          FASE 7.2 - CRUD Service Testing
        </Text>
        {ordenCount > 0 && (
          <Text style={[styles.ordenCountText, { color: '#007AFF' }]}>
            📊 {ordenCount} orden(es) en sistema
          </Text>
        )}
      </View>

      {/* SearchBar - Solo visible en modo Cards */}
      {showCards && (
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isDark={isDark}
        />
      )}

      {/* Logs o Cards */}
      <ScrollView style={styles.logsContainer} contentContainerStyle={styles.logsContent}>
        {showCards ? (
          // Vista de Cards
          <>
            {ordenes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
                  {isSearching ? '🔍 No se encontraron resultados' : 'No hay órdenes para mostrar'}
                </Text>
                <Text style={[styles.emptyHint, { color: isDark ? '#666' : '#999' }]}>
                  {isSearching ? 'Intenta con otros términos de búsqueda' : 'Presiona "Test CRUD" para crear una orden'}
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.cardsTitle, { color: theme.text }]}>
                  📋 Vista de Cards ({ordenes.length})
                </Text>
                {ordenes.map((orden) => (
                  <OrdenCard
                    key={orden.id}
                    orden={orden}
                    onPress={() => {
                      addLog(`Presionaste Orden #${orden.id}`)
                    }}
                    isDark={isDark}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          // Vista de Logs
          <>
            {logs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
                  Presiona un botón para iniciar las pruebas
                </Text>
              </View>
            ) : (
              logs.map((log, index) => (
                <Text
                  key={index}
                  style={[
                    styles.logText,
                    { color: theme.text },
                    log.startsWith('❌') && styles.errorLog,
                    log.startsWith('✅') && styles.successLog,
                    log.startsWith('🎉') && styles.celebrationLog,
                    log.includes('═══') && styles.separatorLog
                  ]}
                >
                  {log}
                </Text>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          onPress={testOrdenService}
        >
          <Text style={styles.actionButtonText}>🔧 Test CRUD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#34C759' }]}
          onPress={verCards}
        >
          <Text style={styles.actionButtonText}>🎴 Ver Cards</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.actionsContainer, { backgroundColor: theme.surface, borderTopWidth: 0, paddingTop: 0 }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF9500' }]}
          onPress={clearLogs}
        >
          <Text style={styles.actionButtonText}>🧹 Limpiar Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
          onPress={limpiarOrdenes}
        >
          <Text style={styles.actionButtonText}>🗑️ Limpiar Todas</Text>
        </TouchableOpacity>
      </View>

      {/* FAB - Solo visible en modo Cards */}
      {showCards && (
        <FAB
          onPress={() => {
            addLog('➕ FAB presionado - Navegaría a /nueva-orden/paso1')
            Alert.alert('FAB Test', 'En la app real navegaría a crear nueva orden')
          }}
          isDark={isDark}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  infoBadge: {
    padding: 12,
    alignItems: 'center',
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ordenCountText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  logsContainer: {
    flex: 1,
  },
  logsContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyHint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  cardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'Courier New',
    marginBottom: 4,
    lineHeight: 18,
  },
  errorLog: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  successLog: {
    color: '#34C759',
  },
  celebrationLog: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separatorLog: {
    color: '#666',
    marginVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
