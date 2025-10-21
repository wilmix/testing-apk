import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { FormDropdown } from '../FormFields/FormDropdown'
import { FormDatePicker } from '../FormFields/FormDatePicker'
import { FormInput } from '../FormFields/FormInput'
import type { DropdownItem } from '../FormFields/FormDropdown'
import { CLIENTES } from '../../constants/ordenTrabajoConstants'
import { validateData, HeaderSchema } from '../../services/validationService'
import type { OrdenTrabajoFormData } from '../../types/ordenTrabajo'
import { useTheme } from '../../contexts/ThemeContext'

export interface HeaderFormProps {
  data: OrdenTrabajoFormData
  onDataChange: (data: OrdenTrabajoFormData) => void
  onContinue: () => void
}

export const HeaderForm: React.FC<HeaderFormProps> = ({
  data,
  onDataChange,
  onContinue,
}) => {
  const { theme } = useTheme()
  // Touched states
  const [touched, setTouched] = useState({
    cliente: false,
    fechaEntrega: false,
    agencia: false,
    direccion: false,
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
    const isBancoSolidario = item.value === 'BANCO SOLIDARIO S.A.'
    onDataChange({
      ...data,
      cliente: item.value as string,
      agencia: isBancoSolidario ? data.agencia : '', // Keep agencia if Banco Solidario, clear otherwise
      direccion: !isBancoSolidario ? data.direccion : '', // Keep direccion if not Banco Solidario, clear otherwise
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

  const handleDireccionChange = (text: string) => {
    setTouched((prev) => ({ ...prev, direccion: true }))
    onDataChange({
      ...data,
      direccion: text,
    })
  }

  const handleContinue = () => {
    // Mark all as touched
    setTouched({
      cliente: true,
      fechaEntrega: true,
      agencia: true,
      direccion: true,
    })

    // Validate and continue if valid
    if (validation.valid) {
      onContinue()
    }
  }

  const isFormValid = validation.valid &&
    (showAgencia ? data.agencia.trim() !== '' : data.direccion.trim() !== '')

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={[styles.headerSection, { borderBottomColor: theme.info }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Orden de Trabajo
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
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

        {/* Dirección (Conditional - for other clients) */}
        {!showAgencia && (
          <FormInput
            label="Dirección *"
            value={data.direccion}
            onChange={handleDireccionChange}
            placeholder="Escriba la dirección del cliente..."
            error={data.direccion.trim() === '' && touched.direccion ? 'Dirección requerida' : undefined}
            touched={touched.direccion}
          />
        )}

        {/* Info Text */}
        <View style={[styles.infoBox, { backgroundColor: theme.infoBg, borderLeftColor: theme.info }]}>
          <Text style={[styles.infoText, { color: theme.text }]}>
            ℹ️ {showAgencia ? 'Especifique la agencia de Banco Solidario' : 'Especifique la dirección del cliente'}
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor: isFormValid ? theme.buttonPrimary : theme.buttonDisabled,
          },
        ]}
        onPress={handleContinue}
        disabled={!isFormValid}
      >
        <Text
          style={[
            styles.continueButtonText,
            {
              color: isFormValid ? theme.buttonPrimaryText : theme.buttonDisabledText,
            },
          ]}
        >
          Continuar →
        </Text>
      </TouchableOpacity>

      {/* Validation Status */}
      {touched.cliente && (
        <View
          style={[
            styles.statusBox,
            {
              backgroundColor: validation.valid ? theme.successBg : theme.errorBg,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: validation.valid ? theme.success : theme.error,
              },
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
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
    borderRadius: 8,
    borderLeftWidth: 4,
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
