/**
 * FAB.tsx
 * Floating Action Button - Botón flotante para nueva orden
 * FASE 7.2 - Lista de Órdenes
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface FABProps {
  onPress: () => void
  isDark: boolean
}

export function FAB({ onPress, isDark }: FABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 32,
  },
})
