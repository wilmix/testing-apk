import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { FormDropdown, FormDatePicker, FormInput, DropdownItem } from '../index'
import { CLIENTES } from '../../constants/ordenTrabajoConstants'
import { validateData, HeaderSchema } from '../../services/validationService'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'

export interface HeaderFormProps {
  data: OrdenTrabajoFormData
  onDataChange: (data: OrdenTrabajoFormData) => void
  onContinue: () => void
  isDark?: boolean
}

export const HeaderForm: React.FC<HeaderFormProps> = ({
  data,
  onDataChange,
  onContinue,
  isDark = false,
}) => {
  // Touched states
  const [touched, setTouched] = useState({
    cliente: false,
    fechaEntrega: false,
    agencia: false,
  })

  // Validation
  const validation = validateData(HeaderSchema, {
    cliente: data.cliente,
    fechaEntrega: data.fechaEntrega,
  })

  const clienteValidation = validation.errors?.cliente
  const fechaValidation = validation.errors?.fechaEntrega

  // Conditional visibility
  const showAgencia = data.cliente === 'BANCO SOLIDARIO S.A.'

  // Cliente items para dropdown
  const clienteItems: DropdownItem[] = CLIENTES.map((c) => ({
    label: c,
    value: c,
  }))

  const handleClienteChange = (item: DropdownItem) => {
    setTouched((prev) => ({ ...prev, cliente: true }))
    onDataChange({
      ...data,
      cliente: item.value as string,
      agencia: '', // Reset agencia cuando cambia cliente
    })
  }

  const handleFechaChange = (date: Date) => {
    setTouched((prev) => ({ ...prev, fechaEntrega: true }))
    onDataChange({
      ...data,
      fechaEntrega: date,
    })
  }

  const handleAgenciaChange = (text: string) => {
    setTouched((prev) => ({ ...prev, agencia: true }))
    onDataChange({
      ...data,
      agencia: text,
    })
  }

  const handleContinue = () => {
    // Mark all as touched
    setTouched({
      cliente: true,
      fechaEntrega: true,
      agencia: true,
    })

    // Validate and continue if valid
    if (validation.valid) {
      onContinue()
    }
  }

  const isFormValid = validation.valid && (!showAgencia || data.agencia.trim() !== '')

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          Orden de Trabajo
        </Text>
        <Text style={[styles.subtitle, isDark ? styles.darkText : styles.lightText]}>
          Información del cliente
        </Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        {/* Cliente Dropdown */}
        <FormDropdown
          label="Cliente *"
          items={clienteItems}
          value={data.cliente}
          onChange={handleClienteChange}
          placeholder="Seleccionar cliente..."
          error={clienteValidation}
          touched={touched.cliente}
          searchable={true}
        />

        {/* Fecha Entrega Date Picker */}
        <FormDatePicker
          label="Fecha de Entrega *"
          value={data.fechaEntrega}
          onChange={handleFechaChange}
          placeholder="Seleccionar fecha..."
          error={fechaValidation}
          touched={touched.fechaEntrega}
          minimumDate={new Date()}
        />

        {/* Agencia (Conditional - only for BANCO SOLIDARIO) */}
        {showAgencia && (
          <FormInput
            label="Agencia *"
            value={data.agencia}
            onChange={handleAgenciaChange}
            placeholder="Escriba el nombre de la agencia..."
            error={data.agencia.trim() === '' && touched.agencia ? 'Agencia requerida' : undefined}
            touched={touched.agencia}
          />
        )}

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Text style={[styles.infoText, isDark ? styles.darkText : styles.lightText]}>
            ℹ️ {showAgencia ? 'Especifique la agencia de Banco Solidario' : 'Información básica del cliente'}
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          isFormValid ? styles.continueButtonEnabled : styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!isFormValid}
      >
        <Text style={styles.continueButtonText}>
          Continuar →
        </Text>
      </TouchableOpacity>

      {/* Validation Status */}
      {touched.cliente && (
        <View
          style={[
            styles.statusBox,
            validation.valid ? styles.statusValid : styles.statusInvalid,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              validation.valid ? styles.statusValidText : styles.statusInvalidText,
            ]}
          >
            {validation.valid ? '✅ Formulario válido' : '❌ Hay errores en el formulario'}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
  formSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoBox: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonEnabled: {
    backgroundColor: '#34C759',
  },
  continueButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusValid: {
    backgroundColor: '#e8f5e9',
  },
  statusInvalid: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusValidText: {
    color: '#388e3c',
  },
  statusInvalidText: {
    color: '#d32f2f',
  },
})
