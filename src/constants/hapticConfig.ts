/**
 * Configuración de Vibraciones (Haptic Feedback)
 *
 * Define los patrones de vibración para diferentes eventos.
 * Fácil de modificar: solo cambia los valores aquí para ajustar toda la app.
 *
 * NOTA: Estos valores se usan en useHapticFeedback hook
 */

/**
 * Tipos de retroalimentación háptica disponibles
 */
export enum HapticType {
  SUCCESS = 'success',      // ✅ Éxito - Vibración suave
  WARNING = 'warning',      // ⚠️ Duplicado/Advertencia - Vibración media
  ERROR = 'error',          // ❌ Error - Vibración fuerte
  LIGHT = 'light',          // ✨ Leve/Confirmación - Vibración micro
}

/**
 * Configuración por tipo de evento
 * Puedes cambiar estos valores para ajustar la intensidad y patrón
 */
export const HAPTIC_CONFIG = {
  /**
   * ✅ ÉXITO: QR válido y agregado correctamente
   * Patrón: 1 vibración corta suave
   */
  [HapticType.SUCCESS]: {
    enabled: true,
    label: 'Extintor agregado',
    description: 'Se ejecuta cuando un QR es válido y el extintor se agrega',
  },

  /**
   * ⚠️ ADVERTENCIA: Duplicado detectado
   * Patrón: 2 vibraciones repetidas (alerta)
   * Nota: Más intenso que éxito para llamar la atención
   */
  [HapticType.WARNING]: {
    enabled: true,
    label: 'Duplicado detectado',
    description: 'Se ejecuta cuando el extintor ya existe en la lista',
  },

  /**
   * ❌ ERROR: QR inválido o error de validación
   * Patrón: 3 vibraciones rápidas (alerta fuerte)
   * Nota: Muy intenso para alertar al usuario de un problema
   */
  [HapticType.ERROR]: {
    enabled: true,
    label: 'Error - Reintentar',
    description: 'Se ejecuta cuando el QR es inválido o hay error de validación',
  },

  /**
   * ✨ LEVE: Confirmaciones menores
   * Patrón: 1 vibración micro (casi imperceptible)
   * Uso: Permisos otorgados, escaneo iniciado, etc.
   */
  [HapticType.LIGHT]: {
    enabled: true,
    label: 'Confirmación leve',
    description: 'Se ejecuta para confirmaciones menores (permisos, inicio, etc)',
  },
}

/**
 * Configuración global de vibraciones
 * Cambiar haptic.enabled a false para desactivar todas las vibraciones
 */
export const HAPTIC_GLOBAL_CONFIG = {
  /**
   * Activar/desactivar todas las vibraciones
   * true = vibraciones activas (recomendado)
   * false = desactivar todas las vibraciones
   */
  enabled: true,

  /**
   * Escala de intensidad global (0-1)
   * 1.0 = intensidad normal (recomendado)
   * 0.5 = intensidad reducida a la mitad
   * 0.0 = sin vibraciones
   */
  globalIntensityScale: 1.0,

  /**
   * Desactivar vibraciones por tipo específico (override)
   * Útil si quieres desactivar solo algunos tipos
   */
  disabledTypes: [] as HapticType[],
}

/**
 * Presets predefinidos que puedes usar
 * Cambiar HAPTIC_GLOBAL_CONFIG.enabled a estos presets para cambios rápidos
 */
export const HAPTIC_PRESETS = {
  /**
   * Preset: COMPLETO - Todas las vibraciones activas
   * Uso: Ambiente ruidoso, trabajador necesita máxima retroalimentación
   */
  FULL: {
    enabled: true,
    globalIntensityScale: 1.0,
    disabledTypes: [] as HapticType[],
  },

  /**
   * Preset: MODERADO - Solo vibraciones importantes
   * Uso: Oficina normal, balance entre feedback y discreción
   */
  MODERATE: {
    enabled: true,
    globalIntensityScale: 0.7,
    disabledTypes: [HapticType.LIGHT],
  },

  /**
   * Preset: MÍNIMO - Solo errores y advertencias
   * Uso: Ambiente silencioso o trabajador prefiere mínima vibración
   */
  MINIMAL: {
    enabled: true,
    globalIntensityScale: 0.5,
    disabledTypes: [HapticType.SUCCESS, HapticType.LIGHT],
  },

  /**
   * Preset: DESACTIVADO - Sin vibraciones
   * Uso: Teléfono sin motor de vibración o preferencia del usuario
   */
  DISABLED: {
    enabled: false,
    globalIntensityScale: 0,
    disabledTypes: Object.values(HapticType),
  },
}

/**
 * Función helper para cambiar preset rápidamente
 * Uso: updateHapticPreset('MODERATE')
 */
export const getPreset = (
  presetName: keyof typeof HAPTIC_PRESETS
): typeof HAPTIC_GLOBAL_CONFIG => {
  return HAPTIC_PRESETS[presetName]
}
