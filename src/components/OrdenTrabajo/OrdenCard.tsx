/**
 * OrdenCard.tsx
 * Componente de card para mostrar una orden en la lista
 * FASE 7.2 - Lista de Órdenes
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'

interface OrdenCardProps {
  orden: OrdenTrabajoFormData
  onPress: () => void
  isDark: boolean
}

export function OrdenCard({ orden, onPress, isDark }: OrdenCardProps) {
  const estadoColor = orden.estado === 'completada' ? '#4CAF50' : '#F44336'
  const estadoEmoji = orden.estado === 'completada' ? '🟢' : '🔴'

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatEstado = (estado?: string) => {
    if (!estado) return 'Completada'
    return estado.charAt(0).toUpperCase() + estado.slice(1)
  }

  return (
    <TouchableOpacity
      style={[styles.card, {
        backgroundColor: isDark ? '#2a2a2a' : '#fff',
        borderColor: isDark ? '#444' : '#e0e0e0'
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.ordenNumero, { color: isDark ? '#fff' : '#000' }]}>
          📋 Orden #{orden.id}
        </Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          {estadoEmoji} {formatEstado(orden.estado)}
        </Text>
      </View>

      {/* Cliente */}
      <Text style={[styles.cliente, { color: isDark ? '#ddd' : '#333' }]}>
        {orden.cliente}
      </Text>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.infoText, { color: isDark ? '#999' : '#666' }]}>
          {formatDate(orden.fechaEntrega)} · {orden.detalles.length} extintor{orden.detalles.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {/* Agencia o Dirección (opcional) */}
      {(orden.agencia || orden.direccion) && (
        <Text style={[styles.ubicacion, { color: isDark ? '#888' : '#777' }]} numberOfLines={1}>
          📍 {orden.agencia || orden.direccion}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ordenNumero: {
    fontSize: 16,
    fontWeight: '600',
  },
  estado: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cliente: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  info: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
  },
  ubicacion: {
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
})
