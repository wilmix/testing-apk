import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { ValidationIcon } from '../Feedback/ValidationIcon'
import { useTheme } from '../../contexts/ThemeContext'

export interface DropdownItem {
  label: string
  value: string | number
}

export interface FormDropdownProps {
  label?: string
  items: DropdownItem[]
  value: string | number | null
  onChange: (item: DropdownItem) => void
  placeholder?: string
  error?: string
  touched?: boolean
  editable?: boolean
  searchable?: boolean
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  items,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  touched,
  editable = true,
  searchable = true,
}) => {
  const { theme, isDark } = useTheme()
  const [isFocus, setIsFocus] = useState(false)
  const isValid = touched && !error
  const isInvalid = touched && !!error

  const selectedItem = items.find((item) => item.value === value)

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBg,
              borderColor: isInvalid
                ? theme.errorBorder
                : isValid
                ? theme.successBorder
                : isFocus
                ? theme.borderFocus
                : theme.inputBorder,
            },
          ]}
          placeholderStyle={[
            styles.placeholderStyle,
            { color: theme.placeholder },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: theme.text },
          ]}
          inputSearchStyle={[
            styles.inputSearchStyle,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          iconStyle={styles.iconStyle}
          data={items}
          search={searchable}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder="Buscar..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onChange}
          disable={!editable}
          activeColor={isDark ? '#2c2c2c' : '#f0f0f0'}
          itemTextStyle={[
            styles.itemTextStyle,
            { color: theme.text },
          ]}
          containerStyle={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
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
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    height: 44, // Touch-friendly
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
