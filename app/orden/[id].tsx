/**
 * app/orden/[id].tsx
 * Pantalla de Detalles de Orden
 * FASE 7.3 - Muestra información completa de una orden
 */

import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { ordenService } from '../../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

export default function OrdenDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme, isDark } = useTheme()

  const [orden, setOrden] = useState<OrdenTrabajoFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadOrden()
  }, [id])

  const loadOrden = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await ordenService.getOrdenById(id)

      if (data) {
        setOrden(data)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error al cargar orden:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Cargando orden...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state
  if (error || !orden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorText, { color: theme.text }]}>
            No se pudo cargar la orden
          </Text>
          <Text style={[styles.errorHint, { color: isDark ? '#888' : '#666' }]}>
            ID: {id}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Estado color y emoji
  const estadoColor = orden.estado === 'completada' ? '#4CAF50' : '#F44336'
  const estadoEmoji = orden.estado === 'completada' ? '🟢' : '🔴'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Header con número de orden y estado */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.ordenNumero, { color: theme.text }]}>
            Orden #{orden.id}
          </Text>
          <View style={[styles.estadoBadge, { backgroundColor: estadoColor }]}>
            <Text style={styles.estadoText}>
              {estadoEmoji} {orden.estado || 'activa'}
            </Text>
          </View>
        </View>

        {/* Información del Cliente */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            📋 Información del Cliente
          </Text>

          <InfoRow
            label="Cliente"
            value={orden.cliente}
            isDark={isDark}
          />

          {orden.agencia ? (
            <InfoRow
              label="Agencia"
              value={orden.agencia}
              isDark={isDark}
            />
          ) : null}

          {orden.direccion ? (
            <InfoRow
              label="Dirección"
              value={orden.direccion}
              isDark={isDark}
            />
          ) : null}

          <InfoRow
            label="Teléfono"
            value={orden.telefono || 'N/A'}
            isDark={isDark}
          />

          <InfoRow
            label="Fecha de Entrega"
            value={formatDate(orden.fechaEntrega)}
            isDark={isDark}
          />
        </View>

        {/* Detalles de Extintores */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🧯 Detalles de Extintores ({orden.detalles.length})
          </Text>

          {orden.detalles.map((detalle, index) => (
            <View
              key={detalle.id}
              style={[
                styles.extintorCard,
                {
                  backgroundColor: isDark ? '#2c2c2e' : '#f5f5f5',
                  borderColor: isDark ? '#3a3a3c' : '#e0e0e0'
                }
              ]}
            >
              <Text style={[styles.extintorNumero, { color: theme.text }]}>
                Extintor #{index + 1}
              </Text>

              <InfoRow
                label="Número"
                value={detalle.extintorNro || 'N/A'}
                isDark={isDark}
                compact
              />
              <InfoRow
                label="Capacidad"
                value={`${detalle.capacidadValor} (${detalle.capacidadUnidad})`}
                isDark={isDark}
                compact
              />
              <InfoRow
                label="Marca"
                value={detalle.marca || 'N/A'}
                isDark={isDark}
                compact
              />
              <InfoRow
                label="Tipo"
                value={detalle.tipo || 'N/A'}
                isDark={isDark}
                compact
              />
            </View>
          ))}
        </View>

        {/* Información Adicional */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            📝 Información Adicional
          </Text>

          <InfoRow
            label="Préstamo de Extintores"
            value={orden.prestamoExtintores ? 'Sí' : 'No'}
            isDark={isDark}
          />

          {orden.prestamoExtintores && (
            <InfoRow
              label="Cantidad de Préstamo"
              value={orden.cantidadPrestamo || 'N/A'}
              isDark={isDark}
            />
          )}

          {orden.observaciones && (
            <View style={styles.observaciones}>
              <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>
                Observaciones
              </Text>
              <Text style={[styles.observacionesText, { color: theme.text }]}>
                {orden.observaciones}
              </Text>
            </View>
          )}
        </View>

        {/* Metadata */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            🕐 Fechas
          </Text>

          <InfoRow
            label="Creación"
            value={formatDate(orden.fechaCreacion)}
            isDark={isDark}
          />

          {orden.fechaModificacion && (
            <InfoRow
              label="Última Modificación"
              value={formatDate(orden.fechaModificacion)}
              isDark={isDark}
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// Componente auxiliar para mostrar info en formato label: value
interface InfoRowProps {
  label: string
  value: string
  isDark: boolean
  compact?: boolean
}

function InfoRow({ label, value, isDark, compact = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, compact && styles.infoRowCompact]}>
      <Text style={[styles.infoLabel, { color: isDark ? '#888' : '#666' }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Loading
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },

  // Error
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Header
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ordenNumero: {
    fontSize: 24,
    fontWeight: '700',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Sections
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  // Info Row
  infoRow: {
    marginBottom: 12,
  },
  infoRowCompact: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Extintor Card
  extintorCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  extintorNumero: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  // Observaciones
  observaciones: {
    marginTop: 4,
  },
  observacionesText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
})
