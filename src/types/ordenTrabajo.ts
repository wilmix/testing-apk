/**
 * Tipos TypeScript para Orden de Trabajo Mobile
 */

/**
 * Detalle de un extintor individual
 */
export interface DetalleExtintor {
  id: string
  extintorNro: string
  capacidadUnidad: 'KILOS' | 'LIBRAS' | 'LITROS' | ''
  capacidadValor: string
  marca: string
  tipo: 'ABC' | 'BC' | 'CO2' | 'POLVO QUÍMICO SECO' | 'ESPUMA' | 'AGUA' | ''
}

/**
 * Estado de una orden de trabajo
 */
export type EstadoOrden = 'completada' | 'anulada'

/**
 * Datos principales del formulario de Orden de Trabajo
 */
export interface OrdenTrabajoFormData {
  // Campos existentes
  fechaEntrega: Date
  cliente: string
  agencia: string // Para BANCO SOLIDARIO
  direccion: string // Para otros clientes
  telefono: string
  observaciones: string
  prestamoExtintores: boolean
  cantidadPrestamo: string
  detalles: DetalleExtintor[]

  // 🆕 Nuevos campos FASE 7
  id?: string                    // ID de la orden (ej: "001", "002")
  estado?: EstadoOrden           // Estado: completada | anulada (opcional para compatibilidad con App.tsx legacy)
  fechaCreacion?: Date           // Timestamp de creación (opcional para compatibilidad con App.tsx legacy)
  fechaModificacion?: Date       // Última modificación
}

/**
 * Estado de validación de un campo
 */
export interface FieldValidation {
  isValid: boolean
  message?: string
  touched: boolean
}

/**
 * Estado completo del formulario
 */
export interface FormState {
  data: OrdenTrabajoFormData
  errors: Record<string, string>
  touched: Record<string, boolean>
  isLoading: boolean
  lastSavedAt: Date | null
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
}

/**
 * Respuesta de validación
 */
export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Regla de visibilidad de campos
 */
export type VisibilityRule = {
  [fieldName: string]: (data: OrdenTrabajoFormData) => boolean
}

/**
 * Opciones del hook useFormData
 */
export interface UseFormDataOptions {
  autoSave?: boolean
  debounceMs?: number
}
