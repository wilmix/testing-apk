import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ValidationIcon } from '../Feedback/ValidationIcon'

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
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.datePickerWrapper}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            isInvalid && styles.dateButtonError,
            isValid && styles.dateButtonValid,
            !editable && styles.dateButtonDisabled,
          ]}
          onPress={() => editable && setShowPicker(true)}
          disabled={!editable}
        >
          <Text
            style={[
              styles.dateButtonText,
              !value && styles.dateButtonPlaceholder,
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
        <View style={styles.iosPicker}>
          <TouchableOpacity
            style={styles.iosPickerButton}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.iosPickerButtonText}>Listo</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
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
    color: '#333',
    marginBottom: 6,
  },
  datePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    height: 44, // Touch-friendly
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  dateButtonError: {
    borderColor: '#d32f2f',
  },
  dateButtonValid: {
    borderColor: '#388e3c',
  },
  dateButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButtonPlaceholder: {
    color: '#999',
  },
  iosPicker: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 20,
  },
  iosPickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  iosPickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
  },
})
