import React from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { ValidationIcon } from '../Feedback/ValidationIcon'

export interface FormInputProps {
  label?: string
  value: string
  onChange: (text: string) => void
  placeholder?: string
  error?: string
  touched?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'
  editable?: boolean
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  touched,
  keyboardType = 'default',
  editable = true,
}) => {
  const isValid = touched && !error
  const isInvalid = touched && !!error

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            isInvalid && styles.inputError,
            isValid && styles.inputValid,
            !editable && styles.inputDisabled,
          ]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor="#999"
        />
        <ValidationIcon isValid={isValid} isInvalid={isInvalid} />
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44, // Touch-friendly
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  inputValid: {
    borderColor: '#388e3c',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
  },
})
