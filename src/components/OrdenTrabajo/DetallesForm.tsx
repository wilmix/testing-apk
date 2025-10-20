/**
 * FASE 5: DetallesForm Component
 *
 * Componente dinámico para agregar/remover extintores
 * - Lista de extintores con opción de agregar más
 * - Cascada: Unidad dropdown → Capacidad dropdown (opciones filtradas)
 * - Validación real-time con DetalleExtintorSchema
 * - Persistencia en AsyncStorage
 * - Theming automático con useTheme() hook
 *
 * Props:
 * - data: OrdenTrabajoFormData (contiene detalles array)
 * - onDataChange: (data: OrdenTrabajoFormData) => void
 * - onContinue: () => void
 */

import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import type { OrdenTrabajoFormData, DetalleExtintor } from '../../types/ordenTrabajo'
import { CAPACIDAD_UNIDADES, CAPACIDAD_VALORES, MARCAS, TIPOS } from '../../constants/ordenTrabajoConstants'
import { validateData, DetallesSchema } from '../../services/validationService'
import { FormInput } from '../FormFields/FormInput'
import { FormDropdown } from '../FormFields/FormDropdown'
import { ValidationIcon } from '../Feedback/ValidationIcon'
import { useTheme } from '../../contexts/ThemeContext'
import { QRScanner } from '../QR/QRScanner'

/**
 * Generar ID único simple
 */
const generateId = (): string => {
  return `extintor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export interface DetallesFormProps {
  data: OrdenTrabajoFormData
  onDataChange: (data: OrdenTrabajoFormData) => void
  onContinue: () => void
}

export const DetallesForm: React.FC<DetallesFormProps> = ({
  data,
  onDataChange,
  onContinue,
}) => {
  const { theme } = useTheme()
  // Estado para rastrear qué campos han sido tocados
  const [touchedDetalles, setTouchedDetalles] = useState<Record<string, Record<string, boolean>>>({})
  const [expandedDetalleId, setExpandedDetalleId] = useState<string | null>(
    data.detalles.length > 0 ? data.detalles[0].id : null
  )
  const [showQRScanner, setShowQRScanner] = useState(false)

  // Validar todo el array de detalles
  const validation = validateData(DetallesSchema, {
    detalles: data.detalles,
  })

  const isFormValid = validation.valid && data.detalles.length > 0

  /**
   * Obtener opciones de capacidad filtradas por unidad
   */
  const getCapacidadOptions = (unidad: string) => {
    if (!unidad) return []
    
    // Mapear directamente según la unidad
    switch (unidad) {
      case 'KILOS':
        return CAPACIDAD_VALORES.KILOS
      case 'LIBRAS':
        return CAPACIDAD_VALORES.LIBRAS
      case 'LITROS':
        return CAPACIDAD_VALORES.LITROS
      default:
        return []
    }
  }

  /**
   * Agregar nuevo extintor
   */
  const handleAddDetalle = useCallback(() => {
    const newDetalle: DetalleExtintor = {
      id: generateId(),
      extintorNro: '',
      capacidadUnidad: '',
      capacidadValor: '',
      marca: '',
      tipo: '',
    }

    const updatedDetalles = [...data.detalles, newDetalle]
    const updatedData = { ...data, detalles: updatedDetalles }

    onDataChange(updatedData)
    setExpandedDetalleId(newDetalle.id)
    setTouchedDetalles((prev) => ({
      ...prev,
      [newDetalle.id]: {},
    }))
  }, [data, onDataChange])

  /**
   * Agregar extintor manualmente (desde el scanner)
   */
  const handleManualAddFromScanner = useCallback(() => {
    setShowQRScanner(false)
    // Agregar un pequeño delay para que el modal se cierre primero
    setTimeout(() => {
      handleAddDetalle()
    }, 100)
  }, [handleAddDetalle])

  /**
   * Agregar extintor desde QR
   */
  const handleQRScanned = useCallback((qrData: Partial<DetalleExtintor>) => {
    // Verificar si el primer extintor está completamente vacío
    const firstDetalle = data.detalles[0]
    const isFirstDetalleEmpty = firstDetalle &&
      !firstDetalle.extintorNro &&
      !firstDetalle.capacidadUnidad &&
      !firstDetalle.capacidadValor &&
      !firstDetalle.marca &&
      !firstDetalle.tipo

    if (isFirstDetalleEmpty && data.detalles.length === 1) {
      // Reemplazar el primer extintor vacío con los datos del QR
      const updatedDetalle: DetalleExtintor = {
        ...firstDetalle,
        extintorNro: qrData.extintorNro || '',
        capacidadUnidad: qrData.capacidadUnidad || '',
        capacidadValor: qrData.capacidadValor || '',
        marca: qrData.marca || '',
        tipo: qrData.tipo || '',
      }

      const updatedData = { ...data, detalles: [updatedDetalle] }
      onDataChange(updatedData)
      setExpandedDetalleId(updatedDetalle.id)

      // No marcar campos como tocados porque vienen del QR
      setTouchedDetalles((prev) => ({
        ...prev,
        [updatedDetalle.id]: {},
      }))
    } else {
      // Agregar nuevo extintor al final
      const newDetalle: DetalleExtintor = {
        id: generateId(),
        extintorNro: qrData.extintorNro || '',
        capacidadUnidad: qrData.capacidadUnidad || '',
        capacidadValor: qrData.capacidadValor || '',
        marca: qrData.marca || '',
        tipo: qrData.tipo || '',
      }

      const updatedDetalles = [...data.detalles, newDetalle]
      const updatedData = { ...data, detalles: updatedDetalles }

      onDataChange(updatedData)
      setExpandedDetalleId(newDetalle.id)

      // No marcar campos como tocados porque vienen del QR
      setTouchedDetalles((prev) => ({
        ...prev,
        [newDetalle.id]: {},
      }))
    }
  }, [data, onDataChange])

  /**
   * Remover extintor
   */
  const handleRemoveDetalle = useCallback(
    (detalleId: string) => {
      if (data.detalles.length === 1) {
        // No permitir remover el último extintor
        return
      }

      const updatedDetalles = data.detalles.filter((d) => d.id !== detalleId)
      const updatedData = { ...data, detalles: updatedDetalles }

      onDataChange(updatedData)
      setTouchedDetalles((prev) => {
        const newTouched = { ...prev }
        delete newTouched[detalleId]
        return newTouched
      })

      if (expandedDetalleId === detalleId) {
        setExpandedDetalleId(updatedDetalles.length > 0 ? updatedDetalles[0].id : null)
      }
    },
    [data, onDataChange, expandedDetalleId]
  )

  /**
   * Actualizar campo de un extintor
   */
  const handleUpdateDetalleField = useCallback(
    (detalleId: string, field: keyof DetalleExtintor, value: string) => {
      const updatedDetalles = data.detalles.map((d) => {
        if (d.id === detalleId) {
          const updated = { ...d, [field]: value }

          // Si cambió la unidad, resetear capacidad
          if (field === 'capacidadUnidad') {
            updated.capacidadValor = ''
          }

          return updated
        }
        return d
      })

      const updatedData = { ...data, detalles: updatedDetalles }
      onDataChange(updatedData)

      // Marcar campo como tocado
      setTouchedDetalles((prev) => ({
        ...prev,
        [detalleId]: {
          ...prev[detalleId],
          [field]: true,
        },
      }))
    },
    [data, onDataChange]
  )

  /**
   * Obtener error para un campo específico
   */
  const getFieldError = (detalleId: string, field: string): string | undefined => {
    // Buscar el detalle
    const detalle = data.detalles.find((d) => d.id === detalleId)
    if (!detalle) return undefined

    // Validar si el campo está vacío
    const fieldValue = detalle[field as keyof DetalleExtintor]
    if (!fieldValue) {
      return `${field} requerido`
    }

    return undefined
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Título y descripción */}
      <View style={[styles.headerSection, { borderBottomColor: theme.info }]}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              📋 Detalles de Extintores
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Agrega los extintores a recargar
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.qrButton, { backgroundColor: theme.infoBg, borderColor: theme.info }]}
            onPress={() => setShowQRScanner(true)}
          >
            <Text style={[styles.qrButtonText, { color: theme.info }]}>📷 QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info box */}
      <View style={[styles.infoBox, { backgroundColor: theme.infoBg, borderLeftColor: theme.info }]}>
        <Text style={[styles.infoText, { color: theme.text }]}>
          ℹ️ Escanea QR o agrega manualmente. Mínimo 1 extintor. Cascada: selecciona Unidad primero, luego Capacidad
        </Text>
      </View>

      {/* Lista de extintores */}
      <View style={styles.detallesListContainer}>
        {data.detalles.map((detalle, index) => {
          const isExpanded = expandedDetalleId === detalle.id
          const touched = touchedDetalles[detalle.id] || {}
          const isValid =
            !!detalle.extintorNro &&
            !!detalle.capacidadUnidad &&
            !!detalle.capacidadValor &&
            !!detalle.marca &&
            !!detalle.tipo

          return (
            <View key={detalle.id} style={styles.detalleContainer}>
              {/* Header del detalle (collapsible) */}
              <TouchableOpacity
                style={[
                  styles.detalleHeader,
                  isExpanded ? styles.detalleHeaderExpanded : styles.detalleHeaderCollapsed,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() =>
                  setExpandedDetalleId(isExpanded ? null : detalle.id)
                }
              >
                <View style={styles.detalleHeaderContent}>
                  <Text style={[styles.detalleHeaderTitle, { color: theme.text }]}>
                    {isExpanded ? '▼' : '▶'} Extintor {index + 1}: {detalle.extintorNro || '(sin número)'}
                  </Text>
                  <ValidationIcon
                    isValid={isValid}
                    isInvalid={Object.keys(touched).length > 0 && !isValid}
                  />
                </View>
              </TouchableOpacity>

              {/* Contenido expandido */}
              {isExpanded && (
                <View
                  style={[
                    styles.detalleContent,
                    { backgroundColor: theme.surfaceVariant },
                  ]}
                >
                  {/* Número de extintor */}
                  <FormInput
                    label="Nº Extintor *"
                    value={detalle.extintorNro}
                    onChange={(value: string) =>
                      handleUpdateDetalleField(detalle.id, 'extintorNro', value)
                    }
                    placeholder="Ej: 001, 102, 999"
                    error={touched.extintorNro ? getFieldError(detalle.id, 'extintorNro') : undefined}
                    touched={!!touched.extintorNro}
                    keyboardType="numeric"
                  />

                  {/* Unidad de capacidad */}
                  <FormDropdown
                    label="Unidad *"
                    items={CAPACIDAD_UNIDADES.map((u) => ({
                      label: u,
                      value: u,
                    }))}
                    value={detalle.capacidadUnidad || null}
                    onChange={(item: any) =>
                      handleUpdateDetalleField(detalle.id, 'capacidadUnidad', item.value)
                    }
                    searchable
                    error={touched.capacidadUnidad ? getFieldError(detalle.id, 'capacidadUnidad') : undefined}
                    touched={!!touched.capacidadUnidad}
                  />

                  {/* Capacidad (cascada) - solo si hay unidad seleccionada */}
                  {detalle.capacidadUnidad && (
                    <FormDropdown
                      label="Capacidad *"
                      items={getCapacidadOptions(detalle.capacidadUnidad).map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={detalle.capacidadValor || null}
                      onChange={(item: any) =>
                        handleUpdateDetalleField(detalle.id, 'capacidadValor', item.value)
                      }
                      searchable
                      error={touched.capacidadValor ? getFieldError(detalle.id, 'capacidadValor') : undefined}
                      touched={!!touched.capacidadValor}
                    />
                  )}

                  {/* Marca */}
                  <FormDropdown
                    label="Marca *"
                    items={MARCAS.map((m) => ({
                      label: m,
                      value: m,
                    }))}
                    value={detalle.marca || null}
                    onChange={(item: any) =>
                      handleUpdateDetalleField(detalle.id, 'marca', item.value)
                    }
                    searchable
                    error={touched.marca ? getFieldError(detalle.id, 'marca') : undefined}
                    touched={!!touched.marca}
                  />

                  {/* Tipo */}
                  <FormDropdown
                    label="Tipo *"
                    items={TIPOS.map((t) => ({
                      label: t,
                      value: t,
                    }))}
                    value={detalle.tipo || null}
                    onChange={(item: any) =>
                      handleUpdateDetalleField(detalle.id, 'tipo', item.value)
                    }
                    searchable
                    error={touched.tipo ? getFieldError(detalle.id, 'tipo') : undefined}
                    touched={!!touched.tipo}
                  />

                  {/* Botón remover */}
                  {data.detalles.length > 1 && (
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: theme.errorBg, borderColor: theme.errorBorder }]}
                      onPress={() => handleRemoveDetalle(detalle.id)}
                    >
                      <Text style={[styles.removeButtonText, { color: theme.error }]}>🗑️ Remover este extintor</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )
        })}
      </View>

      {/* Botón agregar extintor */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.infoBg, borderColor: theme.info }]}
        onPress={handleAddDetalle}
      >
        <Text style={[styles.addButtonText, { color: theme.info }]}>➕ Agregar otro extintor</Text>
      </TouchableOpacity>

      {/* Status de validación */}
      <View style={[styles.validationBox, { backgroundColor: theme.surfaceVariant }]}>
        {isFormValid ? (
          <>
            <Text style={[styles.validationTitle, { color: theme.success }]}>✅ Lista válida</Text>
            <Text style={[styles.validationDetail, { color: theme.text }]}>
              {data.detalles.length} extintor{data.detalles.length !== 1 ? 'es' : ''} agregado{data.detalles.length !== 1 ? 's' : ''}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.validationTitle, { color: theme.error }]}>❌ Hay errores</Text>
            <Text style={[styles.validationDetail, { color: theme.text }]}>
              Completa todos los campos requeridos
            </Text>
          </>
        )}
      </View>

      {/* Info box (solo si válido) */}
      {isFormValid && (
        <View style={[styles.successBox, { backgroundColor: theme.successBg }]}>
          <Text style={[styles.successText, { color: theme.success }]}>
            ✨ Listo para continuar
          </Text>
        </View>
      )}

      {/* Botón continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          isFormValid ? styles.continueButtonEnabled : styles.continueButtonDisabled,
          { backgroundColor: theme.buttonSecondary },
        ]}
        onPress={onContinue}
        disabled={!isFormValid}
      >
        <Text style={[styles.continueButtonText, { color: theme.buttonSecondaryText }]}>
          {isFormValid ? '✅ Continuar →' : '⏳ Completa los campos'}
        </Text>
      </TouchableOpacity>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onQRScanned={handleQRScanned}
        onManualAdd={handleManualAddFromScanner}
        existingDetalles={data.detalles}
      />
    </ScrollView>
  )
}

export default DetallesForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  qrButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 12,
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
  darkSubtitle: {
    color: '#cccccc',
  },
  lightSubtitle: {
    color: '#666666',
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  darkInfoBox: {
    backgroundColor: '#1a3a4a',
  },
  lightInfoBox: {
    backgroundColor: '#e6f2ff',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  detallesListContainer: {
    marginBottom: 20,
    gap: 12,
  },
  detalleContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  detalleHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkDetalleHeader: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
  },
  lightDetalleHeader: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
  },
  detalleHeaderExpanded: {
    borderBottomWidth: 1,
  },
  detalleHeaderCollapsed: {
    borderBottomWidth: 0,
  },
  detalleHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalleHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  detalleContent: {
    padding: 16,
    gap: 16,
  },
  darkDetalleContent: {
    backgroundColor: '#222222',
  },
  lightDetalleContent: {
    backgroundColor: '#fafafa',
  },
  removeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
  darkRemoveButton: {
    backgroundColor: '#3a1a1a',
    borderColor: '#8b4a4a',
  },
  lightRemoveButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffcccc',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 20,
  },
  darkAddButton: {
    borderColor: '#0066CC',
    backgroundColor: '#1a2a4a',
  },
  lightAddButton: {
    borderColor: '#0066CC',
    backgroundColor: '#e6f2ff',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  validationBox: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  darkValidationBox: {
    backgroundColor: '#2a2a2a',
  },
  lightValidationBox: {
    backgroundColor: '#f9f9f9',
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  validationDetail: {
    fontSize: 13,
    opacity: 0.8,
  },
  validText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  successBox: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  darkSuccessBox: {
    backgroundColor: '#1a3a2a',
  },
  lightSuccessBox: {
    backgroundColor: '#f0fff4',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  continueButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonEnabled: {
    backgroundColor: '#007AFF',
  },
  continueButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  darkContinueButton: {
    backgroundColor: '#0066CC',
  },
  lightContinueButton: {
    backgroundColor: '#007AFF',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
})
