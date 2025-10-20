/**
 * Hook: useHapticFeedback
 *
 * Proporciona retroalimentación háptica (vibración) configurable
 * para diferentes tipos de eventos (éxito, error, advertencia, etc).
 *
 * Uso:
 * ```typescript
 * const haptic = useHapticFeedback()
 *
 * // Trigger predefinido
 * await haptic.trigger('success')      // ✅ Éxito
 * await haptic.trigger('error')        // ❌ Error
 * await haptic.trigger('warning')      // ⚠️ Advertencia
 * await haptic.trigger('light')        // ✨ Leve
 *
 * // Trigger personalizado
 * await haptic.triggerCustom([50, 100, 50])  // 3 vibraciones customizadas
 * ```
 *
 * Configuración:
 * - Editar `src/constants/hapticConfig.ts` para cambiar patrones
 * - No requiere cambios de código aquí
 */

import { useState, useCallback } from 'react'
import * as Haptics from 'expo-haptics'
import {
  HapticType,
  HAPTIC_CONFIG,
  HAPTIC_GLOBAL_CONFIG,
} from '../constants/hapticConfig'

export interface UseHapticFeedbackReturn {
  /**
   * Trigger vibración predefinida por tipo
   */
  trigger: (type: HapticType | string) => Promise<void>

  /**
   * Trigger vibración personalizada con patrón custom
   * @param pattern Array de duraciones en ms: [vibra, pausa, vibra, ...]
   * @example triggerCustom([50, 100, 50]) = vibra 50ms + pausa 100ms + vibra 50ms
   */
  triggerCustom: (pattern: number[]) => Promise<void>

  /**
   * Verificar si un tipo de vibración está habilitado
   */
  isEnabled: (type: HapticType | string) => boolean

  /**
   * Estado: si las vibraciones están activas globalmente
   */
  isGloballyEnabled: boolean
}

/**
 * Hook para manejar vibraciones de forma configurable
 *
 * Las vibraciones se configuran en src/constants/hapticConfig.ts
 * Este hook solo es responsable de ejecutarlas
 */
export const useHapticFeedback = (): UseHapticFeedbackReturn => {
  const [isGloballyEnabled] = useState(HAPTIC_GLOBAL_CONFIG.enabled)

  /**
   * Verificar si una vibración está habilitada
   */
  const isEnabled = useCallback((type: HapticType | string): boolean => {
    // Si las vibraciones están globalmente desactivadas
    if (!HAPTIC_GLOBAL_CONFIG.enabled) return false

    // Si el tipo está en la lista de desactivados
    if (HAPTIC_GLOBAL_CONFIG.disabledTypes.includes(type as HapticType)) {
      return false
    }

    // Si la configuración específica del tipo está desactivada
    const config = HAPTIC_CONFIG[type as HapticType]
    if (config && !config.enabled) return false

    return true
  }, [])

  /**
   * Trigger vibración predefinida por tipo
   * Usa los patrones definidos en hapticConfig.ts
   */
  const trigger = useCallback(
    async (type: HapticType | string) => {
      try {
        // Verificar si está habilitado
        if (!isEnabled(type)) return

        const hapticType = type as HapticType

        switch (hapticType) {
          case HapticType.SUCCESS:
            // ✅ Éxito: 1 vibración corta suave (Success notification)
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            )
            break

          case HapticType.WARNING:
            // ⚠️ Advertencia: 2 vibraciones (Warning notification)
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            )
            break

          case HapticType.ERROR:
            // ❌ Error: 3 vibraciones intensas (Error notification)
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            )
            break

          case HapticType.LIGHT:
            // ✨ Leve: 1 vibración micro (Light impact)
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            break

          default:
            console.warn(`Tipo de haptic desconocido: ${type}`)
        }
      } catch (error) {
        // Fallar silenciosamente si el dispositivo no soporta vibraciones
        console.warn('Haptic feedback no disponible:', error)
      }
    },
    [isEnabled]
  )

  /**
   * Trigger vibración personalizada con patrón custom
   * Útil para patrones personalizados no predefinidos
   *
   * @param pattern Array de duraciones en ms
   * @example [50, 100, 50] = vibra 50ms + pausa 100ms + vibra 50ms
   */
  const triggerCustom = useCallback(
    async (pattern: number[]) => {
      try {
        // Verificar si está globalmente habilitado
        if (!HAPTIC_GLOBAL_CONFIG.enabled) return

        // Ejecutar el patrón
        for (let i = 0; i < pattern.length; i++) {
          if (i % 2 === 0) {
            // Números en posición par (0, 2, 4...) = vibrar
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            // Dormir durante la duración especificada
            await new Promise(resolve => setTimeout(resolve, pattern[i]))
          } else {
            // Números en posición impar (1, 3, 5...) = pausa
            await new Promise(resolve => setTimeout(resolve, pattern[i]))
          }
        }
      } catch (error) {
        console.warn('Haptic custom feedback no disponible:', error)
      }
    },
    []
  )

  return {
    trigger,
    triggerCustom,
    isEnabled,
    isGloballyEnabled,
  }
}

/**
 * Re-export de tipos y config para facilitar acceso
 */
export { HapticType, HAPTIC_CONFIG, HAPTIC_GLOBAL_CONFIG, HAPTIC_PRESETS } from '../constants/hapticConfig'
