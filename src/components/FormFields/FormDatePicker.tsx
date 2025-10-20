import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ValidationIcon } from '../Feedback/ValidationIcon'
import { useTheme } from '../../contexts/ThemeContext'

export interface FormDatePickerProps {
  label?: string
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  error?: string
  touched?: boolean
  editable?: boolean
  minimumDate?: Date
  maximumDate?: Date
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Seleccionar fecha...',
  error,
  touched,
  editable = true,
  minimumDate,
  maximumDate,
}) => {
  const { theme } = useTheme()
  const [showPicker, setShowPicker] = useState(false)
  const isValid = touched && !error
  const isInvalid = touched && !!error

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  const displayValue = value
    ? value.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : placeholder

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.datePickerWrapper}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: editable ? theme.inputBg : theme.inputDisabled,
              borderColor: isInvalid
                ? theme.errorBorder
                : isValid
                ? theme.successBorder
                : theme.inputBorder,
            },
          ]}
          onPress={() => editable && setShowPicker(true)}
          disabled={!editable}
        >
          <Text
            style={[
              styles.dateButtonText,
              {
                color: !value
                  ? theme.placeholder
                  : editable
                  ? theme.text
                  : theme.inputDisabledText,
              },
            ]}
          >
            {displayValue}
          </Text>
        </TouchableOpacity>
        <ValidationIcon isValid={isValid} isInvalid={isInvalid} />
      </View>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <View
          style={[
            styles.iosPicker,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.iosPickerButton,
              { backgroundColor: theme.buttonSecondary },
            ]}
            onPress={() => setShowPicker(false)}
          >
            <Text
              style={[
                styles.iosPickerButtonText,
                { color: theme.buttonSecondaryText },
              ]}
            >
              Listo
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && touched && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  datePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    height: 44, // Touch-friendly
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  iosPicker: {
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  iosPickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  iosPickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
