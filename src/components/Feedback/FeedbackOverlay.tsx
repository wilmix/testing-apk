/**
 * FeedbackOverlay Component
 *
 * Muestra feedback visual claro y obvio:
 * - ✅ Éxito (verde)
 * - ❌ Error (rojo)
 * - ⚠️ Duplicado (naranja)
 *
 * Uso:
 * ```tsx
 * <FeedbackOverlay
 *   type="success"
 *   title="¡ÉXITO!"
 *   message="Extintor agregado a la lista"
 *   visible={feedbackVisible}
 *   duration={2000}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface FeedbackOverlayProps {
  /** Tipo de feedback: success (verde), error (rojo), warning (naranja) */
  type: 'success' | 'error' | 'warning'
  /** Título grande (ej: "¡ÉXITO!", "¡ERROR!") */
  title: string
  /** Mensaje descriptivo (1-2 líneas) */
  message: string
  /** Mostrar/ocultar overlay */
  visible: boolean
  /** Duración en ms antes de desaparecer (0 = manual) */
  duration?: number
}

/**
 * Overlay para feedback visual claro y obvio
 * Se muestra en el centro de la pantalla con colores diferenciados
 */
export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  type,
  title,
  message,
  visible,
  duration = 2000,
}) => {
  const [show, setShow] = useState(visible)

  useEffect(() => {
    setShow(visible)

    // Auto-desaparecer después de duration (si duration > 0)
    // NOTA: El componente padre controla el mostrado/ocultado
    // Este timeout es solo de respaldo
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration])

  // No renderizar si no es visible
  if (!show || !visible) return null

  // Configuración por tipo
  const config = {
    success: {
      backgroundColor: '#34C759', // Verde
      icon: '✅',
    },
    error: {
      backgroundColor: '#FF3B30', // Rojo
      icon: '❌',
    },
    warning: {
      backgroundColor: '#FF9500', // Naranja
      icon: '⚠️',
    },
  }

  const { backgroundColor, icon } = config[type]

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor,
        },
      ]}
      pointerEvents="none"
    >
      {/* Ícono grande */}
      <Text style={styles.icon}>{icon}</Text>

      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Mensaje */}
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '45%',
    left: 24,
    right: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
})

export default FeedbackOverlay
