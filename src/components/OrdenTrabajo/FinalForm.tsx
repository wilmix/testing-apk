import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { FormInput } from '../FormFields/FormInput'
import { validateData, FinalSchema, OrdenTrabajoSchemaComplete } from '../../services/validationService'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'
import { useTheme } from '../../contexts/ThemeContext'
import { storageUtils } from '../../services/storageService'
import { STORAGE_KEYS } from '../../constants/ordenTrabajoConstants'

export interface FinalFormProps {
  data: OrdenTrabajoFormData
  onDataChange: (data: OrdenTrabajoFormData) => void
  onSubmit: (data: OrdenTrabajoFormData) => void
  onBack?: () => void
}

export const FinalForm: React.FC<FinalFormProps> = ({
  data,
  onDataChange,
  onSubmit,
  onBack,
}) => {
  const { theme, isDark } = useTheme()

  // Touched states
  const [touched, setTouched] = useState({
    telefono: false,
    observaciones: false,
    cantidadPrestamo: false,
  })

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation
  const validation = validateData(FinalSchema, {
    telefono: data.telefono,
    observaciones: data.observaciones,
    prestamoExtintores: data.prestamoExtintores,
    cantidadPrestamo: data.cantidadPrestamo,
  })

  const telefonoError = touched.telefono ? validation.errors?.telefono : undefined
  const observacionesError = touched.observaciones ? validation.errors?.observaciones : undefined
  const cantidadPrestamoError = touched.cantidadPrestamo ? validation.errors?.cantidadPrestamo : undefined

  // Character count for observaciones
  const observacionesCount = data.observaciones?.length || 0

  const handleTelefonoChange = (text: string) => {
    setTouched((prev) => ({ ...prev, telefono: true }))
    onDataChange({
      ...data,
      telefono: text,
    })
  }

  const handleObservacionesChange = (text: string) => {
    setTouched((prev) => ({ ...prev, observaciones: true }))
    onDataChange({
      ...data,
      observaciones: text,
    })
  }

  const handlePrestamoChange = (value: boolean) => {
    onDataChange({
      ...data,
      prestamoExtintores: value,
      cantidadPrestamo: value ? data.cantidadPrestamo : '', // Reset cantidad si se desmarca
    })
  }

  const handleCantidadPrestamoChange = (text: string) => {
    setTouched((prev) => ({ ...prev, cantidadPrestamo: true }))
    onDataChange({
      ...data,
      cantidadPrestamo: text,
    })
  }

  const handleSubmit = async () => {
    // Mark all as touched
    setTouched({
      telefono: true,
      observaciones: true,
      cantidadPrestamo: true,
    })

    // Validate complete form with all schemas
    const completeValidation = validateData(OrdenTrabajoSchemaComplete, data)

    if (!completeValidation.valid) {
      // Show first error
      const errorMessages = Object.values(completeValidation.errors).filter(Boolean)
      if (errorMessages.length > 0) {
        Alert.alert('Error de Validación', errorMessages[0])
      }
      return
    }

    // Show loading
    setIsSubmitting(true)

    try {
      // Simulate API call (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save to AsyncStorage as history
      const historyKey = `${STORAGE_KEYS.ORDEN_TRABAJO_HISTORY}:${Date.now()}`
      await storageUtils.setJSON(historyKey, data)

      // Call onSubmit callback
      onSubmit(data)

      // Clear draft from AsyncStorage
      await storageUtils.remove(STORAGE_KEYS.ORDEN_TRABAJO_DRAFT)

      // Show success
      Alert.alert(
        '✅ Orden Creada',
        'La orden de trabajo fue creada exitosamente',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ]
      )
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo crear la orden. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    validation.valid &&
    data.telefono.trim() !== '' &&
    (!data.prestamoExtintores || (data.cantidadPrestamo && parseInt(data.cantidadPrestamo) >= 1))

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={[styles.headerSection, { borderBottomColor: theme.info }]}>
        <Text style={[styles.title, { color: theme.text }]}>Datos Finales</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Completa los últimos campos
        </Text>
      </View>

      {/* Teléfono */}
      <View style={styles.section}>
        <FormInput
          label="Teléfono *"
          value={data.telefono}
          onChange={handleTelefonoChange}
          placeholder="Ej: 70572005"
          error={telefonoError}
          touched={touched.telefono}
          keyboardType="phone-pad"
        />
      </View>

      {/* Observaciones */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Observaciones (opcional)</Text>
        <TextInput
          style={[
            styles.textarea,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: observacionesError ? theme.error : theme.border,
            },
          ]}
          value={data.observaciones}
          onChangeText={handleObservacionesChange}
          placeholder="Escribe observaciones adicionales..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />
        <View style={styles.characterCountRow}>
          {observacionesError && (
            <Text style={[styles.errorText, { color: theme.error }]}>{observacionesError}</Text>
          )}
          <Text
            style={[
              styles.characterCount,
              { color: theme.textSecondary },
              observacionesCount > 500 && { color: theme.error },
            ]}
          >
            {observacionesCount}/500
          </Text>
        </View>
      </View>

      {/* Préstamo de Extintores */}
      <View style={styles.section}>
        <View style={[styles.switchRow, { backgroundColor: theme.surface }]}>
          <Text style={[styles.switchLabel, { color: theme.text }]}>¿Prestar extintores?</Text>
          <Switch
            value={data.prestamoExtintores}
            onValueChange={handlePrestamoChange}
            trackColor={{ false: theme.border, true: theme.info }}
            thumbColor={data.prestamoExtintores ? theme.info : theme.textSecondary}
          />
        </View>

        {/* Cantidad de Préstamo (condicional) */}
        {data.prestamoExtintores && (
          <View style={styles.revealSection}>
            <FormInput
              label="Cantidad a prestar *"
              value={data.cantidadPrestamo}
              onChange={handleCantidadPrestamoChange}
              placeholder="Ej: 5"
              error={cantidadPrestamoError}
              touched={touched.cantidadPrestamo}
              keyboardType="numeric"
            />
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Ingresa un número entre 1 y 99
            </Text>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        {onBack && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, { backgroundColor: theme.buttonSecondary }]}
            onPress={onBack}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, { color: theme.buttonSecondaryText }]}>← Atrás</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            {
              backgroundColor: isFormValid && !isSubmitting ? theme.buttonPrimary : theme.border,
            },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {isFormValid ? '✓ Crear Orden' : '⚠️ Completar Campos'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  characterCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  revealSection: {
    marginTop: 8,
    paddingLeft: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {},
  buttonSecondary: {},
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
