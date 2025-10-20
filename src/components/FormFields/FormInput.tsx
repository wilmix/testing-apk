import React from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { ValidationIcon } from '../Feedback/ValidationIcon'
import { useTheme } from '../../contexts/ThemeContext'

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
  const { theme } = useTheme()
  const isValid = touched && !error
  const isInvalid = touched && !!error

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.inputBg,
            borderColor: isInvalid
              ? theme.errorBorder
              : isValid
              ? theme.successBorder
              : theme.inputBorder,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: editable ? theme.text : theme.inputDisabledText,
            },
          ]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor={theme.placeholder}
        />
        <ValidationIcon isValid={isValid} isInvalid={isInvalid} />
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44, // Touch-friendly
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
