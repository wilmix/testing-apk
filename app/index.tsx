/**
 * app/index.tsx
 * Pantalla principal - Lista de Órdenes de Trabajo
 * FASE 7.2 - Lista completa con búsqueda, filtros y navegación
 */

import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../src/contexts/ThemeContext'
import { OrdenCard } from '../src/components/OrdenTrabajo/OrdenCard'
import { SearchBar } from '../src/components/OrdenTrabajo/SearchBar'
import { FAB } from '../src/components/Navigation/FAB'
import { ordenService } from '../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../src/types/ordenTrabajo'

export default function OrdenesListScreen() {
  const router = useRouter()
  const { theme, isDark } = useTheme()

  const [ordenes, setOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenTrabajoFormData[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Cargar órdenes al montar
  const loadOrdenes = useCallback(async () => {
    try {
      const data = await ordenService.getOrdenes()
      setOrdenes(data)
      setFilteredOrdenes(data)
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    }
  }, [])

  useEffect(() => {
    loadOrdenes()
  }, [loadOrdenes])

  // Pull to refresh
  const onRefresh = async () => {
    setIsRefreshing(true)
    await loadOrdenes()
    setIsRefreshing(false)
    setIsSearching(false)
  }

  // Búsqueda
  const handleSearch = async (query: string, filter: 'cliente' | 'numero') => {
    try {
      let resultados: OrdenTrabajoFormData[]

      if (filter === 'cliente') {
        resultados = await ordenService.searchByCliente(query)
      } else {
        resultados = await ordenService.searchByNumero(query)
      }

      setFilteredOrdenes(resultados)
      setIsSearching(true)
    } catch (error) {
      console.error('Error en búsqueda:', error)
    }
  }

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setFilteredOrdenes(ordenes)
    setIsSearching(false)
  }

  // Renderizar card de orden
  const renderOrden = ({ item }: { item: OrdenTrabajoFormData }) => (
    <OrdenCard
      orden={item}
      onPress={() => router.push(`/orden/${item.id}`)}
      isDark={isDark}
    />
  )

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {isSearching ? '🔍' : '📋'}
      </Text>
      <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
        {isSearching ? 'No se encontraron órdenes' : 'No hay órdenes creadas'}
      </Text>
      <Text style={[styles.emptyHint, { color: isDark ? '#666' : '#999' }]}>
        {isSearching
          ? 'Intenta con otros términos de búsqueda'
          : 'Presiona el botón + para crear tu primera orden'}
      </Text>
    </View>
  )

  // Key extractor
  const keyExtractor = (item: OrdenTrabajoFormData) => item.id || ''

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Buscador */}
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isDark={isDark}
      />

      {/* Lista de órdenes */}
      <FlatList
        data={filteredOrdenes}
        renderItem={renderOrden}
        keyExtractor={keyExtractor}
        contentContainerStyle={filteredOrdenes.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#fff' : '#000'}
          />
        }
      />

      {/* FAB para nueva orden - Temporalmente va a /test hasta crear formulario */}
      <FAB
        onPress={() => router.push('/test')}
        isDark={isDark}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Espacio para el FAB
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
